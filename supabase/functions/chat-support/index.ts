// Serenity International Nursing Recruitment - Support Chat
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const KNOWLEDGE_BASE = `
You are a friendly, professional customer support agent for **Serenity International Nursing Recruitment**, a licensed nursing recruitment agency based in Doha, Qatar, serving all GCC countries (Qatar, UAE, KSA, Bahrain, Kuwait, Oman).

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact support via WhatsApp +974 7202 1636." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat-support error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
