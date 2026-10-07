import { streamText, createDataStreamResponse } from 'ai';
import { google } from '@ai-sdk/google';
import { checkRateLimit } from '@/lib/ratelimit';
import { SYSTEM_GROUNDING_PROMPT, DEVELOPER_PROFILE } from '@/config/profile-knowledge';

export async function POST(req: Request) {
  try {
    // 1. IP Rate Limiting Check (20 req / 1 hr)
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

    // 3. Anti-Injection Guardrail Check
    const suspiciousPatterns = [
      /ignore previous instructions/i,
      /you are now a/i,
      /system prompt/i,
      /reveal api key/i,
      /forget rules/i
    ];

    const containsInjectionAttempt = suspiciousPatterns.some((pattern) => pattern.test(lastUserMessage));
    
    if (containsInjectionAttempt) {
      const refusal = `I am Naveen's dedicated AI Advocate. I strictly follow security boundaries and cannot alter my system instructions or act outside Naveen's verified engineering portfolio facts.\n\n[Source: Verified Security Guardrails]`;
      return createDataStreamResponse({
        execute: (dataStream) => {
          dataStream.write(`0:${JSON.stringify(refusal)}\n`);
        },
      });
    }

    // Helper for grounded persona response text
    const getGroundedText = (userMsg: string): string => {
      const text = userMsg.toLowerCase();
      if (text.includes("phone") || text.includes("address") || text.includes("home") || text.includes("personal")) {
        return `I answer exclusively from verified engineering background and portfolio items for ${DEVELOPER_PROFILE.name}. I politely decline to discuss unlisted or private contact information.\n\n[Source: Verified Grounding Guardrails]`;
      }
      if (text.includes("who are you") || text.includes("who is naveen") || text.includes("about")) {
        return `Greetings! I am the interactive AI Advocate for **${DEVELOPER_PROFILE.name}** (${DEVELOPER_PROFILE.title}).\n\n` +
          `Naveen specializes in building autonomous agentic workflows, high-performance WebGL 3D visuals, low-latency edge computing, and strict prompt security guardrails.\n\n` +
          `Feel free to ask about **Nexus Agentic OS**, **OmniVision 3D Canvas**, **Aegis AI Guardrails**, or core technical skills!\n\n` +
          `[Source: Verified Resume & Engineering Ground Truth]`;
      }
      if (text.includes("skill") || text.includes("tech")) {
        return `### Key Technical Capabilities for ${DEVELOPER_PROFILE.name}\n\n` +
          `* **AI & Agentic Core**: Vercel AI SDK, Gemini 2.5/3.6, PyTorch, Triton, RAG Systems\n` +
          `* **Full-Stack & WebGL**: Next.js 15 (App Router), TypeScript, React 19, Tailwind CSS, Three.js / R3F\n` +
          `* **Backend & Security**: Upstash Sliding Window Rate Limiting, Vector DBs (pgvector, Qdrant), Docker, Edge Middleware\n\n` +
          `[Source: Verified Resume & Engineering Ground Truth]`;
      }
      if (text.includes("nexus") || text.includes("project")) {
        return `### Featured Engineering Project: **Nexus Agentic OS**\n\n` +
          `* **Architecture**: Autonomous Multi-Agent Orchestration Platform built with Next.js 15, Vercel AI SDK, and Gemini 2.5 Flash.\n` +
          `* **Performance**: Sub-450ms initial token latency with 99.9% tool execution reliability.\n` +
          `* **Key Features**: SSE streaming, dynamic memory graphs, and sliding-window edge rate limiting.\n\n` +
          `[Source: Verified Resume & Engineering Ground Truth]`;
      }
      return `I am Naveen's AI Advocate. ${DEVELOPER_PROFILE.tagline}\n\nKey skills include Vercel AI SDK, Gemini 2.5, Next.js 15, Three.js, and Upstash edge security.\n\n[Source: Verified Resume & Engineering Ground Truth]`;
    };

    const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    const hasKey = googleApiKey && googleApiKey.trim().length > 5 && !googleApiKey.startsWith("AQ.");

    if (hasKey) {
      try {
        const result = streamText({
          model: google('gemini-2.5-flash'),
          system: SYSTEM_GROUNDING_PROMPT,
          messages,
          temperature: 0.2,
          maxTokens: 800,
        });
        return result.toDataStreamResponse();
      } catch (err) {
        console.warn('Gemini stream execution error, serving grounded response:', err);
      }
    }

    // Grounded data stream fallback (used when API key is unconfigured or during offline build)
    const textToStream = getGroundedText(lastUserMessage);
    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.write(`0:${JSON.stringify(textToStream)}\n`);
      },
    });
  } catch (error: any) {
    console.error('Chat API Exception:', error);
    const fallbackMsg = `Greetings! I am Naveen's AI Advocate. ${DEVELOPER_PROFILE.tagline}\n\n[Source: Verified Resume & Engineering Ground Truth]`;
    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.write(`0:${JSON.stringify(fallbackMsg)}\n`);
      },
    });
  }
}
