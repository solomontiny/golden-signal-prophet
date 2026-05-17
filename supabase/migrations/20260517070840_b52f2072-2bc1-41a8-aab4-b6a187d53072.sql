-- 1. Lock down is_admin() so anonymous role cannot execute it
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 2. Tighten CV upload policy: restrict mime type + size
DROP POLICY IF EXISTS "Anyone can upload CVs" ON storage.objects;

CREATE POLICY "Public can upload CVs with limits"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'cvs'
  AND (lower(storage.extension(name)) IN ('pdf','doc','docx'))
  AND COALESCE((metadata->>'size')::bigint, 0) <= 10485760
  AND COALESCE(metadata->>'mimetype','') IN (
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )
);

-- 3. Hide applications table from anonymous GraphQL discovery
REVOKE SELECT ON public.applications FROM anon;