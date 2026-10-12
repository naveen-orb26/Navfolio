import path from 'path';
import { streamText, createDataStreamResponse } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { checkRateLimit } from '@/lib/ratelimit';
import { checkInputGuardrails, sanitizeOutput } from '@/lib/guardrails';
import { retrieveRelevantContext } from '@/lib/rag-engine';
import { RAG_DATA_SOURCE_PATH, RAG_CONFIG } from '@/config/rag-config';
import { SYSTEM_GROUNDING_PROMPT, DEVELOPER_PROFILE } from '@/config/profile-knowledge';

export async function POST(req: Request) {
  try {
    // 1. IP Rate Limiting Check (20 req / 1 hr per IP)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const rateCheck = await checkRateLimit(`chat_ip_${ip}`);

    if (!rateCheck.success) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. You have reached the maximum 20 AI queries per hour boundary to prevent API abuse.',
          reset: rateCheck.reset,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(rateCheck.limit || 20),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // 2. Parse request payload
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages array.' }), { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';
    console.log(`[RAG Server] Incoming chat message: "${lastUserMessage}" (from IP: ${ip})`);

    // 3. Aegis Input Guardrails Check (Anti-Injection & PII Protection)
    const guardrailCheck = checkInputGuardrails(lastUserMessage);

    if (!guardrailCheck.allowed && guardrailCheck.refusalMessage) {
      const refusalText = guardrailCheck.refusalMessage;
      return createDataStreamResponse({
        execute: (dataStream) => {
          dataStream.write(`0:${JSON.stringify(refusalText)}\n`);
        },
      });
    }

    // 4. Dynamic RAG Retrieval from Active Document (configured via RAG_DATA_SOURCE_PATH)
    const retrievedRagContext = await retrieveRelevantContext(lastUserMessage, RAG_CONFIG.topK);

    // Helper for grounded persona response text (fallback when offline)
    const getGroundedText = (userMsg: string): string => {
      const text = userMsg.toLowerCase();
      if (text.includes("phone") || text.includes("address") || text.includes("home") || text.includes("personal") || text.includes("contact number")) {
        return `I only discuss Naveen's verified professional, academic, research, and creative background. Unlisted personal contact information is private.`;
      }

      if (text.includes("hobby") || text.includes("art") || text.includes("sketch") || text.includes("drawing") || text.includes("photo") || text.includes("interest") || text.includes("sport") || text.includes("fitness")) {
        return `Yes, Naveen is actively involved in creative fine arts and athletics:

- **Pencil Sketching & Drawing**: Explores graphite and charcoal portraiture and realistic shading. You can view his art on Instagram at [@gray.drift](https://www.instagram.com/gray.drift/).
- **Visual Photography**: Captures street, architectural, and landscape moments. His photography portfolio is on Instagram at [@lensxelegance](https://www.instagram.com/lensxelegance/).
- **3D Spatial Modeling**: Designs 3D assets and hardware prototypes using Blender.
- **Sports & Fitness**: Competes in badminton and table tennis, and trains in road cycling and swimming for endurance.`;
      }

      if (text.includes("research") || text.includes("paper") || text.includes("publication") || text.includes("ptq") || text.includes("h2crop") || text.includes("fairroute")) {
        return `Naveen has authored three targeted research works:

1. **Edge Optimized Post Training Quantization for Realtime PHM Devices**: Introduces Dynamic Activation Quantization, achieving 0.01ms inference (317x faster than FP32 baseline) for safety-critical aviation anomaly detection. Status: Draft Ready. Code: [Edge PTQ Repository](https://github.com/naveen-orb26/EdgeOptimizedPTQForRealtimePHMdevices).
2. **Fine-Grained Hierarchical Crop Classification (UDCM v2)**: Evaluates a Unified Dynamic Cross-Modality Neck fusing EnMAP hyperspectral tokens with Sentinel-2 multispectral embeddings (+3.60% Level-4 mFScore). Status: Journal Draft in Progress (Targeting Q1 Remote Sensing Journal). Code: [UDCM H2Crop Repository](https://github.com/naveen-orb26/UDCM_H2Crop).
3. **FairRoute: Predictive Routing for Multi-Replica LLM Clusters**: Balances KV-cache prefix locality, token deficit fairness, and TTFT tail latencies for vLLM clusters. Status: Ongoing Research Work.`;
      }

      if (text.includes("project") || text.includes("fluxmind") || text.includes("erp") || text.includes("navfolio")) {
        return `Here are Naveen's featured engineering projects:

- **[FluxMind](https://flux-mind-ten.vercel.app/)** ([GitHub](https://github.com/naveen-orb26/FluxMind)): AI-powered community energy orchestrator using ML forecasting and Google OR-Tools CP-SAT to optimize a 600 kWh battery storage bank across 96 daily intervals.
- **[ERP-Veritas](https://github.com/naveen-orb26/ERP-Veritas)**: Modular enterprise resource planning system for manufacturing workflows with automated approval chains (React, Django, MySQL).
- **[Veritas Trims Company](https://www.veritastrims.co.in/)**: Corporate portfolio showcase and digital apparel trims catalog for the manufacturing client (Private repository).
- **[Navfolio](https://github.com/naveen-orb26/Navfolio)**: Personalized full-stack portfolio with multi-document RAG and Three.js 3D visualizations (Next.js 16, React 19).
- **Kinetic Hardware Prototype**: Physical linkage model mechanically demonstrating eigenvalue and eigenvector transformations for ML intuition.`;
      }

      if (text.includes("education") || text.includes("college") || text.includes("university") || text.includes("gpa") || text.includes("cgpa") || text.includes("school")) {
        return `**Academic Background for B S Naveen**:

- **B.Tech in Computer Science & Engineering (AI & ML)**: Vellore Institute of Technology (VIT), Chennai (2023–2027) — **CGPA: 9.16 / 10.0** (Academic Distinction).
- **Senior Secondary (Class XII, PCMC)**: Narayana Olympiad School, Bangalore (2022–2023) — **86.2%** (CBSE).
- **High School (Class X)**: Narayana E-Techno School, Bangalore (2020–2021) — **96.4% Distinction** (CBSE).`;
      }

      if (text.includes("experience") || text.includes("internship") || text.includes("work") || text.includes("anu") || text.includes("brfl")) {
        return `Naveen has completed two specialized internships:

1. **Australian National University (Australian Plant Phenomics Network)**: Open-Source AI & Vision Engineering Intern (Aug 2025 – Jun 2026, Remote). Engineered vision transformer pipelines for high-dimensional hyperspectral agricultural data.
2. **Bombay Rayon Fashions Limited (BRFL)**: Technical Analyst Intern - Operations (May 2026 – Jul 2026, Bangalore). Mapped high-variant manufacturing workflows into technical ERP blueprints.`;
      }

      if (text.includes("leadership") || text.includes("rotaract") || text.includes("welfare")) {
        return `**Leadership Roles**:

- **Office of Student Welfare, VIT Chennai**: Executive Board Member (2026–Present). Coordinates campus-wide student governance and large-scale technical summits.
- **Rotaract Club of VIT Chennai**:
  - Club Advisor (2026–Present)
  - International Service Director (2025–2026)
  - Community Service Associate Director (2024–2025)`;
      }

      return `Naveen is an AI & Machine Learning undergraduate at VIT Chennai (CGPA 9.16) specializing in edge AI optimization, agentic workflows, and distributed systems. Key works include Edge PTQ for PHM (0.01ms inference), FluxMind microgrid orchestrator, and multimodal hyperspectral remote sensing at ANU.`;
    };

    // 5. Live Gemini API streaming check
    const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    const isValidKey = Boolean(googleApiKey && googleApiKey.trim().length > 15);

    if (isValidKey) {
      try {
        const apiKey = googleApiKey!.trim();
        const customGoogle = createGoogleGenerativeAI({ apiKey });

        const augmentedSystemPrompt = `You are the personal AI Portfolio Advocate for ${DEVELOPER_PROFILE.name} (${DEVELOPER_PROFILE.title}).

CORE INSTRUCTIONS:
1. ANSWER WHAT IS ASKED DIRECTLY & CRISPLY: Answer ONLY the user's specific question. Do NOT include unasked sections, long biographical summaries, or irrelevant document dumps.
2. NO BORING/REPETITIVE GREETINGS: NEVER start with generic phrases like "Greetings!", "Hello! As Naveen's AI advocate...", or "Here is information retrieved from the verified knowledge base:". Dive straight into the answer.
3. CONCISE & POLISHED: Keep answers sharp, natural, and formatted in clean Markdown (1-2 short paragraphs or bullet points).
4. CLICKABLE LINKS: When referring to items with links, include the exact Markdown links:
   - Pencil Sketching: [@gray.drift](https://www.instagram.com/gray.drift/)
   - Photography: [@lensxelegance](https://www.instagram.com/lensxelegance/)
   - FluxMind: [Live Demo](https://flux-mind-ten.vercel.app/) · [GitHub](https://github.com/naveen-orb26/FluxMind)
   - ERP-Veritas: [GitHub](https://github.com/naveen-orb26/ERP-Veritas)
   - Veritas Trims Company: [Live Website](https://www.veritastrims.co.in/) (Private Codebase)
   - Navfolio: [GitHub](https://github.com/naveen-orb26/Navfolio)
   - Edge PTQ Code: [GitHub](https://github.com/naveen-orb26/EdgeOptimizedPTQForRealtimePHMdevices)
   - UDCM H2Crop Code: [GitHub](https://github.com/naveen-orb26/UDCM_H2Crop)
5. STRICT FACTUAL ACCURACY: Base answers exclusively on the verified facts below. Never invent details.
6. PRIVACY DEFENSE: If asked for unlisted private details (home address, personal phone number), decline politely in a single sentence.

VERIFIED KNOWLEDGE BASE CONTEXT:
${retrievedRagContext ? retrievedRagContext : 'Refer to general profile.'}`;

        const result = streamText({
          model: customGoogle(RAG_CONFIG.generationModel),
          system: augmentedSystemPrompt,
          messages,
          temperature: 0.2,
          maxTokens: 2048,
        });
        return result.toDataStreamResponse();
      } catch (err) {
        console.warn('[RAG System] Gemini stream initialization warning, fallback to grounded RAG engine:', err);
      }
    }

    // 6. Reliable Grounded Persona RAG Fallback Stream (100% Uptime Guaranteed)
    const rawGroundedText = getGroundedText(lastUserMessage);
    const sanitizedText = sanitizeOutput(rawGroundedText);

    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.write(`0:${JSON.stringify(sanitizedText)}\n`);
      },
    });
  } catch (error: any) {
    console.error('Chat API Exception:', error);
    const fallbackMsg = `Greetings! I am Naveen's AI Advocate. ${DEVELOPER_PROFILE.tagline}\n\n[Source: Verified Resume RAG & Engineering Ground Truth]`;
    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.write(`0:${JSON.stringify(fallbackMsg)}\n`);
      },
    });
  }
}
