CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a ticket"
  ON public.support_tickets FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 100
    AND length(email) BETWEEN 3 AND 255
    AND length(subject) BETWEEN 1 AND 200
    AND length(message) BETWEEN 1 AND 5000
  );

CREATE POLICY "Admin can view tickets"
  ON public.support_tickets FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin can update tickets"
  ON public.support_tickets FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin can delete tickets"
  ON public.support_tickets FOR DELETE
  USING (public.is_admin());

REVOKE SELECT ON public.support_tickets FROM anon;

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();