/**
 * ==============================================================================
 * RAG (Retrieval-Augmented Generation) Pipeline Configuration
 * ==============================================================================
 * 
 * 📍 CONFIGURE RAG INPUT DATA SOURCES:
 * You can specify one or multiple documents to be ingested into the RAG knowledge base.
 * Both the primary resume document (.docx) and the website knowledge markdown file (.md)
 * are ingested, chunked, and embedded into the unified semantic search index.
 * 
 * Supported file types:
 *   - Word Documents (.docx)
 *   - PDF Files (.pdf)
 *   - Text & Markdown Files (.txt, .md)
 * 
 * Path formats supported:
 *   - Relative to project root: 'public/B_S_Naveen.docx'
 *   - Absolute filesystem path: 'D:/path/to/your/file.docx'
 * 
 * CACHE & RE-EMBEDDING BEHAVIOR:
 *   - When any configured file is updated or a new file is added:
 *     The system automatically detects changes via SHA-256 hashes, re-ingests
 *     all documents, generates semantic chunks, and re-computes vector embeddings.
 *   - As long as all files are unchanged, it reuses existing cached embeddings (.rag_cache.json).
 * ==============================================================================
 */

/**
 * 📍 Multiple RAG data source documents ingested into the vector knowledge base:
 * 1. Primary verified resume (.docx)
 * 2. Comprehensive website & portfolio knowledge base (.md)
 */
export const RAG_DATA_SOURCES: string[] = [
  'public/B_S_Naveen.docx',
  'public/website_knowledge.md',
];

/**
 * Backward-compatible single document path export (points to primary resume).
 */
export const RAG_DATA_SOURCE_PATH: string = RAG_DATA_SOURCES[0];

/**
 * RAG Retrieval Parameters
 */
export const RAG_CONFIG = {
  /** Maximum number of chunks to retrieve per user query */
  topK: 4,
  /** Minimum similarity score threshold (0.0 to 1.0) */
  similarityThreshold: 0.15,
  /** Path to persistent embedding cache file */
  cacheFilePath: '.rag_cache.json',
  /** Embedding model name */
  embeddingModel: 'gemini-embedding-001',
  /** Primary generation model */
  generationModel: 'gemini-3.8-flash',
};
