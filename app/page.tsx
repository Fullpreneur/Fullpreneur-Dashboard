"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "./calendar/supabase"; 
import { 
  Clock, Calendar, Zap, Target, Activity, 
  ChevronRight, Play, Trophy, Rocket, 
  Landmark, Construction, Users, CheckCircle2,
  TrendingUp, AlertCircle, StopCircle, LayoutGrid,
  ShieldCheck, FileText, Lock, Share2, DollarSign,
  ArrowUpRight, BarChart3, Lightbulb, Star
} from "lucide-react";

export default function UltimateCommandCenter() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeEventMode, setActiveEventMode] = useState("Standard"); 
  const [isSessionActive, setIsSessionActive] = useState(false);
  
  // 1. Updated State with Capacity
  const [crmStats, setCrmStats] = useState({ score: 0, total: 0, capacity: 0 });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Updated Sync Logic for both Fulfillment and Capacity
  useEffect(() => {
    const syncCRMStats = async () => {
      try {
        const { data, error } = await supabase.from('appointments').select('pillar');
        if (data) {
          const total = data.length;
          
          // Fulfillment Calculation (Personal/Creative)
          const fulfillmentItems = data.filter(a => 
            a.pillar === 'Personal' || a.pillar === 'Creative'
          ).length;
          const calculatedFulfillment = total > 0 ? Math.round((fulfillmentItems / total) * 100) : 0;

          // Capacity Calculation (Business Pillars vs 40 Target)
          const businessItems = data.filter(a => 
            ['SBA', 'Dominion', 'AlliO', 'Property', 'Octane'].includes(a.pillar)
          ).length;
          const weeklyTarget = 40; 
          const calculatedCapacity = Math.min(Math.round((businessItems / weeklyTarget) * 100), 100);

          setCrmStats({ 
            score: calculatedFulfillment, 
            total: total,
            capacity: calculatedCapacity 
          });
        }
      } catch (e) {
        console.log("Home: CRM Sync error", e);
      }
    };
    syncCRMStats();
  }, []);

  const getActiveTask = () => {
    const day = currentTime.getDay(); 
    const hour = currentTime.getHours();
    if (day === 1) {
      if (hour >= 8 && hour < 11) return { task: "Dominion Content Batching", stream: "DOMINION", path: "/opportunities/dominion", next: "Landscaping Ops @ 11AM" };
      if (hour >= 11 && hour < 13) return { task: "Service Landscaping Clients", stream: "LANDSCAPING", path: "/opportunities/property-improvement", next: "Funding Apps @ 1PM" };
      if (hour >= 13 && hour < 16) return { task: "SBA 7(a) Applications", stream: "BUSINESS FUNDING", path: "/opportunities/sba", next: "Trimlight Review @ 7PM" };
      if (hour >= 19 && hour < 21) return { task: "Trimlight Hot Prospect Review", stream: "TRIMLIGHT", path: "/opportunities/property-improvement", next: "Review Tomorrow's Plan" };
    }
    if (day === 2) { if (hour >= 10 && hour < 17) return { task: "Dominion Office / Staff Meeting", stream: "DOMINION", path: "/opportunities/dominion", next: "Compensation Strategy @ 5PM" }; }
    if (day === 3) {
      if (hour >= 11 && hour < 14) return { task: "Trimlight Consultations", stream: "PROPERTY IMPROV.", path: "/opportunities/property-improvement", next: "AlliO Dev @ 4PM" };
      if (hour >= 16 && hour < 21) return { task: "AlliO MVP Development", stream: "ALLIO SAAS", path: "/opportunities/allio", next: "Beta Outreach @ 8PM" };
    }
    if (day === 0) { if (hour >= 14 && hour < 19) return { task: "Strategic Planning Session", stream: "SYSTEMS", path: "/vault", next: "Family Time @ 7PM" }; }
    return { task: "System Maintenance & Planning", stream: "SYSTEMS", path: "/vault", next: "Review Week 1 Roadmap" };
  };

  const live = getActiveTask();

  return (
    <div className="p-8 space-y-8 bg-[#050505] min-h-screen text-white font-sans selection:bg-[#00f2ff]/30">
      
      <header className="flex flex-col lg:flex-row justify-between items-start gap-10">
        <div className="flex flex-col">
          <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-none text-white">
            CONTROL <span className="text-zinc-800">CENTER</span>
          </h1>
          <div className="flex items-center gap-3 mt-4">
             <div className="bg-[#00f2ff]/10 px-3 py-1 rounded border border-[#00f2ff]/20">
               <p className="text-[#00f2ff] font-black tracking-[0.4em] text-[10px] uppercase italic">24-PAGE STRATEGY EXECUTION</p>
             </div>
             <p className="text-zinc-600 font-bold text-[10px] uppercase italic">System Ver: 4.0.1</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 lg:max-w-6xl w-full">
          {/* FULFILLMENT KPI */}
          <div className="bg-purple-900/10 border border-purple-500/20 p-6 rounded-[2rem] flex flex-col justify-center group hover:border-purple-500/50 transition-all">
             <div className="flex items-center gap-2 mb-2">
               <Star className="text-purple-400 w-3 h-3 fill-current" />
               <p className="text-[9px] font-black text-purple-400 uppercase italic tracking-widest">Fulfillment</p>
             </div>
             <p className="text-3xl font-black italic tracking-tighter text-white">{crmStats.score}%</p>
             <div className="w-full bg-zinc-800 h-1 rounded-full mt-3 overflow-hidden">
               <div className="bg-purple-500 h-full transition-all duration-1000" style={{ width: `${crmStats.score}%` }} />
             </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem] flex flex-col justify-center group hover:border-[#22c55e]/50 transition-all">
             <p className="text-[9px] font-black text-zinc-500 uppercase italic mb-1 tracking-widest">2026 Revenue Target</p>
             <p className="text-3xl font-black italic tracking-tighter text-white">$2,100,000</p>
             <div className="w-full bg-zinc-800 h-1 rounded-full mt-3 overflow-hidden">
               <div className="bg-[#22c55e] h-full w-[14%]" />
             </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem] flex flex-col justify-center group hover:border-[#00f2ff]/50 transition-all">
             <p className="text-[9px] font-black text-zinc-500 uppercase italic mb-1 tracking-widest">System Status</p>
             <p className="text-3xl font-black italic text-[#00f2ff]">NOMINAL</p>
             <p className="text-[10px] text-zinc-600 font-bold uppercase mt-2 tracking-tighter italic">All Pillars Active</p>
          </div>

          {/* DYNAMIC CAPACITY WIDGET */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem] flex flex-col justify-center group hover:border-[#facc15]/50 transition-all">
             <p className="text-[9px] font-black text-zinc-500 uppercase italic mb-1 tracking-widest">Capacity</p>
             <p className="text-3xl font-black italic text-white">{crmStats.capacity}%</p>
             <div className="w-full bg-zinc-800 h-1 rounded-full mt-3 overflow-hidden">
               <div 
                className={`h-full transition-all duration-1000 ${crmStats.capacity > 90 ? 'bg-red-500' : 'bg-[#facc15]'}`} 
                style={{ width: `${crmStats.capacity}%` }} 
               />
             </div>
             <p className="text-[10px] text-zinc-600 font-bold uppercase mt-2 tracking-tighter italic">
               {crmStats.capacity > 90 ? "Risk: High / Burnout" : "Risk: Minimal"}
             </p>
          </div>
        </div>
      </header>

      {/* LIVE ACTION HUB */}
      <section className={`transition-all duration-700 border p-12 rounded-[4rem] relative overflow-hidden group shadow-2xl ${isSessionActive ? 'bg-[#00f2ff]/5 border-[#00f2ff]' : 'bg-zinc-900/20 border-zinc-800'}`}>
        <div className="flex flex-col lg:flex-row justify-between items-end gap-10 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${isSessionActive ? 'bg-[#00f2ff] animate-ping' : 'bg-red-600 animate-pulse'}`} />
              <p className="text-[12px] font-black uppercase tracking-[0.5em] text-zinc-500 italic">
                {isSessionActive ? 'ACTIVE FOCUS SESSION' : 'LIVE OPERATIONAL STREAM'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[#00f2ff] text-sm font-black uppercase tracking-[0.2em] italic">{live.stream} — WEEK 1 ACTION</p>
              <h2 className="text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-none">{live.task}</h2>
              <p className="text-zinc-500 text-lg italic font-bold max-w-3xl border-l-4 border-zinc-800 pl-6 mt-4">Coming up: {live.next}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-6 w-full lg:w-auto">
            <div className="bg-black/80 p-8 rounded-[2.5rem] border border-zinc-800 text-center w-full min-w-[280px]">
              <p className="text-[10px] font-black text-zinc-600 uppercase mb-2 italic tracking-widest">Operational Timestamp</p>
              <p className="text-5xl font-black italic tracking-tighter text-white tabular-nums">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
            <div className="flex gap-4 w-full">
               <button onClick={() => setIsSessionActive(!isSessionActive)} className={`flex-1 px-12 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-4 ${isSessionActive ? 'bg-red-600 text-white' : 'bg-white text-black hover:bg-[#00f2ff]'}`}>
                {isSessionActive ? <StopCircle /> : <Play className="fill-current" />} {isSessionActive ? 'END FOCUS' : 'INITIALIZE'}
              </button>
              <Link href={live.path} className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl hover:bg-zinc-800"><ArrowUpRight /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* OPPORTUNITY HUBS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { name: "SBA FUNDING", path: "/opportunities/sba", status: "ACTIVE", task: "20 Leads Outreach", icon: Landmark, color: "#facc15", next: "Lendio App" },
          { name: "DOMINION", path: "/opportunities/dominion", status: "ACTIVE", task: "Content Batch", icon: Trophy, color: "#3b82f6", next: "Staff Meeting" },
          { name: "PROPERTY IMPROV.", path: "/opportunities/property-improvement", status: "REVENUE", task: "Trimlight Leads", icon: Construction, color: "#22c55e", next: "Consultations" },
          { name: "ALLIO SAAS", path: "/opportunities/allio", status: "BETA", task: "MVP Event Logic", icon: Activity, color: "#00f2ff", next: "Beta Outreach" },
          { name: "OCTANE NATION", path: "/opportunities/octane-nation", status: "AVON GEAR", task: "Event Blast", icon: Rocket, color: "#ef4444", next: "Distribution" },
          { name: "ROOTED MARKET", path: "/opportunities/rooted", status: "PRE-LAUNCH", task: "Contractor Pitch", icon: Users, color: "#a855f7", next: "Referral Agrmt" }
        ].map((hub, i) => (
          <Link key={i} href={hub.path} className="bg-zinc-900/30 border border-zinc-800 p-10 rounded-[3rem] hover:border-zinc-500 transition-all group">
            <div className="flex justify-between items-start mb-8">
              <div className="p-5 bg-black rounded-2xl border border-zinc-800 group-hover:border-zinc-700">
                <hub.icon className="w-8 h-8" style={{ color: hub.color }} />
              </div>
              <p className="text-[11px] font-black uppercase italic tracking-widest" style={{ color: hub.color }}>{hub.status}</p>
            </div>
            <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-4">{hub.name}</h3>
            <p className="text-sm text-zinc-500 font-bold italic mb-8 border-l-2 border-zinc-800 pl-4">{hub.task}</p>
            <div className="pt-8 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-zinc-700 uppercase italic mb-1">Coming Next:</p>
                  <p className="text-sm font-black italic uppercase text-zinc-400 group-hover:text-white">{hub.next}</p>
                </div>
                <ChevronRight className="text-zinc-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      {/* FOOTER NAVIGATION */}
      <footer className="bg-zinc-900/10 border border-zinc-800 p-12 rounded-[4rem] grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-6">
           <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] italic">Systems Navigation</h4>
           <div className="flex flex-col gap-3">
             {[
               { label: "Master Calendar", icon: Calendar, path: "/calendar" },
               { label: "Full CRM / Pipeline", icon: Target, path: "/crm" },
               { label: "The Strategy Vault", icon: ShieldCheck, path: "/vault" },
               { label: "Creative Space", icon: Lightbulb, path: "/creative" }
             ].map((sys, i) => (
               <Link key={i} href={sys.path} className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800/50 hover:bg-white hover:text-black transition-all group font-black uppercase text-[10px] italic tracking-widest">
                 <sys.icon className="w-5 h-5" /> {sys.label}
               </Link>
             ))}
           </div>
        </div>
        
        <div className="lg:col-span-3 bg-black/40 border border-zinc-800/50 p-8 rounded-[3rem]">
           <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] italic mb-6">Strategic Milestones</p>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {[
               { l: "Monday", v: "Funding Leads", target: "100%" },
               { l: "Wednesday", v: "AlliO MVP", target: "In Progress" },
               { l: "Friday", v: "Rooted Pitch", target: "Pending" },
               { l: "Sunday", v: "Strategy Review", target: "Scheduled" }
             ].map((m, i) => (
               <div key={i}>
                 <p className="text-[10px] font-black text-zinc-700 uppercase italic">{m.l}</p>
                 <p className="text-sm font-black italic uppercase text-zinc-300">{m.v}</p>
                 <p className="text-[9px] font-black text-[#00f2ff] uppercase italic">{m.target}</p>
               </div>
             ))}
           </div>
        </div>
      </footer>
    </div>
  );
}