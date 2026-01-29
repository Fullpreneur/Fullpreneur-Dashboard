import { createClient } from "./client";
import type {
  Lead,
  LeadType,
  LeadStage,
  NorthStarAction,
  Fulfillment,
  DashboardTask,
  RevenueStream,
  CalendarEvent,
} from "@/lib/types/database";

// Leads queries
export async function getLeads(leadType?: LeadType, stage?: LeadStage): Promise<Lead[]> {
  const supabase = createClient();
  // Try crm_leads first, fallback to leads
  const tableName = "crm_leads";
  let query = supabase.from(tableName).select("*").order("created_at", { ascending: false });

  if (leadType) {
    query = query.eq("lead_type", leadType);
  }

  if (stage) {
    query = query.eq("stage", stage);
  }

  const { data, error } = await query;

  // If crm_leads doesn't exist, try leads table
  if (error && (error.code === "42P01" || error.message?.includes("does not exist"))) {
    console.log("Table 'crm_leads' not found, trying 'leads'...");
    let fallbackQuery = supabase.from("leads").select("*").order("created_at", { ascending: false });
    
    if (leadType) {
      fallbackQuery = fallbackQuery.eq("lead_type", leadType);
    }
    
    if (stage) {
      fallbackQuery = fallbackQuery.eq("stage", stage);
    }
    
    const fallbackResult = await fallbackQuery;
    
    if (fallbackResult.error) {
      console.error("Error fetching leads from 'leads' table:", fallbackResult.error);
      return [];
    }
    
    return fallbackResult.data || [];
  }

  if (error) {
    console.error("Error fetching leads:", error);
    return [];
  }

  return data || [];
}

export async function getClosedLeadsRevenueByStream(): Promise<Record<string, number>> {
  const supabase = createClient();
  // Try crm_leads first, fallback to leads
  let { data, error } = await supabase
    .from("crm_leads")
    .select("lead_type, value")
    .eq("stage", "closed")
    .not("value", "is", null);

  // Fallback to "leads" table if crm_leads doesn't exist
  if (error && (error.code === "42P01" || error.message?.includes("does not exist"))) {
    const fallbackResult = await supabase
      .from("leads")
      .select("lead_type, value")
      .eq("stage", "closed")
      .not("value", "is", null);
    data = fallbackResult.data;
    error = fallbackResult.error;
  }

  if (error) {
    console.error("Error fetching closed leads revenue:", error);
    return {};
  }

  const revenue: Record<string, number> = {};
  data?.forEach((lead) => {
    const stream = lead.lead_type;
    if (!revenue[stream]) {
      revenue[stream] = 0;
    }
    revenue[stream] += Number(lead.value || 0);
  });

  return revenue;
}

export async function createLead(lead: Omit<Lead, "id" | "created_at" | "updated_at">): Promise<Lead | null> {
  const supabase = createClient();
  
  console.log("Creating lead with data:", JSON.stringify(lead, null, 2));
  console.log("Attempting to insert into table: leads");

  // Try "crm_leads" first if that's what the user has, otherwise fallback to "leads"
  const tableName = "crm_leads"; // Changed to match user's table name
  
  const { data, error } = await supabase.from(tableName).insert([lead]).select().single();

  console.log("Supabase insert response:", {
    data: data ? "Success - data received" : "No data",
    error: error ? error : "No error",
    errorDetails: error ? {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    } : null,
  });

  if (error) {
    console.error("Error creating lead - Full error object:", error);
    console.error("Error message:", error.message);
    console.error("Error details:", error.details);
    console.error("Error hint:", error.hint);
    console.error("Error code:", error.code);
    
    // If table doesn't exist, try "leads" as fallback
    if (error.code === "42P01" || error.message?.includes("does not exist")) {
      console.log("Table 'crm_leads' not found, trying 'leads'...");
      const fallbackResult = await supabase.from("leads").insert([lead]).select().single();
      
      if (fallbackResult.error) {
        console.error("Fallback insert also failed:", fallbackResult.error);
        return null;
      }
      
      console.log("Successfully inserted into 'leads' table:", fallbackResult.data);
      return fallbackResult.data;
    }
    
    return null;
  }

  console.log("Successfully created lead:", data);
  return data;
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
  const supabase = createClient();
  // Try crm_leads first, fallback to leads
  let { data, error } = await supabase
    .from("crm_leads")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  // Fallback to "leads" table if crm_leads doesn't exist
  if (error && (error.code === "42P01" || error.message?.includes("does not exist"))) {
    const fallbackResult = await supabase
      .from("leads")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    data = fallbackResult.data;
    error = fallbackResult.error;
  }

  if (error) {
    console.error("Error updating lead:", error);
    return null;
  }

  return data;
}

// North Star Action queries
export async function getActiveNorthStarAction(): Promise<NorthStarAction | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("north_star_actions")
    .select("*")
    .in("status", ["pending", "in_progress"])
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching north star action:", error);
    return null;
  }

  return data;
}

export async function createNorthStarAction(
  action: Omit<NorthStarAction, "id" | "created_at" | "updated_at">
): Promise<NorthStarAction | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("north_star_actions").insert([action]).select().single();

  if (error) {
    console.error("Error creating north star action:", error);
    return null;
  }

  return data;
}

// Fulfillment queries
export async function getFulfillments(limit: number = 10): Promise<Fulfillment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("fulfillments")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching fulfillments:", error);
    return [];
  }

  return data || [];
}

export async function getFulfillmentStats(): Promise<Record<string, { total: number; completed: number }>> {
  const supabase = createClient();
  const { data, error } = await supabase.from("fulfillments").select("category, completed");

  if (error) {
    console.error("Error fetching fulfillment stats:", error);
    return {};
  }

  const stats: Record<string, { total: number; completed: number }> = {
    art: { total: 0, completed: 0 },
    music: { total: 0, completed: 0 },
    travel: { total: 0, completed: 0 },
    meditation: { total: 0, completed: 0 },
  };

  data?.forEach((fulfillment) => {
    const cat = fulfillment.category;
    if (stats[cat]) {
      stats[cat].total++;
      if (fulfillment.completed) {
        stats[cat].completed++;
      }
    }
  });

  return stats;
}

export async function createFulfillment(
  fulfillment: Omit<Fulfillment, "id" | "created_at" | "updated_at">
): Promise<Fulfillment | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("fulfillments").insert([fulfillment]).select().single();

  if (error) {
    console.error("Error creating fulfillment:", error);
    return null;
  }

  return data;
}

// Dashboard Schedule (Daily Tasks) queries
export async function getDashboardTasks(date?: string): Promise<DashboardTask[]> {
  const supabase = createClient();
  let query = supabase.from("dashboard_schedule").select("*").order("created_at", { ascending: true });

  if (date) {
    query = query.eq("date", date);
  } else {
    // Default to today
    const today = new Date().toISOString().split("T")[0];
    query = query.eq("date", today);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching dashboard tasks:", error);
    return [];
  }

  return data || [];
}

export async function createDashboardTask(
  task: Omit<DashboardTask, "id" | "created_at" | "updated_at">
): Promise<DashboardTask | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("dashboard_schedule").insert([task]).select().single();

  if (error) {
    console.error("Error creating dashboard task:", error);
    return null;
  }

  return data;
}

export async function updateDashboardTask(
  id: string,
  updates: Partial<DashboardTask>
): Promise<DashboardTask | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("dashboard_schedule")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating dashboard task:", error);
    return null;
  }

  return data;
}

// Revenue Streams queries
export async function getRevenueStreams(month?: string): Promise<RevenueStream[]> {
  const supabase = createClient();
  let query = supabase.from("revenue_streams").select("*");

  if (month) {
    query = query.eq("month", month);
  } else {
    // Default to current month
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    query = query.eq("month", currentMonth);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching revenue streams:", error);
    return [];
  }

  return data || [];
}

export async function updateRevenueStream(
  id: string,
  updates: Partial<RevenueStream>
): Promise<RevenueStream | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("revenue_streams")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating revenue stream:", error);
    return null;
  }

  return data;
}

// Calendar Events queries
export async function getWeeklyCalendarEvents(startDate: string, endDate: string): Promise<CalendarEvent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching calendar events:", error);
    return [];
  }

  return data || [];
}

export async function createCalendarEvent(
  event: Omit<CalendarEvent, "id" | "created_at" | "updated_at">
): Promise<CalendarEvent | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("calendar_events").insert([event]).select().single();

  if (error) {
    console.error("Error creating calendar event:", error);
    return null;
  }

  return data;
}
