// Database types for Total Flywheel database

export type LeadType =
  | "dominion_sponsors"
  | "sba_leads"
  | "trimlight_residential"
  | "trimlight_commercial"
  | "rooted_homeowners"
  | "rooted_providers";

export type LeadStage =
  | "lead"
  | "contacted"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "closed";

export interface Lead {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  lead_type: LeadType;
  stage: LeadStage;
  value?: number;
  notes?: string;
  // Smart fields based on lead type
  loan_amount?: number; // SBA Leads
  underwriting_stage?: string; // SBA Leads
  is_commercial?: boolean; // Trimlight (true = commercial, false = residential)
  sponsorship_asset?: string; // Dominion Sponsors
  referral_partner?: string; // Landscaping leads
  created_at: string;
  updated_at: string;
}

export interface NorthStarAction {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  due_date?: string;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
}

export type FulfillmentCategory = "art" | "music" | "travel" | "meditation";

export interface Fulfillment {
  id: string;
  category: FulfillmentCategory;
  title: string;
  description?: string;
  completed: boolean;
  date?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  date: string;
  priority?: "low" | "medium" | "high";
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface RevenueStream {
  id: string;
  stream_name: string;
  current_revenue: number;
  target_revenue: number;
  month: string;
  created_at: string;
  updated_at: string;
}

export type RevenueStreamName =
  | "dominion_raceway"
  | "rooted"
  | "trimlight_residential"
  | "trimlight_commercial"
  | "sba_funding"
  | "allio_saas"
  | "octane_nation";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  date: string;
  type: "dominion" | "coding" | "meeting" | "personal";
  location?: string;
  created_at: string;
  updated_at: string;
}
