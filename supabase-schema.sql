-- Total Flywheel Database Schema
-- Run this in your Supabase SQL Editor to set up the database tables

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  lead_type TEXT NOT NULL CHECK (lead_type IN (
    'dominion_sponsors',
    'sba_leads',
    'trimlight_residential',
    'trimlight_commercial',
    'rooted_homeowners',
    'rooted_providers'
  )),
  stage TEXT NOT NULL DEFAULT 'lead' CHECK (stage IN (
    'lead',
    'contacted',
    'qualified',
    'proposal',
    'negotiation',
    'closed'
  )),
  value NUMERIC,
  notes TEXT,
  -- Smart fields based on lead type
  loan_amount NUMERIC, -- SBA Leads
  underwriting_stage TEXT, -- SBA Leads
  is_commercial BOOLEAN, -- Trimlight (true = commercial, false = residential)
  sponsorship_asset TEXT, -- Dominion Sponsors
  referral_partner TEXT, -- Landscaping leads
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- North Star Actions table
CREATE TABLE IF NOT EXISTS north_star_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fulfillments table
CREATE TABLE IF NOT EXISTS fulfillments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('art', 'music', 'travel', 'meditation')),
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  date DATE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dashboard Schedule (Daily Tasks) table
CREATE TABLE IF NOT EXISTS dashboard_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  date DATE NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue Streams table
CREATE TABLE IF NOT EXISTS revenue_streams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stream_name TEXT NOT NULL,
  current_revenue NUMERIC NOT NULL DEFAULT 0,
  target_revenue NUMERIC NOT NULL DEFAULT 0,
  month TEXT NOT NULL, -- Format: YYYY-MM
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar Events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('dominion', 'coding', 'meeting', 'personal')),
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_lead_type ON leads(lead_type);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_north_star_actions_status ON north_star_actions(status);
CREATE INDEX IF NOT EXISTS idx_fulfillments_category ON fulfillments(category);
CREATE INDEX IF NOT EXISTS idx_fulfillments_date ON fulfillments(date);
CREATE INDEX IF NOT EXISTS idx_dashboard_schedule_date ON dashboard_schedule(date);
CREATE INDEX IF NOT EXISTS idx_revenue_streams_month ON revenue_streams(month);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_north_star_actions_updated_at BEFORE UPDATE ON north_star_actions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fulfillments_updated_at BEFORE UPDATE ON fulfillments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_schedule_updated_at BEFORE UPDATE ON dashboard_schedule
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_streams_updated_at BEFORE UPDATE ON revenue_streams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - you can modify this based on your auth needs
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE north_star_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fulfillments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (modify these based on your auth requirements)
-- For now, these allow all operations - you may want to restrict based on user authentication
CREATE POLICY "Allow all operations on leads" ON leads
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on north_star_actions" ON north_star_actions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on fulfillments" ON fulfillments
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on dashboard_schedule" ON dashboard_schedule
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on revenue_streams" ON revenue_streams
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on calendar_events" ON calendar_events
  FOR ALL USING (true) WITH CHECK (true);
