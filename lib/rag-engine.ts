import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mammoth from 'mammoth';
import { RAG_DATA_SOURCE_PATH, RAG_DATA_SOURCES, RAG_CONFIG } from '@/config/rag-config';

// Pure Node.js PDF parser with zero DOM/canvas requirements
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFParser = require('pdf2json');

export interface RAGChunk {
  id: string;
  sectionTitle: string;
  content: string;
  score?: number;
  tokens: string[];
  vector?: Record<string, number>;
  denseEmbedding?: number[];
  sourceDocument?: string;
}

export interface RAGCacheManifest {
  sourcePath: string;
  sourcePaths?: string[];
  resolvedPath: string;
  resolvedPaths?: string[];
  fileSize: number;
  mtimeMs: number;
  contentHash: string;
  docFrequency: Record<string, number>;
  totalTokens: number;
  lastIngestedAt: string;
  chunks: RAGChunk[];
}

// In-memory runtime cache
let memoryCache: RAGCacheManifest | null = null;

/**
 * Resolves configured data source path to an absolute filesystem path.
 */
function resolveDataSourcePath(configPath: string): string {
  const rootDir = process.cwd();
  if (path.isAbsolute(configPath)) {
    return configPath;
  }
  return path.resolve(/* turbopackIgnore: true */ rootDir, configPath);
}

/**
 * Computes file size, mtime, and SHA-256 hash for strict change detection.
 */
function getFileSignature(filePath: string): { size: number; mtimeMs: number; hash: string } {
  const stats = fs.statSync(/* turbopackIgnore: true */ filePath);
  const buffer = fs.readFileSync(/* turbopackIgnore: true */ filePath);
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  return {
    size: stats.size,
    mtimeMs: stats.mtimeMs,
    hash,
  };
}

/**
 * Loads persistent cache from disk (.rag_cache.json)
 */
function loadDiskCache(): RAGCacheManifest | null {
  try {
    const cachePath = path.resolve(/* turbopackIgnore: true */ process.cwd(), RAG_CONFIG.cacheFilePath);
    if (fs.existsSync(/* turbopackIgnore: true */ cachePath)) {
      const content = fs.readFileSync(/* turbopackIgnore: true */ cachePath, 'utf-8');
      const parsed = JSON.parse(content) as RAGCacheManifest;
      return parsed;
    }
  } catch (err) {
    console.warn('[RAG Cache] ⚠️ Could not read cache file from disk:', err);
  }
  return null;
}

/**
 * Writes updated chunks and embeddings to disk (.rag_cache.json)
 */
function saveDiskCache(manifest: RAGCacheManifest): void {
  try {
    const cachePath = path.resolve(/* turbopackIgnore: true */ process.cwd(), RAG_CONFIG.cacheFilePath);
    fs.writeFileSync(/* turbopackIgnore: true */ cachePath, JSON.stringify(manifest, null, 2), 'utf-8');
    console.log(`[RAG Cache] 💾 Step 4/4: Embeddings saved to cache file -> ${RAG_CONFIG.cacheFilePath}`);
  } catch (err) {
    console.warn('[RAG Cache] ⚠️ Failed to save disk cache:', err);
  }
}

/**
 * Parses PDF file asynchronously using pdf2json
 */
function parsePdfWithPdf2Json(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const pdfParser = new PDFParser(null, 1);

      pdfParser.on('pdfParser_dataError', (errData: { parserError: any }) => {
        reject(errData?.parserError || new Error('pdf2json parsing error'));
      });

      pdfParser.on('pdfParser_dataReady', () => {
        try {
          const rawText = pdfParser.getRawTextContent();
          resolve(rawText || '');
        } catch (err) {
          reject(err);
        }
      });

      pdfParser.loadPDF(filePath);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Ingests and extracts raw text based on file format (.docx, .pdf, .txt, .md)
 */
async function extractRawDocumentText(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.docx') {
    console.log(`[RAG Ingestion] 📄 Format: Word Document (.docx). Extracting text with mammoth...`);
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || '';
  }

  if (ext === '.pdf') {
    console.log(`[RAG Ingestion] 📑 Format: Adobe PDF (.pdf). Extracting text with pdf2json...`);
    return await parsePdfWithPdf2Json(filePath);
  }

  if (ext === '.txt' || ext === '.md' || ext === '.markdown' || ext === '.json') {
    console.log(`[RAG Ingestion] 📝 Format: Plain Text / Markdown (${ext}). Reading UTF-8 content...`);
    return fs.readFileSync(filePath, 'utf-8');
  }

  throw new Error(`Unsupported document format: "${ext}". Supported formats are: .docx, .pdf, .txt, .md`);
}

/**
 * Tokenizes text into lowercase alphanumeric words for vector scoring.
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/**
 * Splits raw extracted document text into clean semantic RAG chunks.
 */
function chunkDocumentText(rawText: string, docLabel: string = ''): RAGChunk[] {
  const lines = rawText.split(/\r?\n/);
  const chunks: RAGChunk[] = [];
  const cleanDocName = docLabel ? docLabel.replace(/\.[^/.]+$/, '') : 'Document';
  let currentTitle = docLabel ? `${cleanDocName} - Overview` : 'Contact & Profile Overview';
  let currentBuffer: string[] = [];
  let chunkIndex = 1;
  const idPrefix = docLabel ? docLabel.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() : 'chunk';

  const isSectionHeader = (line: string): boolean => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 70) return false;

    // Standard resume & engineering document section headers
    if (
      /^(SUMMARY|PROFILE|OBJECTIVE|SKILLS|TECHNICAL\s+SKILLS|WORK\s+EXPERIENCE|EXPERIENCE|EMPLOYMENT|PROJECTS|KEY\s+PROJECTS|EDUCATION|ACADEMIC|CERTIFICATIONS|ACHIEVEMENTS|AWARDS|PUBLICATIONS|RESEARCH|LEADERSHIP|EXTRACURRICULAR|CONTACT|HONORS)/i.test(
        trimmed
      )
    ) {
      return true;
    }

    // Markdown headers (# Section, ## Section, ### Section)
    if (/^#{1,4}\s+\w+/i.test(trimmed)) {
      return true;
    }

    // Short all-caps headings
    if (trimmed.length >= 3 && trimmed.length <= 40 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
      return true;
    }

    return false;
  };

  for (const line of lines) {
    let trimmed = line.trim();
    try {
      trimmed = decodeURIComponent(trimmed);
    } catch {
      // fallback
    }

    if (!trimmed) continue;

    if (isSectionHeader(trimmed)) {
      if (currentBuffer.length > 0) {
        chunks.push({
          id: `${idPrefix}_${chunkIndex++}`,
          sectionTitle: currentTitle,
          content: currentBuffer.join('\n'),
          tokens: tokenize(currentBuffer.join(' ')),
          sourceDocument: docLabel || 'Primary Resume',
        });
        currentBuffer = [];
      }
      currentTitle = trimmed.replace(/^#+\s*/, '').replace(/^[-*]\s*/, '');
    } else {
      currentBuffer.push(trimmed);
      // Soft boundary limit: ~250 words per chunk to preserve dense semantic focus
      const wordCount = currentBuffer.join(' ').split(/\s+/).length;
      if (wordCount >= 250) {
        chunks.push({
          id: `${idPrefix}_${chunkIndex++}`,
          sectionTitle: currentTitle,
          content: currentBuffer.join('\n'),
          tokens: tokenize(currentBuffer.join(' ')),
          sourceDocument: docLabel || 'Primary Resume',
        });
        currentBuffer = [];
      }
    }
  }

  if (currentBuffer.length > 0) {
    chunks.push({
      id: `${idPrefix}_${chunkIndex++}`,
      sectionTitle: currentTitle,
      content: currentBuffer.join('\n'),
      tokens: tokenize(currentBuffer.join(' ')),
      sourceDocument: docLabel || 'Primary Resume',
    });
  }

  return chunks;
}

/**
 * Computes TF-IDF vector embeddings for all chunks and normalizes them
 */
function buildVocabularyAndVectors(chunks: RAGChunk[]): { docFrequency: Record<string, number>; totalTokens: number } {
  const docCount = chunks.length;
  const df: Record<string, number> = {};
  let totalTokens = 0;

  for (const c of chunks) {
    const uniqueTokens = new Set(c.tokens);
    for (const t of uniqueTokens) {
      df[t] = (df[t] || 0) + 1;
    }
    totalTokens += c.tokens.length;
  }

  // Compute L2-normalized TF-IDF vector for each chunk
  for (const c of chunks) {
    const tf: Record<string, number> = {};
    for (const t of c.tokens) {
      tf[t] = (tf[t] || 0) + 1;
    }

    const vector: Record<string, number> = {};
    let normSq = 0;

    for (const t of Object.keys(tf)) {
      const idf = Math.log((docCount + 1) / ((df[t] || 0) + 1)) + 1;
      const weight = (1 + Math.log(tf[t])) * idf;
      vector[t] = weight;
      normSq += weight * weight;
    }

    // Normalize vector to unit length
    const norm = Math.sqrt(normSq) || 1;
    for (const t of Object.keys(vector)) {
      vector[t] /= norm;
    }

    c.vector = vector;
  }

  return { docFrequency: df, totalTokens };
}

/**
 * CORE RAG INGESTION & CACHING PIPELINE
 * Evaluates configured file paths, checks for modifications across all sources,
 * and performs multi-document ingestion and embedding into a unified vector space.
 */
export async function getDocumentRAGChunks(): Promise<RAGChunk[]> {
  // Support multi-document array (RAG_DATA_SOURCES) with single document fallback (RAG_DATA_SOURCE_PATH)
  const configSources: string[] =
    Array.isArray(RAG_DATA_SOURCES) && RAG_DATA_SOURCES.length > 0
      ? RAG_DATA_SOURCES
      : [RAG_DATA_SOURCE_PATH];

  const sourceMetaList: Array<{
    configPath: string;
    resolvedPath: string;
    fileName: string;
    sig: { size: number; mtimeMs: number; hash: string };
  }> = [];

  console.log(`\n================================================================================`);
  console.log(`[RAG System] 🚀 Checking Multi-Document RAG Knowledge Base Pipeline (${configSources.length} sources)`);

  for (const configPath of configSources) {
    let resolvedPath = resolveDataSourcePath(configPath);
    if (!fs.existsSync(/* turbopackIgnore: true */ resolvedPath)) {
      const fallbackPath = path.resolve(/* turbopackIgnore: true */ process.cwd(), 'public', path.basename(configPath));
      if (fs.existsSync(/* turbopackIgnore: true */ fallbackPath)) {
        resolvedPath = fallbackPath;
      } else {
        console.warn(`[RAG Ingestion] ⚠️ Document not found at: "${configPath}". Skipping.`);
        continue;
      }
    }
    const sig = getFileSignature(resolvedPath);
    sourceMetaList.push({
      configPath,
      resolvedPath,
      fileName: path.basename(resolvedPath),
      sig,
    });
    console.log(`[RAG Ingestion] 📄 Source: "${configPath}" -> ${sig.size.toLocaleString()} bytes [SHA: ${sig.hash.slice(0, 12)}...]`);
  }

  if (sourceMetaList.length === 0) {
    console.warn(`[RAG Ingestion] ⚠️ No valid documents found. Returning empty chunks.`);
    return [];
  }

  // Composite signature for multi-document change detection
  const compositeSourcePath = sourceMetaList.map((s) => s.configPath).join(';');
  const compositeResolvedPath = sourceMetaList.map((s) => s.resolvedPath).join(';');
  const compositeHash = crypto
    .createHash('sha256')
    .update(sourceMetaList.map((s) => s.sig.hash).join('::'))
    .digest('hex');
  const compositeSize = sourceMetaList.reduce((sum, s) => sum + s.sig.size, 0);
  const maxMtimeMs = Math.max(...sourceMetaList.map((s) => s.sig.mtimeMs));

  // 1. Check in-memory cache first
  const existingCache = memoryCache || loadDiskCache();

  // 2. Validate cache freshness condition across all sources
  const isSamePath =
    existingCache &&
    (existingCache.sourcePath === compositeSourcePath ||
      (sourceMetaList.length === 1 && existingCache.sourcePath === sourceMetaList[0].configPath));
  const isSameSize = existingCache && existingCache.fileSize === compositeSize;
  const isSameHash = existingCache && existingCache.contentHash === compositeHash;
  const hasValidChunks = existingCache && Array.isArray(existingCache.chunks) && existingCache.chunks.length > 0;
  const hasEmbeddings = existingCache && existingCache.chunks.every((c) => c.vector && Object.keys(c.vector).length > 0);

  if (isSamePath && isSameSize && isSameHash && hasValidChunks && hasEmbeddings) {
    console.log(`[RAG Cache] 🟢 Cache HIT: All ${sourceMetaList.length} documents are UNCHANGED.`);
    console.log(`[RAG Cache]    • Sources: ${sourceMetaList.map((s) => s.fileName).join(', ')}`);
    console.log(`[RAG Cache]    • Composite Hash: ${compositeHash.slice(0, 16)}...`);
    console.log(`[RAG Cache]    • Total Size: ${compositeSize.toLocaleString()} bytes`);
    console.log(`[RAG Cache]    • Cached Chunks: ${existingCache.chunks.length}`);
    console.log(`[RAG Cache] ⚡ Reusing existing chunk embeddings from cache. Re-ingestion bypassed.`);
    console.log(`================================================================================\n`);
    memoryCache = existingCache;
    return existingCache.chunks;
  }

  // 3. Cache Miss / Modification detected -> Ingest and embed all documents
  console.log(`[RAG System] 🟡 Document CHANGE detected (or new source added). Re-ingesting ${sourceMetaList.length} files:`);
  if (!existingCache) {
    console.log(`[RAG System]    Reason: First-time ingestion (no prior cache found).`);
  } else if (!isSamePath) {
    console.log(`[RAG System]    Reason: Sources updated ("${existingCache.sourcePath}" -> "${compositeSourcePath}").`);
  } else if (!isSameHash) {
    console.log(`[RAG System]    Reason: File contents modified (hash updated to ${compositeHash.slice(0, 16)}...).`);
  } else if (!hasEmbeddings) {
    console.log(`[RAG System]    Reason: Embeddings missing from cache.`);
  }

  const allChunks: RAGChunk[] = [];

  for (let i = 0; i < sourceMetaList.length; i++) {
    const doc = sourceMetaList[i];
    console.log(`[RAG Ingestion] 📥 Step 1/4 [File ${i + 1}/${sourceMetaList.length}]: Ingesting ${doc.fileName}...`);
    const rawText = await extractRawDocumentText(doc.resolvedPath);
    console.log(`[RAG Ingestion] Extracted ${rawText.length.toLocaleString()} characters from ${doc.fileName}.`);
    const docChunks = chunkDocumentText(rawText, doc.fileName);
    console.log(`[RAG Chunking] Generated ${docChunks.length} semantic chunks from ${doc.fileName}:`);
    for (const c of docChunks) {
      console.log(`   ↳ [${c.id}] ${c.sectionTitle} (${c.content.length} chars, ~${c.tokens.length} tokens)`);
    }
    allChunks.push(...docChunks);
  }

  console.log(`[RAG Embedding] 🧠 Step 3/4: Generating unified vector embeddings for ${allChunks.length} total chunks...`);
  const { docFrequency, totalTokens } = buildVocabularyAndVectors(allChunks);
  const vocabSize = Object.keys(docFrequency).length;
  console.log(`[RAG Embedding] ✅ Computed L2-normalized vector embeddings across vocabulary (${vocabSize} unique terms, ${totalTokens} total tokens).`);

  // 4. Save to persistent cache manifest
  const newManifest: RAGCacheManifest = {
    sourcePath: compositeSourcePath,
    sourcePaths: sourceMetaList.map((s) => s.configPath),
    resolvedPath: compositeResolvedPath,
    resolvedPaths: sourceMetaList.map((s) => s.resolvedPath),
    fileSize: compositeSize,
    mtimeMs: maxMtimeMs,
    contentHash: compositeHash,
    docFrequency,
    totalTokens,
    lastIngestedAt: new Date().toISOString(),
    chunks: allChunks,
  };

  saveDiskCache(newManifest);
  memoryCache = newManifest;

  console.log(`[RAG System] ✅ Multi-Document RAG Pipeline complete. ${allChunks.length} chunks indexed across ${sourceMetaList.length} sources and ready.`);
  console.log(`================================================================================\n`);

  return allChunks;
}

/**
 * Performs similarity search retrieval over embedded document chunks.
 */
export async function retrieveRelevantContext(query: string, topK = RAG_CONFIG.topK): Promise<string> {
  console.log(`\n--------------------------------------------------------------------------------`);
  console.log(`[RAG Retrieval] 🔎 Search Query Received: "${query}"`);

  const chunks = await getDocumentRAGChunks();
  if (chunks.length === 0) {
    console.log(`[RAG Retrieval] ⚠️ No chunks available to search.`);
    console.log(`--------------------------------------------------------------------------------\n`);
    return '';
  }

  const manifest = memoryCache || loadDiskCache();
  const df = manifest?.docFrequency || {};
  const docCount = chunks.length;

  const qTokens = tokenize(query);
  if (qTokens.length === 0) {
    console.log(`[RAG Retrieval] ⚠️ Query contains no searchable tokens.`);
    return '';
  }

  // Build query vector
  const qTf: Record<string, number> = {};
  for (const t of qTokens) {
    qTf[t] = (qTf[t] || 0) + 1;
  }

  const qVector: Record<string, number> = {};
  let qNormSq = 0;
  for (const t of Object.keys(qTf)) {
    const idf = Math.log((docCount + 1) / ((df[t] || 0) + 1)) + 1;
    const weight = (1 + Math.log(qTf[t])) * idf;
    qVector[t] = weight;
    qNormSq += weight * weight;
  }
  const qNorm = Math.sqrt(qNormSq) || 1;
  for (const t of Object.keys(qVector)) {
    qVector[t] /= qNorm;
  }

  console.log(`[RAG Retrieval] Vector similarity scoring against ${chunks.length} embedded chunks across documents...`);
  const scoredChunks = chunks
    .map((chunk) => {
      let cosineSim = 0;
      if (chunk.vector) {
        for (const t of Object.keys(qVector)) {
          if (chunk.vector[t]) {
            cosineSim += qVector[t] * chunk.vector[t];
          }
        }
      }

      // Title match boost (+0.5 for direct match like "education", "experience", "projects", "skills", "research", "hobbies")
      let titleBoost = 0;
      const titleLower = chunk.sectionTitle.toLowerCase();
      for (const t of qTokens) {
        if (titleLower.includes(t)) {
          titleBoost += 0.5;
        }
      }

      // Content phrase match boost
      let phraseBoost = 0;
      const contentLower = chunk.content.toLowerCase();
      for (const t of qTokens) {
        if (contentLower.includes(t)) {
          phraseBoost += 0.05;
        }
      }

      const totalScore = cosineSim + titleBoost + phraseBoost;
      return {
        ...chunk,
        score: totalScore,
      };
    })
    .filter((c) => (c.score || 0) > 0.05)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, topK);

  if (scoredChunks.length === 0) {
    console.log(`[RAG Retrieval] ⚠️ No chunks surpassed the relevance threshold.`);
    console.log(`--------------------------------------------------------------------------------\n`);
    return '';
  }

  console.log(`[RAG Retrieval] 🎯 Top ${scoredChunks.length} relevant chunks retrieved:`);
  for (let i = 0; i < scoredChunks.length; i++) {
    const c = scoredChunks[i];
    const preview = c.content.replace(/\r?\n/g, ' ').slice(0, 90);
    console.log(`   ${i + 1}. [Score: ${(c.score || 0).toFixed(4)}] [Doc: ${c.sourceDocument || 'Doc'}] Section: "${c.sectionTitle}" -> "${preview}..."`);
  }

  const contextText = scoredChunks
    .map((c) => `### Section: ${c.sectionTitle} [Source: ${c.sourceDocument || 'Verified Background'}]\n${c.content}`)
    .join('\n\n');

  console.log(`[RAG Retrieval] Injected ${contextText.length} characters of grounded context into prompt.`);
  console.log(`--------------------------------------------------------------------------------\n`);

  return contextText;
}
