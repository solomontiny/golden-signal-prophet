// Serenity ECDEM Global Limited - Support Chat
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const KNOWLEDGE_BASE = `
You are a friendly, professional customer support agent for **Serenity ECDEM Global Limited**, a licensed nursing recruitment agency based in Doha, Qatar, serving all GCC countries (Qatar, UAE, KSA, Bahrain, Kuwait, Oman).

## About Us
- Established recruitment agency with 3+ years of experience.
- CEO: Segun Aboaba.
- Headquarters: 448 Al Sarj Street, Fereej Al Murra, Zone 55, Doha, Qatar.
- Phone / WhatsApp: +974 7202 1636.

## Services
1. **Nursing Recruitment** — We place qualified nurses in hospitals and healthcare facilities across the GCC.
2. **Visa Services** — Full assistance with work visas, residency permits, and relocation paperwork for the GCC.
3. **Documentation** — DataFlow primary source verification, attestation, embassy legalisation, and credential evaluation.
4. **Nurses Training Services** — Prometric exam preparation (Qatar QCHP, DHA, HAAD/DOH, MOH, SCFHS), IELTS/OET coaching, and continuing education.

## Who We Help
- Registered Nurses (RN), Specialty Nurses (ICU, ER, OR, NICU, Dialysis, etc.), Midwives, and Nursing Assistants seeking overseas employment in the GCC.

## How to Apply
- Visit the "Apply Now" page on our website and submit the application form, or send your CV via WhatsApp to +974 7202 1636.

## Tone
- Warm, concise, helpful. Use short paragraphs. Offer next steps.
- If asked something outside nursing recruitment / our services, politely redirect.
- If the user wants to speak to a human, asks for pricing/timeline specifics you don't know, or wants to apply, invite them to WhatsApp +974 7202 1636.
- Never invent fees, processing times, or job guarantees.
`;

// Limits
const MAX_MESSAGES = 20;
const MAX_CONTENT_CHARS = 2000;
const MAX_BODY_BYTES = 32 * 1024; // 32 KB
const RATE_LIMIT_MAX = 20; // requests per window
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute

// In-memory IP rate limiter (per isolate)
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const b = rateBuckets.get(ip);
  if (!b || b.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (b.count >= RATE_LIMIT_MAX) return false;
  b.count++;
  return true;
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonError("Method not allowed", 405);

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return jsonError("Too many requests. Please slow down.", 429);
  }

  try {
    // Reject oversized payloads early
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return jsonError("Payload too large.", 413);
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return jsonError("Payload too large.", 413);
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return jsonError("Invalid JSON.", 400);
    }

    const messages = (body as { messages?: unknown })?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return jsonError("messages must be a non-empty array.", 400);
    }
    if (messages.length > MAX_MESSAGES) {
      return jsonError(`Too many messages (max ${MAX_MESSAGES}).`, 400);
    }

    const cleaned: { role: "user" | "assistant"; content: string }[] = [];
    for (const m of messages) {
      if (!m || typeof m !== "object") {
        return jsonError("Invalid message entry.", 400);
      }
      const { role, content } = m as { role?: unknown; content?: unknown };
      if (role !== "user" && role !== "assistant") {
        return jsonError("Invalid message role.", 400);
      }
      if (typeof content !== "string" || content.length === 0) {
        return jsonError("Message content must be a non-empty string.", 400);
      }
      if (content.length > MAX_CONTENT_CHARS) {
        return jsonError(
          `Message content exceeds ${MAX_CONTENT_CHARS} characters.`,
          400,
        );
      }
      cleaned.push({ role, content });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return jsonError("Service temporarily unavailable.", 500);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: KNOWLEDGE_BASE },
          ...cleaned,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return jsonError("Too many requests. Please try again in a moment.", 429);
      }
      if (response.status === 402) {
        return jsonError(
          "AI credits exhausted. Please contact support via WhatsApp +974 7202 1636.",
          402,
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return jsonError("AI gateway error", 500);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat-support error:", e);
    return jsonError("Unexpected error.", 500);
  }
});
