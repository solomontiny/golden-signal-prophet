-- Signals table
CREATE TABLE public.signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL DEFAULT 'XAUUSD',
  side TEXT NOT NULL CHECK (side IN ('BUY','SELL')),
  entry_price NUMERIC NOT NULL,
  stop_loss NUMERIC,
  take_profit NUMERIC,
  confidence NUMERIC,
  strategy TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed','cancelled')),
  ticket BIGINT,
  signal_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_signals_signal_time ON public.signals (signal_time DESC);
CREATE INDEX idx_signals_ticket ON public.signals (ticket);

ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read signals"
  ON public.signals FOR SELECT
  USING (true);

-- Trades (outcomes) table
CREATE TABLE public.trades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  signal_id UUID REFERENCES public.signals(id) ON DELETE SET NULL,
  ticket BIGINT,
  symbol TEXT NOT NULL DEFAULT 'XAUUSD',
  side TEXT NOT NULL CHECK (side IN ('BUY','SELL')),
  entry_price NUMERIC NOT NULL,
  exit_price NUMERIC NOT NULL,
  pips NUMERIC,
  profit NUMERIC,
  r_multiple NUMERIC,
  outcome TEXT NOT NULL CHECK (outcome IN ('win','loss','breakeven')),
  closed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_trades_closed_at ON public.trades (closed_at DESC);

ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read trades"
  ON public.trades FOR SELECT
  USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.signals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trades;