import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowDownRight, ArrowUpRight, Activity, Target, TrendingUp, Wallet, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type Signal = {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  entry_price: number;
  stop_loss: number | null;
  take_profit: number | null;
  confidence: number | null;
  strategy: string | null;
  status: string;
  signal_time: string;
};

type Trade = {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  entry_price: number;
  exit_price: number;
  pips: number | null;
  profit: number | null;
  r_multiple: number | null;
  outcome: "win" | "loss" | "breakeven";
  closed_at: string;
};

const fmt = (n: number | null | undefined, d = 2) =>
  n == null || !Number.isFinite(Number(n)) ? "—" : Number(n).toFixed(d);

function playPing() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.45);
  } catch {}
}

const Index = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [copied, setCopied] = useState(false);
  const tvRef = useRef<HTMLDivElement>(null);
  const initialLoad = useRef(true);

  const webhookUrl = `https://cwbjrzumqonfyufoyjer.supabase.co/functions/v1/mt5-webhook`;

  useEffect(() => {
    document.title = "XAUUSD Signal Terminal — MT5 Bridge";
    const meta = document.querySelector('meta[name="description"]');
    const desc = "Real-time XAUUSD trading signals from your MT5 EA with outcome tracking and live chart.";
    if (meta) meta.setAttribute("content", desc);
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = desc;
      document.head.appendChild(m);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const [{ data: s }, { data: t }] = await Promise.all([
        supabase.from("signals").select("*").order("signal_time", { ascending: false }).limit(50),
        supabase.from("trades").select("*").order("closed_at", { ascending: false }).limit(100),
      ]);
      setSignals((s as Signal[]) ?? []);
      setTrades((t as Trade[]) ?? []);
      initialLoad.current = false;
    })();

    const ch = supabase
      .channel("mt5-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "signals" }, (p) => {
        const row = p.new as Signal;
        setSignals((prev) => [row, ...prev].slice(0, 50));
        if (!initialLoad.current) {
          playPing();
          toast.success(`${row.side} ${row.symbol} @ ${fmt(row.entry_price)}`, {
            description: row.strategy ?? "New signal received",
          });
        }
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "signals" }, (p) => {
        const row = p.new as Signal;
        setSignals((prev) => prev.map((s) => (s.id === row.id ? row : s)));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "trades" }, (p) => {
        const row = p.new as Trade;
        setTrades((prev) => [row, ...prev].slice(0, 100));
        if (!initialLoad.current) {
          toast(`Trade closed: ${row.outcome.toUpperCase()}`, {
            description: `${row.side} ${row.symbol} • ${fmt(row.pips, 1)} pips`,
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  // TradingView chart
  useEffect(() => {
    if (!tvRef.current) return;
    tvRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "OANDA:XAUUSD",
      interval: "15",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(15, 17, 22, 1)",
      gridColor: "rgba(45, 50, 60, 0.4)",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      studies: ["STD;EMA", "STD;RSI"],
    });
    tvRef.current.appendChild(script);
  }, []);

  const stats = (() => {
    const wins = trades.filter((t) => t.outcome === "win").length;
    const losses = trades.filter((t) => t.outcome === "loss").length;
    const total = wins + losses;
    const winRate = total ? (wins / total) * 100 : 0;
    const totalPips = trades.reduce((a, t) => a + (Number(t.pips) || 0), 0);
    const totalProfit = trades.reduce((a, t) => a + (Number(t.profit) || 0), 0);
    const avgR = trades.length
      ? trades.reduce((a, t) => a + (Number(t.r_multiple) || 0), 0) / trades.length
      : 0;
    return { wins, losses, winRate, totalPips, totalProfit, avgR, count: trades.length };
  })();

  const latest = signals[0];

  const copy = async () => {
    await navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success("Webhook URL copied");
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/60 bg-panel/80 backdrop-blur sticky top-0 z-20">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-3 w-3">
              <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
              <span className="absolute inset-0 rounded-full bg-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                <span className="text-gold">XAUUSD</span> Signal Terminal
              </h1>
              <p className="text-xs text-muted-foreground">MT5 webhook bridge • live</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={copy} className="font-mono-tabular text-xs">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline ml-2 truncate max-w-[260px]">{webhookUrl}</span>
            <span className="sm:hidden ml-2">Webhook URL</span>
          </Button>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Latest signal banner */}
        <section className="bg-panel border border-border rounded-xl p-5 shadow-panel">
          {latest ? (
            <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
              <div className="flex items-center gap-4">
                <div
                  className={`h-14 w-14 rounded-xl flex items-center justify-center ${
                    latest.side === "BUY" ? "bg-success/15 text-bull" : "bg-destructive/15 text-bear"
                  }`}
                >
                  {latest.side === "BUY" ? (
                    <ArrowUpRight className="h-7 w-7" />
                  ) : (
                    <ArrowDownRight className="h-7 w-7" />
                  )}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    Latest signal
                  </div>
                  <div className="text-2xl font-semibold">
                    <span className={latest.side === "BUY" ? "text-bull" : "text-bear"}>
                      {latest.side}
                    </span>{" "}
                    <span className="text-foreground/80">{latest.symbol}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 md:ml-auto font-mono-tabular">
                <Stat label="Entry" value={fmt(latest.entry_price)} />
                <Stat label="SL" value={fmt(latest.stop_loss)} accent="bear" />
                <Stat label="TP" value={fmt(latest.take_profit)} accent="bull" />
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-muted-foreground text-sm">
                Waiting for first signal from your MT5 EA…
              </div>
              <div className="text-xs text-muted-foreground/70 mt-2">
                Install the EA, set the webhook URL above, and attach to XAUUSD M15.
              </div>
            </div>
          )}
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard icon={<Target className="h-4 w-4" />} label="Win rate" value={`${fmt(stats.winRate, 1)}%`} sub={`${stats.wins}W / ${stats.losses}L`} />
          <KpiCard icon={<TrendingUp className="h-4 w-4" />} label="Total pips" value={fmt(stats.totalPips, 1)} accent={stats.totalPips >= 0 ? "bull" : "bear"} />
          <KpiCard icon={<Wallet className="h-4 w-4" />} label="Net profit" value={fmt(stats.totalProfit, 2)} accent={stats.totalProfit >= 0 ? "bull" : "bear"} />
          <KpiCard icon={<Activity className="h-4 w-4" />} label="Avg R" value={fmt(stats.avgR, 2)} sub={`${stats.count} trades`} />
        </section>

        {/* Chart + Signals */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-panel border border-border rounded-xl shadow-panel overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
              <div className="text-sm font-medium">Live chart — XAUUSD</div>
              <div className="text-xs text-muted-foreground font-mono-tabular">M15 • OANDA</div>
            </div>
            <div ref={tvRef} className="h-[460px]" />
          </div>

          <div className="bg-panel border border-border rounded-xl shadow-panel overflow-hidden">
            <div className="px-4 py-3 border-b border-border/60 text-sm font-medium">
              Recent signals
            </div>
            <div className="max-h-[460px] overflow-y-auto divide-y divide-border/40">
              {signals.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">No signals yet.</div>
              )}
              {signals.map((s) => (
                <div key={s.id} className="px-4 py-3 hover:bg-accent/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          s.side === "BUY"
                            ? "bg-success/15 text-bull"
                            : "bg-destructive/15 text-bear"
                        }`}
                      >
                        {s.side}
                      </span>
                      <span className="font-mono-tabular text-sm">{fmt(s.entry_price)}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono-tabular">
                      {new Date(s.signal_time).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-[11px] text-muted-foreground font-mono-tabular">
                    <span>SL {fmt(s.stop_loss)}</span>
                    <span>TP {fmt(s.take_profit)}</span>
                    <span className="ml-auto capitalize">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trades history */}
        <section className="bg-panel border border-border rounded-xl shadow-panel overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60 text-sm font-medium">
            Trade history
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
                <tr>
                  <th className="text-left px-4 py-2">Time</th>
                  <th className="text-left px-4 py-2">Side</th>
                  <th className="text-right px-4 py-2">Entry</th>
                  <th className="text-right px-4 py-2">Exit</th>
                  <th className="text-right px-4 py-2">Pips</th>
                  <th className="text-right px-4 py-2">R</th>
                  <th className="text-right px-4 py-2">Outcome</th>
                </tr>
              </thead>
              <tbody className="font-mono-tabular">
                {trades.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                      No closed trades yet.
                    </td>
                  </tr>
                )}
                {trades.map((t) => (
                  <tr key={t.id} className="border-t border-border/40 hover:bg-accent/30">
                    <td className="px-4 py-2 text-muted-foreground">
                      {new Date(t.closed_at).toLocaleString()}
                    </td>
                    <td className={`px-4 py-2 font-bold ${t.side === "BUY" ? "text-bull" : "text-bear"}`}>
                      {t.side}
                    </td>
                    <td className="px-4 py-2 text-right">{fmt(t.entry_price)}</td>
                    <td className="px-4 py-2 text-right">{fmt(t.exit_price)}</td>
                    <td className={`px-4 py-2 text-right ${(t.pips ?? 0) >= 0 ? "text-bull" : "text-bear"}`}>
                      {fmt(t.pips, 1)}
                    </td>
                    <td className="px-4 py-2 text-right">{fmt(t.r_multiple, 2)}</td>
                    <td className="px-4 py-2 text-right">
                      <span
                        className={`text-xs px-2 py-0.5 rounded uppercase ${
                          t.outcome === "win"
                            ? "bg-success/15 text-bull"
                            : t.outcome === "loss"
                            ? "bg-destructive/15 text-bear"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {t.outcome}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Setup help */}
        <section className="bg-panel border border-border rounded-xl shadow-panel p-5 text-sm">
          <div className="font-medium mb-2">EA setup</div>
          <ol className="text-muted-foreground space-y-1.5 list-decimal pl-5">
            <li>
              <a
                href="/XauusdSignalBridge.mq5"
                download
                className="text-primary underline-offset-4 hover:underline"
              >
                Download the starter EA (XauusdSignalBridge.mq5)
              </a>{" "}
              and copy it to <code className="text-foreground">MQL5/Experts/</code> in your MT5 data folder.
            </li>
            <li>
              In MT5: <span className="text-foreground">Tools → Options → Expert Advisors</span>, tick{" "}
              <span className="text-foreground">Allow WebRequest for listed URL</span>, and add{" "}
              <code className="text-foreground">https://cwbjrzumqonfyufoyjer.supabase.co</code>.
            </li>
            <li>Compile the EA in MetaEditor and attach it to an XAUUSD M15 chart.</li>
            <li>
              In EA inputs, paste the webhook URL above and your secret token. Signals will appear here in real time.
            </li>
          </ol>
          <p className="text-xs text-muted-foreground/70 mt-4 border-t border-border/50 pt-3">
            ⚠️ This is a probabilistic signal tool, not financial advice. No system can guarantee
            profit. Always use proper risk management and test on a demo account first.
          </p>
        </section>
      </main>
    </div>
  );
};

const Stat = ({ label, value, accent }: { label: string; value: string; accent?: "bull" | "bear" }) => (
  <div>
    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    <div className={`text-lg ${accent === "bull" ? "text-bull" : accent === "bear" ? "text-bear" : ""}`}>
      {value}
    </div>
  </div>
);

const KpiCard = ({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: "bull" | "bear";
}) => (
  <div className="bg-panel border border-border rounded-xl p-4 shadow-panel">
    <div className="flex items-center justify-between text-muted-foreground">
      <span className="text-xs uppercase tracking-widest">{label}</span>
      {icon}
    </div>
    <div
      className={`text-2xl font-semibold mt-2 font-mono-tabular ${
        accent === "bull" ? "text-bull" : accent === "bear" ? "text-bear" : ""
      }`}
    >
      {value}
    </div>
    {sub && <div className="text-[11px] text-muted-foreground mt-1 font-mono-tabular">{sub}</div>}
  </div>
);

export default Index;
