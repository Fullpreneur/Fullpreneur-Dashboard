"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { createClient } from '@/lib/supabase/client';
import { 
  Clock, Calendar, Zap, Target, Activity, 
  ChevronRight, Play, Trophy, Rocket, 
  Landmark, Construction, Users, CheckCircle2,
  TrendingUp, AlertCircle, StopCircle, LayoutGrid,
  ShieldCheck, FileText, Lock, Share2, DollarSign,
  ArrowUpRight, BarChart3, Lightbulb, Star, Brain, Fingerprint
} from "lucide-react";

export default function UltimateCommandCenter() {
  const supabase = createClient();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- CORE CRM & CAPACITY STATE ---
  const [crmStats, setCrmStats] = useState({ 
    fulfillment: 0, 
    capacity: 0, 
    totalLeads: 0,
    pipelineValue: 0 
  });

  // --- SYSTEM CLOCK ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- CONSOLIDATED DATA SYNC ---
  useEffect(() => {
    const syncSystemData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch both Appointments (Fulfillment/Capacity) and Leads (Revenue)
        const [apptsRes, leadsRes] = await Promise.all([
          supabase.from('appointments').select('pillar'),
          supabase.from('crm_leads').select('deal_value, pillar_tag')
        ]);

        let calculatedFulfillment = 0;
        let calculatedCapacity = 0;
        let totalRevenue = 0;

        // Process Appointments for Fulfillment Score
        if (apptsRes.data && apptsRes.data.length > 0) {
          const total = apptsRes.data.length;
          const personalItems = apptsRes.data.filter(a => ['Personal', 'Creative'].includes(a.pillar)).length;
          calculatedFulfillment = Math.round((personalItems / total) * 100);

          const businessItems = apptsRes.data.filter(a => 
            ['SBA', 'Dominion', 'AlliO', 'Property', 'Octane'].includes(a.pillar)
          ).length;
          calculatedCapacity = Math.min(Math.round((businessItems / 40) * 100), 100);
        }

        // Process Leads for Revenue Target
        if (leadsRes.data) {
          totalRevenue = leadsRes.data.reduce((acc, curr) => acc + (curr.deal_value || 0), 0);
        }

        setCrmStats({
          fulfillment: calculatedFulfillment,
          capacity: calculatedCapacity,
          totalLeads: leadsRes.data?.length || 0,
          pipelineValue: totalRevenue
        });

      } catch (e) {
        console.error("OS_SYNC_ERROR", e);
      } finally {
        setLoading(false);
      }
    };
    syncSystemData();
  }, [supabase]);

  // --- LIVE TASK LOGIC (Your Original Schedule) ---
  const getActiveTask = () => {
    const day = currentTime.getDay(); 
    const hour = currentTime.getHours();
    
    // Logic for Mon, Tue, Wed, Sun as per your original file
    if (day === 1) { // Monday
      if (hour >= 8 && hour < 11) return { task: "Dominion Content Batching", stream: "DOMINION", path: "/opportunities/dominion", next: "Landscaping Ops @ 11AM" };
      if (hour >= 11 && hour < 13) return { task: "Service Landscaping Clients", stream: "LANDSCAPING", path: "/opportunities/property-improvement", next: "Funding Apps @ 1PM" };
      if (hour >= 13 && hour < 16) return { task: "SBA 7(a) Applications", stream: "BUSINESS FUNDING", path: "/opportunities/sba", next: "Trimlight Review @ 7PM" };
    }
    if (day === 3) { // Wednesday
      if (hour >= 16 && hour < 21) return { task: "AlliO MVP Development", stream: "ALLIO SAAS", path: "/opportunities/allio", next: "Beta Outreach @ 8PM" };
    }
    return { task: "System Maintenance", stream: "SYSTEMS", path: "/vault", next: "Review Q1 Roadmap" };
  };

  const live = getActiveTask();

  if (loading) return <div className="h-screen bg-black flex items-center justify-center"><Zap className="text-[#00f2ff] animate-pulse" /></div>;

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[#050505] min-h-full text-white font-sans uppercase italic selection:bg-[#00f2ff]/30">
      
      {/* 1. HEADER & KPI ROW */}
      <header className="flex flex-col xl:flex-row justify-between items-start gap-8">
        <div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            CONTROL <span className="text-zinc-800">CENTER</span>
          </h1>
          <div className="flex items-center gap-3 mt-4">
             <div className="bg-[#00f2ff]/10 px-3 py-1 rounded border border-[#00f2ff]/20">
               <p className="text-[#00f2ff] font-black tracking-[0.4em] text-[9px] uppercase">24-PAGE STRATEGY EXECUTION</p>
             </div>
             <p className="text-zinc-600 font-bold text-[9px] uppercase">OS_VER_4.0.1</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full lg:max-w-6xl">
          {/* FULFILLMENT */}
          <div className="bg-purple-900/10 border border-purple-500/20 p-5 rounded-[2rem] hover:border-purple-500/50 transition-all">
             <div className="flex items-center gap-2 mb-2">
               <Star className="text-purple-400 w-3 h-3 fill-current" />
               <p className="text-[9px] font-black text-purple-400 tracking-widest uppercase">Fulfillment</p>
             </div>
             <p className="text-3xl font-black tracking-tighter">{crmStats.fulfillment}%</p>
             <div className="w-full bg-zinc-800 h-1 rounded-full mt-3 overflow-hidden">
               <div className="bg-purple-500 h-full transition-all duration-1000" style={{ width: `${crmStats.fulfillment}%` }} />
             </div>
          </div>

          {/* REVENUE */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-[2rem] hover:border-[#22c55e]/50 transition-all">
             <p className="text-[9px] font-black text-zinc-500 tracking-widest mb-1">Pipeline Value</p>
             <p className="text-3xl font-black tracking-tighter text-white">${crmStats.pipelineValue.toLocaleString()}</p>
             <div className="w-full bg-zinc-800 h-1 rounded-full mt-3 overflow-hidden">
               <div className="bg-[#22c55e] h-full" style={{ width: `${Math.min((crmStats.pipelineValue / 2100000) * 100, 100)}%` }} />
             </div>
          </div>

          {/* SYSTEM STATUS */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-[2rem] hover:border-[#00f2ff]/50 transition-all">
             <p className="text-[9px] font-black text-zinc-500 tracking-widest mb-1 uppercase">System Status</p>
             <p className="text-3xl font-black text-[#00f2ff]">NOMINAL</p>
             <p className="text-[9px] text-zinc-600 font-bold uppercase mt-2">All Pillars Active</p>
          </div>

          {/* CAPACITY */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-[2rem] hover:border-[#facc15]/50 transition-all">
             <p className="text-[9px] font-black text-zinc-500 tracking-widest mb-1 uppercase">Capacity</p>
             <p className="text-3xl font-black text-white">{crmStats.capacity}%</p>
             <div className="w-full bg-zinc-800 h-1 rounded-full mt-3 overflow-hidden">
               <div className={`h-full transition-all duration-1000 ${crmStats.capacity > 90 ? 'bg-red-500' : 'bg-[#facc15]'}`} style={{ width: `${crmStats.capacity}%` }} />
             </div>
          </div>
        </div>
      </header>

      {/* 2. LIVE ACTION HUB (CENTRAL FOCUS) */}
      
      <section className={`transition-all duration-700 border p-8 md:p-12 rounded-[3rem] relative overflow-hidden group shadow-2xl ${isSessionActive ? 'bg-[#00f2ff]/5 border-[#00f2ff]' : 'bg-zinc-900/20 border-zinc-800'}`}>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-10 text-center lg:text-left">
          <div className="space-y-6">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className={`w-3 h-3 rounded-full ${isSessionActive ? 'bg-[#00f2ff] animate-ping' : 'bg-red-600 animate-pulse'}`} />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">
                {isSessionActive ? 'ACTIVE FOCUS SESSION' : 'LIVE OPERATIONAL STREAM'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[#00f2ff] text-xs font-black uppercase tracking-[0.2em]">{live.stream} — WEEK 1 ACTION</p>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight uppercase italic">{live.task}</h2>
              <p className="text-zinc-500 text-sm md:text-lg italic font-bold max-w-3xl border-l-4 border-zinc-800 pl-6 mx-auto lg:mx-0">Coming up: {live.next}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto">
            <div className="bg-black/80 p-6 rounded-[2rem] border border-zinc-800 text-center w-full min-w-[280px]">
              <p className="text-[9px] font-black text-zinc-600 uppercase mb-2 tracking-widest">Timestamp</p>
              <p className="text-4xl font-black tracking-tighter text-white tabular-nums">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
            <div className="flex gap-4 w-full">
               <button onClick={() => setIsSessionActive(!isSessionActive)} className={`flex-1 px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-4 ${isSessionActive ? 'bg-red-600 text-white' : 'bg-white text-black hover:bg-[#00f2ff]'}`}>
                {isSessionActive ? <StopCircle size={18} /> : <Play size={18} className="fill-current" />} {isSessionActive ? 'END FOCUS' : 'INITIALIZE'}
              </button>
              <Link href={live.path} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800"><ArrowUpRight size={20} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OPPORTUNITY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: "SBA FUNDING", path: "/opportunities/sba", status: "ACTIVE", task: "20 Leads Outreach", icon: Landmark, color: "#facc15" },
          { name: "DOMINION", path: "/opportunities/dominion", status: "ACTIVE", task: "Content Batch", icon: Trophy, color: "#3b82f6" },
          { name: "PROPERTY", path: "/opportunities/property-improvement", status: "REVENUE", task: "Trimlight Leads", icon: Construction, color: "#22c55e" },
          { name: "ALLIO SAAS", path: "/opportunities/allio", status: "BETA", task: "MVP Event Logic", icon: Activity, color: "#00f2ff" },
          { name: "OCTANE", path: "/opportunities/octane-nation", status: "AVON GEAR", task: "Event Blast", icon: Rocket, color: "#ef4444" },
          { name: "STRATEGY", path: "/vault", status: "CORE", task: "System Review", icon: ShieldCheck, color: "#a855f7" }
        ].map((hub, i) => (
          <Link key={i} href={hub.path} className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-[2.5rem] hover:border-zinc-500 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-black rounded-xl border border-zinc-800 group-hover:border-zinc-700">
                <hub.icon className="w-6 h-6" style={{ color: hub.color }} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: hub.color }}>{hub.status}</p>
            </div>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2">{hub.name}</h3>
            <p className="text-[10px] text-zinc-500 font-bold italic mb-6 border-l-2 border-zinc-800 pl-4">{hub.task}</p>
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-[9px] text-zinc-600 font-black uppercase">Launch_Node</span>
              <ChevronRight size={14} className="text-zinc-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      {/* 4. STRATEGIC MILESTONES FOOTER */}
      <footer className="bg-zinc-900/10 border border-zinc-800 p-8 md:p-12 rounded-[3rem] grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
           <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em]">Systems Navigation</h4>
           <div className="grid grid-cols-1 gap-2">
             {[
               { label: "Calendar", icon: Calendar, path: "/calendar" },
               { label: "CRM / Pipeline", icon: Target, path: "/crm" },
               { label: "Vault", icon: ShieldCheck, path: "/vault" }
             ].map((sys, i) => (
               <Link key={i} href={sys.path} className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800/50 hover:bg-white hover:text-black transition-all group font-black uppercase text-[9px] tracking-widest">
                 <sys.icon size={16} /> {sys.label}
               </Link>
             ))}
           </div>
        </div>
        
        <div className="lg:col-span-3 bg-black/40 border border-zinc-800/50 p-8 rounded-[2.5rem]">
           <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-6">Strategic Milestones</p>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {[
               { l: "Monday", v: "Funding Leads", target: "100%" },
               { l: "Wednesday", v: "AlliO MVP", target: "In Progress" },
               { l: "Friday", v: "Rooted Pitch", target: "Pending" },
               { l: "Sunday", v: "Review", target: "Scheduled" }
             ].map((m, i) => (
               <div key={i}>
                 <p className="text-[9px] font-black text-zinc-700 uppercase italic mb-1">{m.l}</p>
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