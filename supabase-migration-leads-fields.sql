-- Migration: Add smart fields to leads table
-- Run this in your Supabase SQL Editor if you already have a leads table
-- This adds the new smart fields based on lead type

ALTER TABLE leads
ADD COLUMN IF NOT EXISTS loan_amount NUMERIC,
ADD COLUMN IF NOT EXISTS underwriting_stage TEXT,
ADD COLUMN IF NOT EXISTS is_commercial BOOLEAN,
ADD COLUMN IF NOT EXISTS sponsorship_asset TEXT,
ADD COLUMN IF NOT EXISTS referral_partner TEXT;

-- Optional: Add comments to document the fields
COMMENT ON COLUMN leads.loan_amount IS 'SBA Leads: The loan amount requested';
COMMENT ON COLUMN leads.underwriting_stage IS 'SBA Leads: Current stage in underwriting process';
COMMENT ON COLUMN leads.is_commercial IS 'Trimlight: true for commercial, false for residential';
COMMENT ON COLUMN leads.sponsorship_asset IS 'Dominion Sponsors: Type of sponsorship asset (Banner, Event, etc.)';
COMMENT ON COLUMN leads.referral_partner IS 'Landscaping: Referral partner name for hand-off';
