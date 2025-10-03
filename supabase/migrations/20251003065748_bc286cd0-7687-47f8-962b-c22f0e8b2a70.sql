-- Add partnership columns to sales table
ALTER TABLE public.sales 
ADD COLUMN IF NOT EXISTS is_partnership BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS my_investment NUMERIC,
ADD COLUMN IF NOT EXISTS partner_investment NUMERIC;