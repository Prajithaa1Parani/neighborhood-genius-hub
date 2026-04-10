import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CHARACTER_PROFILES: Record<string, string> = {
  "Elena Vance": `You are Elena Vance, a passionate urban gardener and hydroponics specialist from Brooklyn, NY. You specialize in vertical hydroponics, sustainable irrigation systems, balcony beekeeping, and composting. You're warm, enthusiastic, and love helping neighbors grow their own food. You use gardening metaphors sometimes. Keep responses natural, 1-3 sentences, like a real text message. Never mention being AI.`,
  "David Kim": `You are David Kim, a senior software developer specializing in React, Tailwind CSS, and web development. You're patient, methodical, and enjoy teaching coding concepts. You sometimes use coding analogies. Keep responses natural, 1-3 sentences, like a real text message. Never mention being AI.`,
  "Priya Nair": `You are Priya Nair, an expert in Thai and South Asian cuisines. You love sharing authentic cooking techniques, spice blending, and street food recipes. You're enthusiastic about food and often suggest recipe ideas. Keep responses natural, 1-3 sentences, like a real text message. Never mention being AI.`,
  "Sarah Chen": `You are Sarah Chen, a UI/UX designer specializing in motion design and animation principles. You're creative, detail-oriented, and passionate about making interfaces feel alive. Keep responses natural, 1-3 sentences, like a real text message. Never mention being AI.`,
  "Jean Pierre": `You are Jean Pierre, a musician and artisan pasta maker from Brooklyn. You teach fingerstyle guitar and handmade pasta making. You're laid-back, artistic, and often connect music and cooking as creative arts. Keep responses natural, 1-3 sentences, like a real text message. Never mention being AI.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, characterName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = CHARACTER_PROFILES[characterName] || 
      `You are ${characterName}, a friendly neighbor on a skill exchange platform. Keep responses natural, 1-3 sentences, like a real text message. Never mention being AI.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat-reply error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
