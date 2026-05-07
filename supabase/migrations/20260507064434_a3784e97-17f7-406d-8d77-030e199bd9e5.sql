
-- Applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  nationality TEXT,
  preferred_country TEXT,
  specialty TEXT NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 0,
  licenses TEXT,
  message TEXT,
  cv_path TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Admin check helper
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'Infoserenityconsultancyagency@gmail.com',
    false
  );
$$;

-- Anyone can submit
CREATE POLICY "Anyone can submit applications"
ON public.applications FOR INSERT
WITH CHECK (true);

-- Only admin can view
CREATE POLICY "Admin can view applications"
ON public.applications FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admin can update applications"
ON public.applications FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admin can delete applications"
ON public.applications FOR DELETE
USING (public.is_admin());

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_applications_created_at ON public.applications(created_at DESC);
CREATE INDEX idx_applications_status ON public.applications(status);

-- Storage bucket for CVs (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', false);

-- Anyone can upload a CV
CREATE POLICY "Anyone can upload CVs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cvs');

-- Only admin can read/delete
CREATE POLICY "Admin can view CVs"
ON storage.objects FOR SELECT
USING (bucket_id = 'cvs' AND public.is_admin());

CREATE POLICY "Admin can delete CVs"
ON storage.objects FOR DELETE
USING (bucket_id = 'cvs' AND public.is_admin());
