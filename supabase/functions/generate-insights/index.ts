import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { dashboardData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an AI analyst for a regenerative finance dashboard. Analyze the provided dashboard data and generate 3-5 actionable insights. Each insight should identify risks, opportunities, or warnings based on the data patterns.

Focus on:
- Capital concentration risks across regions
- Market instrument pricing trends and verification quality
- Microfinance repayment stress and climate shock correlation
- Climate fund utilization gaps and pipeline bottlenecks
- Funding gap urgency vs capital allocation mismatches

Return insights using the suggest_insights tool.`;

    const userPrompt = `Analyze this dashboard snapshot and generate insights:

Regions: ${JSON.stringify(dashboardData.regions?.slice(0, 8) || [])}
Climate Funds: ${JSON.stringify(dashboardData.climateFunds?.slice(0, 5) || [])}
Market Instruments: ${JSON.stringify(dashboardData.marketInstruments?.slice(0, 8) || [])}
Microfinance: ${JSON.stringify(dashboardData.microfinance?.slice(0, 6) || [])}
Funding Gaps: ${JSON.stringify(dashboardData.fundingGaps?.slice(0, 8) || [])}`;

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
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_insights",
              description: "Return 3-5 actionable dashboard insights.",
              parameters: {
                type: "object",
                properties: {
                  insights: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: { type: "string", description: "The insight description" },
                        confidence: { type: "number", description: "Confidence score 0-100" },
                        type: { type: "string", enum: ["warning", "opportunity", "risk", "trend"] },
                        sources: { type: "array", items: { type: "string" }, description: "Data sources used" },
                        action: { type: "string", description: "Recommended action" },
                      },
                      required: ["text", "confidence", "type", "sources", "action"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["insights"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_insights" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ insights: parsed.insights }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: return the raw content
    return new Response(JSON.stringify({ 
      insights: [],
      raw: result.choices?.[0]?.message?.content 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-insights error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
