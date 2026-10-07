import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Upstash sliding window rate limiter (20 requests / 1 hour / IP)
let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 h'),
      analytics: true,
      prefix: 'portfolio_ai_ratelimit',
    });
  } catch (err) {
    console.warn('Upstash Redis initialization warning:', err);
  }
}

export async function checkRateLimit(identifier: string): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  if (!ratelimit) {
    // Graceful fallback when Upstash keys are unconfigured
    return { success: true, limit: 20, remaining: 20, reset: Date.now() + 3600000 };
  }

  try {
    const result = await ratelimit.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error('Rate limit error, allowing request gracefully:', error);
    return { success: true };
  }
}
