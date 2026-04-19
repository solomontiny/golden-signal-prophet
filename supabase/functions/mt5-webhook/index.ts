// MT5 -> Lovable webhook bridge
// Accepts two payload kinds from your EA:
//   { type: "signal", side, entry, sl?, tp?, confidence?, strategy?, notes?, ticket?, symbol?, time? }
//   { type: "outcome", ticket, exit, outcome, signal_id?, pips?, profit?, r_multiple?, symbol?, side?, entry?, time? }
// Auth: header `x-webhook-secret` must match MT5_WEBHOOK_SECRET.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-webhook-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const SECRET = Deno.env.get("MT5_WEBHOOK_SECRET");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!SECRET || !SUPABASE_URL || !SERVICE_ROLE) {
    return json({ error: "Server not configured" }, 500);
  }

  const provided = req.headers.get("x-webhook-secret");
  if (!provided || provided !== SECRET) {
    return json({ error: "Unauthorized" }, 401);
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
  const type = String(payload?.type ?? "signal").toLowerCase();

  try {
    if (type === "signal") {
      const side = String(payload.side ?? "").toUpperCase();
      const entry = Number(payload.entry ?? payload.entry_price);
      if (!["BUY", "SELL"].includes(side)) return json({ error: "side must be BUY or SELL" }, 400);
      if (!Number.isFinite(entry)) return json({ error: "entry must be a number" }, 400);

      const row = {
        symbol: String(payload.symbol ?? "XAUUSD"),
        side,
        entry_price: entry,
        stop_loss: payload.sl != null ? Number(payload.sl) : null,
        take_profit: payload.tp != null ? Number(payload.tp) : null,
        confidence: payload.confidence != null ? Number(payload.confidence) : null,
        strategy: payload.strategy ? String(payload.strategy) : null,
        notes: payload.notes ? String(payload.notes) : null,
        ticket: payload.ticket != null ? Number(payload.ticket) : null,
        signal_time: payload.time ? new Date(payload.time).toISOString() : new Date().toISOString(),
        status: "open",
      };

      const { data, error } = await supabase.from("signals").insert(row).select().single();
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true, signal: data });
    }

    if (type === "outcome" || type === "trade") {
      const exit = Number(payload.exit ?? payload.exit_price);
      const outcome = String(payload.outcome ?? "").toLowerCase();
      if (!Number.isFinite(exit)) return json({ error: "exit must be a number" }, 400);
      if (!["win", "loss", "breakeven"].includes(outcome))
        return json({ error: "outcome must be win|loss|breakeven" }, 400);

      // Try to locate the originating signal: by signal_id, then by ticket.
      let signalRow: any = null;
      if (payload.signal_id) {
        const { data } = await supabase
          .from("signals")
          .select("*")
          .eq("id", payload.signal_id)
          .maybeSingle();
        signalRow = data;
      }
      if (!signalRow && payload.ticket != null) {
        const { data } = await supabase
          .from("signals")
          .select("*")
          .eq("ticket", Number(payload.ticket))
          .order("signal_time", { ascending: false })
          .limit(1)
          .maybeSingle();
        signalRow = data;
      }

      const side = String(payload.side ?? signalRow?.side ?? "").toUpperCase();
      const entry = Number(payload.entry ?? signalRow?.entry_price);
      if (!["BUY", "SELL"].includes(side)) return json({ error: "side missing" }, 400);
      if (!Number.isFinite(entry)) return json({ error: "entry missing" }, 400);

      // pips for XAUUSD: 1 pip = 0.1 price unit (common broker convention)
      const symbol = String(payload.symbol ?? signalRow?.symbol ?? "XAUUSD");
      const pipSize = symbol.toUpperCase().includes("XAU") ? 0.1 : 0.0001;
      const dir = side === "BUY" ? 1 : -1;
      const pips = payload.pips != null ? Number(payload.pips) : ((exit - entry) * dir) / pipSize;

      let r_multiple: number | null = payload.r_multiple != null ? Number(payload.r_multiple) : null;
      if (r_multiple == null && signalRow?.stop_loss != null) {
        const risk = Math.abs(entry - Number(signalRow.stop_loss));
        if (risk > 0) r_multiple = ((exit - entry) * dir) / risk;
      }

      const row = {
        signal_id: signalRow?.id ?? null,
        ticket: payload.ticket != null ? Number(payload.ticket) : signalRow?.ticket ?? null,
        symbol,
        side,
        entry_price: entry,
        exit_price: exit,
        pips: Number.isFinite(pips) ? Number(pips.toFixed(2)) : null,
        profit: payload.profit != null ? Number(payload.profit) : null,
        r_multiple: r_multiple != null && Number.isFinite(r_multiple) ? Number(r_multiple.toFixed(3)) : null,
        outcome,
        closed_at: payload.time ? new Date(payload.time).toISOString() : new Date().toISOString(),
      };

      const { data, error } = await supabase.from("trades").insert(row).select().single();
      if (error) return json({ error: error.message }, 500);

      if (signalRow?.id) {
        await supabase.from("signals").update({ status: "closed" }).eq("id", signalRow.id);
      }

      return json({ ok: true, trade: data });
    }

    return json({ error: `Unknown type: ${type}` }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
