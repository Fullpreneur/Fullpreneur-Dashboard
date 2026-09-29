"use client";
import React, { useState, useMemo } from "react";
import { 
  Calendar, Clock, DollarSign, MessageSquare, TrendingUp, 
  ChevronDown, ShieldCheck, Zap, AlertCircle, Play, 
  CheckCircle2, Target, Users, Briefcase, Info
} from "lucide-react";

/**
 * DATA GOLIATH: This object contains the literal text and 
 * data points extracted from the 34-page plan.
 */
const FULL_PLAN_DATABASE = {
  metadata: {
    commitment: "75-88 hours/week", // [cite: 25]
    sprint_duration: "90 Days", // [cite: 325]
    focus: "Data Mastery & Revenue Flywheel" // [cite: 285]
  },
  
  // 1. THE REVENUE PILLARS [cite: 2-9]
  pillars: [
    { id: 1, name: "Landscaping Maintenance", type: "EXISTING", revenue: "$300-800/mo", detail: "Foundation for Rooted beta testers." },
    { id: 2, name: "Home Improvement (Trimlight)", type: "HIGH-MARGIN", revenue: "$2k-10k/mo", detail: "Prioritize consultations. Easiest sales." },
    { id: 3, name: "Business Funding (SBA 7a)", type: "CASH INJECTION", revenue: "$5k-25k/deal", detail: "Target Dominion vendors and sponsors." },
    { id: 4, name: "Allio", type: "B2B SaaS", revenue: "$299-499/venue", detail: "MVP: Event scheduling, ticketing, compliance." },
    { id: 5, name: "Rooted", type: "MARKETPLACE", revenue: "$100-500/mo", detail: "Scalable ecosystem; referral commissions." },
    { id: 6, name: "Octane Nation", type: "COMMUNITY", revenue: "$0 (Early)", detail: "Long-term community and fan engagement." },
    { id: 7, name: "Dominion Raceway", type: "DAY JOB", revenue: "$50k Base", detail: "Negotiating increase in Week 2." }
  ],

  // 2. THE 168-HOUR WEEKLY MAP 
  time_allocation: [
    { activity: "Sleep", hours: 49, desc: "7 hrs/night (Non-negotiable)" },
    { activity: "Family Time", hours: 20, desc: "Quality time priority" },
    { activity: "Dominion Work", hours: 30, desc: "Batched and efficient" },
    { activity: "Platform & Revenue", hours: 40, desc: "Split across all side-streams" },
    { activity: "Content/Social", hours: 8, desc: "Supports all platforms" },
    { activity: "Buffer/Personal", hours: 10, desc: "Meals, exercise, decompression" }
  ],

  // 3. THE LITERAL MONDAY-SUNDAY SCHEDULE 
  master_schedule: {
    monday: {
      blocks: [
        { time: "08:00 - 11:00", task: "Dominion Morning Batch", instructions: "Batch create/schedule week's social; handle urgent admin; set up automations." },
        { time: "11:00 - 13:00", task: "Landscaping Midday", instructions: "Service clients or schedule week's jobs; return referral calls/texts." },
        { time: "13:00 - 16:00", task: "Business Funding Setup", instructions: "Research Lendio/Biz2Credit/Funding Circle; set up Carrd landing page (30 min); list 20 contacts." },
        { time: "19:00 - 21:00", task: "Outreach & Planning", instructions: "Set up Toggl/Clockify; message 3 funding contacts; review Trimlight pipeline." }
      ]
    },
    tuesday: {
      blocks: [
        { time: "10:00 - 18:00", task: "Dominion Office Day", instructions: "10am Staff Meeting (Mandatory); CRITICAL: Request 1-on-1 with boss for next Tuesday." },
        { time: "Evening", task: "Negotiation Prep", instructions: "Draft salary negotiation proposal; review Wednesday priorities." }
      ]
    },
    wednesday: {
      blocks: [
        { time: "08:00 - 11:00", task: "Dominion Remote", instructions: "Essential content/admin only; respond to critical messages." },
        { time: "11:00 - 14:00", task: "Trimlight Sales Focus", instructions: "Call/text 5 prospects; schedule 1-2 consultations; follow up on quotes." },
        { time: "14:00 - 16:00", task: "Business Funding", instructions: "Complete broker applications; refine outreach templates; send 5 personalized messages." },
        { time: "16:00 - 21:00", task: "AlliO Development", instructions: "Define MVP feature list; focus on ONE (Scheduling/Ticketing); call 2 tracks for beta." }
      ]
    },
    thursday: {
        blocks: [
          { time: "08:00 - 10:00", task: "Dominion Remote", instructions: "Quick content check; essential admin only." },
          { time: "10:00 - 14:00", task: "Landscaping Work", instructions: "Service clients or yard work. This is hands-on revenue - PROTECT IT." },
          { time: "14:00 - 16:00", task: "AlliO Build", instructions: "Continue MVP development; build one complete workflow end-to-end." },
          { time: "16:00 - 18:00", task: "Rooted Foundation", instructions: "Identify 10 trusted contractors (Roofing, HVAC, etc.); draft 10-15% referral fee pitch." }
        ]
    },
    friday: {
        blocks: [
          { time: "08:00 - 10:00", task: "Dominion Remote", instructions: "Handle urgent content needs." },
          { time: "10:00 - 13:00", task: "Trimlight Consultation", instructions: "Measure, quote, close. High-margin work - prioritize it." },
          { time: "13:00 - 18:00", task: "AlliO Power Session", instructions: "Uninterrupted focus to complete significant features." },
          { time: "19:00 - 21:00", task: "Rooted Outreach", instructions: "Contact 5 contractors; send landing page link; schedule follow-ups." }
        ]
    }
  },

  // 4. THE 90-DAY MILESTONES [cite: 156-267]
  roadmap: [
    {
        month: "Month 1: Foundation",
        revenue: "$6,567 - $20,467",
        goals: [
            "Maintain 10 landscaping clients (Rooted beta pool)",
            "Close 2-3 Trimlight sales ($2k-10k revenue)",
            "Appoint with 3-4 SBA brokers (Lendio, etc.)",
            "Commit 2-3 AlliO beta tracks"
        ]
    },
    {
        month: "Month 2: Validation",
        revenue: "$14,367 - $37,650",
        goals: [
            "Close first $5k-15k SBA deal",
            "30-40 paying Rooted members ($9.99/mo)",
            "AlliO MVP fully functional with beta users",
            "Submit 2-3 deals to SBA underwriting"
        ]
    },
    {
        month: "Month 3: Scale",
        revenue: "$47,201 - $137,700",
        goals: [
            "Convert AlliO beta to 4-6 paying customers",
            "Close 2-3 SBA deals ($10k-45k revenue)",
            "50-75 Rooted members; 20-25 contractors",
            "Hire VA for lead qualification ($300-500/mo)"
        ]
    }
  ],

  // 5. THE LITERAL NEGOTIATION SCRIPT 
  negotiation: {
    script_intro: "I want to have an important conversation about my role and my side projects. Transparency is key.",
    responsibilities: [
        "Marketing Director (Content, Social, Ads, Web)",
        "Live Stream Production",
        "Track Announcer",
        "Social for 118 Bar & Grill, Road Course, No Prep, Groove Music Hall",
        "Press Releases & Media Relations",
        "All printed material design"
    ],
    outcomes: [
        { label: "Option 1", detail: "$75k Base + 15% Commission (Keep Full-time)" },
        { label: "Option 2", detail: "$60k Base + 10% Commission (Middle Ground)" },
        { label: "Option 3", detail: "30 Hours/Week @ $50k (Effective raise to $32/hr)" },
        { label: "Option 4", detail: "Dominion gets 5-10% AlliO equity for formal support" }
    ]
  },

  // 6. THE 18-MONTH VISION [cite: 278-280]
  long_term: {
    month_12: "$37.6k - $116.2k / Month",
    month_18: "$57k - $181k / Month",
    annual_run_rate: "$684k - $2.1M"
  }
};

export default function ExecutionPlaybookOS() {
  const [view, setView] = useState<"schedule" | "roadmap" | "negotiation" | "financials">("schedule");
  const [activeDay, setActiveDay] = useState<string>("monday");
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (key: string) => {
    setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-[#050505] min-h-screen text-zinc-100 p-4 md:p-12 font-sans overflow-x-hidden">
      
      {/* 1. COMMAND HEADER */}
      <header className="mb-20 border-b border-zinc-900 pb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-20 bg-[#00f2ff]"></div>
          <p className="text-[#00f2ff] font-black text-[10px] tracking-[0.5em] uppercase italic">System: Complete Plan v2.0</p>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <h1 className="text-8xl md:text-[12rem] font-black italic uppercase tracking-tighter leading-[0.8]">
            THE <span className="text-zinc-800">VAULT</span>
          </h1>
          <div className="grid grid-cols-2 gap-4 w-full lg:w-96">
            <StatCard label="Year 1 Target" value={FULL_PLAN_DATABASE.long_term.month_12} />
            <StatCard label="Sprint Phase" value="Months 1-3" color="text-red-500" />
          </div>
        </div>
      </header>

      {/* 2. NAVIGATION OVERRIDE */}
      <nav className="flex flex-wrap gap-4 mb-16">
        <NavBtn active={view === "schedule"} onClick={() => setView("schedule")} label="Execution Rhythm" />
        <NavBtn active={view === "roadmap"} onClick={() => setView("roadmap")} label="90-Day Roadmap" />
        <NavBtn active={view === "negotiation"} onClick={() => setView("negotiation")} label="Negotiation Script" />
        <NavBtn active={view === "financials"} onClick={() => setView("financials")} label="Financial Projections" />
      </nav>

      {/* 3. DYNAMIC CONTENT ENGINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: THE DATA FEED */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* VIEW: DAILY SCHEDULE (EXACT) */}
          {view === "schedule" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex gap-2 overflow-x-auto pb-6 mb-8 no-scrollbar">
                {Object.keys(FULL_PLAN_DATABASE.master_schedule).map(day => (
                  <button 
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest italic transition-all border ${activeDay === day ? "bg-white text-black border-white" : "bg-zinc-900 text-zinc-500 border-zinc-800"}`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                {(FULL_PLAN_DATABASE.master_schedule as any)[activeDay].blocks.map((block: any, i: number) => (
                  <div key={i} className={`group p-8 rounded-[3rem] border-2 transition-all cursor-pointer ${completedTasks[`${activeDay}-${i}`] ? "border-emerald-500/20 bg-emerald-500/5" : "border-zinc-800 hover:border-zinc-600 bg-zinc-900/20"}`}>
                    <div className="flex justify-between items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Clock className="w-4 h-4 text-[#00f2ff]" />
                          <span className="text-[10px] font-black text-[#00f2ff] uppercase tracking-widest">{block.time}</span>
                        </div>
                        <h3 className={`text-4xl font-black italic uppercase tracking-tighter mb-4 ${completedTasks[`${activeDay}-${i}`] ? "text-zinc-600 line-through" : "text-white"}`}>
                          {block.task}
                        </h3>
                        <div className="bg-black/50 p-6 rounded-2xl border border-zinc-800">
                           <p className="text-zinc-400 font-bold italic text-sm uppercase leading-relaxed">{block.instructions}</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleTask(`${activeDay}-${i}`); }}
                        className={`p-6 rounded-3xl transition-all ${completedTasks[`${activeDay}-${i}`] ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"}`}
                      >
                        <CheckCircle2 className="w-8 h-8" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: ROADMAP (THE MILESTONES) */}
          {view === "roadmap" && (
            <div className="space-y-10 animate-in fade-in duration-500">
              {FULL_PLAN_DATABASE.roadmap.map((phase, i) => (
                <div key={i} className="bg-zinc-900/20 border-2 border-zinc-800 rounded-[4rem] p-12">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 pb-6 border-b border-zinc-800">
                    <div>
                      <h2 className="text-6xl font-black italic uppercase tracking-tighter text-[#00f2ff]">{phase.month}</h2>
                      <p className="text-zinc-500 font-black text-xs uppercase tracking-widest mt-2 italic">Target: {phase.revenue}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {phase.goals.map((goal, gi) => (
                      <div key={gi} className="flex gap-4 items-start p-6 bg-black/40 border border-zinc-800 rounded-3xl">
                        <Target className="w-6 h-6 text-zinc-700 flex-shrink-0" />
                        <p className="text-sm font-bold italic uppercase text-zinc-300 leading-tight">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW: NEGOTIATION (LITERAL SCRIPT) */}
          {view === "negotiation" && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="bg-zinc-900/40 border border-zinc-800 p-12 rounded-[4rem]">
                <h2 className="text-4xl font-black italic uppercase text-[#00f2ff] mb-8">Tuesday Protocol</h2>
                <div className="bg-black p-10 rounded-[2.5rem] border border-zinc-800 mb-10">
                  <p className="text-2xl font-black italic text-zinc-100 uppercase leading-relaxed">
                    "{FULL_PLAN_DATABASE.negotiation.script_intro}"
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest italic border-b border-zinc-800 pb-2">Responsibilities to Assert</p>
                    {FULL_PLAN_DATABASE.negotiation.responsibilities.map((r, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs font-bold italic uppercase text-zinc-400">
                        <div className="w-2 h-2 bg-[#00f2ff] rounded-full"></div> {r}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-6">
                    <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest italic border-b border-zinc-800 pb-2">Target Outcomes</p>
                    {FULL_PLAN_DATABASE.negotiation.outcomes.map((o, i) => (
                      <div key={i} className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                        <p className="text-lg font-black text-white italic uppercase">{o.label}</p>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase mt-1">{o.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: REVENUE & FLYWHEEL PILLARS */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-zinc-900 p-10 rounded-[4rem] border border-zinc-800">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] italic text-zinc-600 mb-8 flex items-center gap-3">
               <DollarSign className="w-4 h-4" /> Revenue Pillars
            </h3>
            <div className="space-y-10">
              {FULL_PLAN_DATABASE.pillars.map(p => (
                <div key={p.id} className="relative">
                  <div className="flex justify-between items-end mb-1">
                    <p className="text-xl font-black italic uppercase tracking-tighter text-white">{p.name}</p>
                    <p className="text-[10px] font-black text-emerald-400 italic uppercase">{p.revenue}</p>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic">{p.detail}</p>
                  <div className="h-px bg-zinc-800 w-full mt-4"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/40 p-10 rounded-[4rem] border border-zinc-800">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] italic text-zinc-600 mb-8 flex items-center gap-3">
               <ShieldCheck className="w-4 h-4" /> Strategy Logic
            </h3>
            <div className="space-y-6">
               <LogicItem label="Hub Strategy" desc="Landscaping clients are Rooted beta testers. Referrals drive Trimlight." />
               <LogicItem label="Negotiation" desc="Leverage 11 duties vs. $50k salary for effective raise/hours cut." />
               <LogicItem label="Scaling" desc="Kill/Delegate 2-3 streams after 90 days of data collection." />
            </div>
          </div>
        </aside>
      </div>

      <footer className="mt-32 pt-12 border-t border-zinc-900 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] italic text-zinc-700">Reality Check: The first 90 days require a 90-hour commitment to reach the exit threshold.</p>
        <div className="flex gap-4">
           <div className="px-4 py-2 bg-zinc-900 rounded-lg text-[8px] font-black uppercase text-zinc-500 italic">Playbook Integrated</div>
           <div className="px-4 py-2 bg-zinc-900 rounded-lg text-[8px] font-black uppercase text-zinc-500 italic">Source: Complete Plan</div>
        </div>
      </footer>
    </div>
  );
}

// SUB-COMPONENTS
function StatCard({ label, value, color = "text-[#00f2ff]" }: any) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2rem]">
      <p className="text-[9px] font-black uppercase text-zinc-500 italic mb-1 tracking-widest">{label}</p>
      <p className={`text-xl font-black italic tracking-tighter uppercase ${color}`}>{value}</p>
    </div>
  );
}

function NavBtn({ active, onClick, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest italic transition-all border-2 ${active ? "bg-[#00f2ff] border-[#00f2ff] text-black shadow-[0_0_40px_rgba(0,242,255,0.3)]" : "bg-transparent border-zinc-800 text-zinc-600 hover:text-white"}`}
    >
      {label}
    </button>
  );
}

function LogicItem({ label, desc }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-white uppercase italic tracking-widest">{label}</p>
      <p className="text-[10px] font-bold text-zinc-600 uppercase leading-relaxed">{desc}</p>
    </div>
  );
}