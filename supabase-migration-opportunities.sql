-- Per-user opportunities. Run in the Supabase SQL editor.
-- Dashboard and sidebar read this table with auth.uid() = user_id.

CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN',
  notes TEXT,
  current_revenue NUMERIC NOT NULL DEFAULT 0,
  target_revenue NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opportunities_user_id ON public.opportunities(user_id);

DROP TRIGGER IF EXISTS update_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "opportunities_select_own" ON public.opportunities;
DROP POLICY IF EXISTS "opportunities_insert_own" ON public.opportunities;
DROP POLICY IF EXISTS "opportunities_update_own" ON public.opportunities;
DROP POLICY IF EXISTS "opportunities_delete_own" ON public.opportunities;

CREATE POLICY "opportunities_select_own" ON public.opportunities
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "opportunities_insert_own" ON public.opportunities
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "opportunities_update_own" ON public.opportunities
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "opportunities_delete_own" ON public.opportunities
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.opportunities TO authenticated;

-- Lead categories are account-defined. Drop the old personal-business check if it exists.
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_lead_type_check;
