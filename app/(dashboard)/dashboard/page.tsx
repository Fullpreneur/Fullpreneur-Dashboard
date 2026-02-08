"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client'; // UPDATED PATH
import { useRouter } from 'next/navigation';
// Sidebar import removed - handled by (dashboard)/layout.tsx
import { 
  Zap, 
  TrendingUp, 
  Plus, 
  Search, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Target, 
  BarChart3, 
  Calendar as CalendarIcon,
  Users, 
  Layers, 
  ChevronRight, 
  Activity,
  Filter, 
  MoreVertical, 
  AlertCircle, 
  Briefcase,
  ExternalLink, 
  MousePointer2, 
  Fingerprint,
  ShieldCheck, 
  Terminal, 
  Flame, 
  Globe,
  Wallet,
  Compass,
  ZapOff,
  Bell,
  Cpu,
  Database,
  Lock,
  Eye,
  Settings
} from 'lucide-react';

export default function Dashboard() {
  const supabase = createClient();
  const router = useRouter();
  
  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [systemMessage, setSystemMessage] = useState('ALL SYSTEMS OPERATIONAL');

  // --- DATA INITIALIZATION ---
  useEffect(() => {
    async function getDashboardData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      try {
        // Fetch Revenue/Goal Config
        const { data: configData, error: configError } = await supabase
          .from('revenue_goals')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Fetch Lead Pipeline Data
        const { data: leadsData, error: leadsError } = await supabase
          .from('crm_leads')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (configData) setConfig(configData);
        if (leadsData) setLeads(leadsData);

      } catch (err) {
        console.error("Critical System Error:", err);
        setSystemMessage("SYSTEM ERROR: DATA LINK FAILURE");
      } finally {
        setLoading(false);
      }
    }
    getDashboardData();
  }, [router, supabase]);

  // --- UTILITY FUNCTIONS ---
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate re-fetch
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-12">
        <div className="relative">
          <div className="w-24 h-24 border-2 border-[#00f2ff]/20 rounded-full animate-ping" />
          <div className="absolute inset-0 w-24 h-24 border-t-4 border-[#00f2ff] rounded-full animate-spin" />
          <Zap className="absolute inset-0 m-auto text-[#00f2ff] animate-pulse" size={32} />
        </div>
        <div className="mt-12 text-center">
          <h2 className="text-[#00f2ff] font-black italic uppercase tracking-[0.8em] text-xs mb-2">INITIALIZING OS</h2>
          <div className="w-64 h-1 bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-[#00f2ff] animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
          </div>
          <p className="text-zinc-700 font-bold italic uppercase text-[8px] mt-4 tracking-widest">ENCRYPTED CONNECTION ESTABLISHED...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#020202] text-white selection:bg-[#00f2ff] selection:text-black font-bold italic uppercase">
      
      {/* Sidebar call removed - now provided by DashboardLayout wrapper */}

      {/* 2. MAIN VIEWPORT */}
      <div className="flex-1 relative flex flex-col">
        
        {/* VIRTUAL OVERLAY GRADIENTS */}
        <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[#00f2ff]/5 blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-72 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* --- SECTION: TOP COMMAND HEADER --- */}
        <header className="sticky top-0 z-[100] bg-[#020202]/70 backdrop-blur-2xl border-b border-white/5 p-8 flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#00f2ff]/10 border border-[#00f2ff]/30 rounded-full shadow-[0_0_15px_rgba(0,242,255,0.1)]">
                <div className={`w-2 h-2 rounded-full bg-[#00f2ff] ${isRefreshing ? 'animate-ping' : 'animate-pulse'}`} />
                <span className="text-[#00f2ff] text-[9px] tracking-[0.2em] font-black">{systemMessage}</span>
              </div>
              <span className="text-zinc-700 text-[9px] tracking-[0.3em]">VERSION 2.0.4-R</span>
            </div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none flex items-center gap-4">
              COMMAND <span className="text-[#00f2ff] drop-shadow-[0_0_15px_rgba(0,242,255,0.3)]">CENTER</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden 2xl:flex items-center bg-zinc-900/40 border border-white/5 rounded-2xl p-1.5 gap-1">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-8 py-3 rounded-xl text-[10px] tracking-widest transition-all duration-300 ${activeTab === 'overview' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
              >
                SYSTEM METRICS
              </button>
              <button 
                onClick={() => setActiveTab('pipeline')}
                className={`px-8 py-3 rounded-xl text-[10px] tracking-widest transition-all duration-300 ${activeTab === 'pipeline' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
              >
                LIVE PIPELINE
              </button>
            </div>

            <div className="h-12 w-[1px] bg-white/5 hidden md:block" />

            <button className="relative group">
              <div className="absolute -inset-1 bg-[#00f2ff] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative bg-[#00f2ff] text-black px-12 py-5 rounded-2xl flex items-center gap-4 hover:scale-[1.02] active:scale-95 transition-all">
                <Plus size={22} strokeWidth={4} />
                <span className="text-xs tracking-[0.2em] font-black">INITIALIZE LEAD</span>
              </div>
            </button>
          </div>
        </header>

        {/* --- SECTION: SCROLLABLE CONTENT --- */}
        <div className="p-10 space-y-12 max-w-[1800px] mx-auto w-full">
          
          {/* --- MODULE: PRIMARY STAT ENGINE --- */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            
            {/* STAT CARD 1: 90 DAY TARGET */}
            <div className="bg-zinc-900/20 border border-white/5 p-12 rounded-[3.5rem] relative overflow-hidden group hover:border-[#00f2ff]/30 transition-all duration-500">
              <div className="absolute -right-8 -top-8 text-white opacity-[0.02] group-hover:opacity-[0.05] group-hover:rotate-12 transition-all duration-700">
                <Target size={220} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <p className="text-zinc-500 text-[11px] tracking-[0.5em] italic">REVENUE MILESTONE</p>
                  <div className="p-2 bg-white/5 rounded-xl text-green-500"><TrendingUp size={16} /></div>
                </div>
                <h3 className="text-6xl font-black italic tracking-tighter mb-4 text-white">
                  ${config?.target_milestone?.toLocaleString() || "0"}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[65%]" />
                  </div>
                  <span className="text-[10px] text-green-500 font-black">65%</span>
                </div>
              </div>
            </div>

            {/* STAT CARD 2: LEAD COUNT */}
            <div className="bg-zinc-900/20 border border-white/5 p-12 rounded-[3.5rem] relative overflow-hidden group hover:border-[#00f2ff]/30 transition-all duration-500">
              <div className="absolute -right-8 -top-8 text-[#00f2ff] opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-700">
                <Users size={220} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <p className="text-zinc-500 text-[11px] tracking-[0.5em] italic mb-6">OPERATIONAL LEADS</p>
                <h3 className="text-6xl font-black italic tracking-tighter mb-4 text-[#00f2ff]">
                  {leads.length}
                </h3>
                <p className="text-zinc-600 text-[10px] tracking-[0.3em] font-black uppercase italic">Active High-Value Entities</p>
              </div>
            </div>

            {/* STAT CARD 3: LEAD VELOCITY */}
            <div className="bg-zinc-900/20 border border-white/5 p-12 rounded-[3.5rem] relative overflow-hidden group hover:border-orange-500/30 transition-all duration-500">
              <div className="absolute -right-8 -top-8 text-orange-500 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-700">
                <Flame size={220} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <p className="text-zinc-500 text-[11px] tracking-[0.5em] italic mb-6">SYSTEM VELOCITY</p>
                <h3 className="text-6xl font-black italic tracking-tighter mb-4 text-white">
                  +12
                </h3>
                <div className="flex items-center gap-2 text-orange-500">
                  <span className="text-[10px] font-black tracking-widest italic uppercase">New Inbound (7D)</span>
                </div>
              </div>
            </div>

            {/* STAT CARD 4: PILLAR STRENGTH */}
            <div className="bg-zinc-900/20 border border-white/5 p-12 rounded-[3.5rem] relative overflow-hidden group hover:border-[#00f2ff]/30 transition-all duration-500">
              <div className="absolute -right-8 -top-8 text-[#00f2ff] opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-700">
                <Cpu size={220} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <p className="text-zinc-500 text-[11px] tracking-[0.5em] italic mb-6">ACTIVE PILLARS</p>
                <h3 className="text-6xl font-black italic tracking-tighter mb-4 text-white">
                  {config?.revenue_pillars?.length || "0"}
                </h3>
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full ${i < (config?.revenue_pillars?.length || 0) ? 'bg-[#00f2ff]' : 'bg-zinc-800'}`} />
                  ))}
                </div>
              </div>
            </div>

          </section>

          {/* --- MODULE: DUAL-GRID EXECUTION LAYER --- */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            
            {/* LEFT SIDE: MASTER PIPELINE (8 COLUMNS) */}
            <div className="xl:col-span-8 bg-zinc-900/10 border border-white/5 rounded-[4.5rem] p-14 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                <Database size={300} />
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 relative z-10">
                <div>
                  <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4 flex items-center gap-4">
                    LIVE <span className="text-[#00f2ff]">PIPELINE</span>
                  </h2>
                  <p className="text-zinc-600 text-[11px] tracking-[0.5em] italic">REAL-TIME CONVERSION DATABASE</p>
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input 
                      type="text" 
                      placeholder="FILTER ENTITIES..."
                      className="bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-[10px] tracking-widest outline-none focus:border-[#00f2ff]/50 transition-all w-64"
                    />
                  </div>
                  <button className="bg-zinc-900 border border-white/5 p-4 rounded-2xl hover:text-[#00f2ff] transition-all">
                    <Filter size={20} />
                  </button>
                </div>
              </div>

              {/* PIPELINE LIST */}
              <div className="space-y-6 relative z-10">
                {leads.length > 0 ? leads.map((lead, idx) => (
                  <div 
                    key={lead.id} 
                    className="flex flex-col md:flex-row items-center justify-between p-10 bg-black/40 border border-white/5 rounded-[3rem] hover:border-[#00f2ff]/30 hover:bg-black/60 transition-all group"
                  >
                    <div className="flex items-center gap-8 mb-6 md:mb-0 w-full md:w-auto">
                      <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 flex items-center justify-center font-black italic text-2xl text-zinc-600 group-hover:bg-[#00f2ff] group-hover:text-black transition-all duration-500 group-hover:rotate-6 shadow-xl">
                        {lead.full_name?.charAt(0) || 'L'}
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-2xl font-black italic uppercase tracking-tight mb-2 group-hover:text-[#00f2ff] transition-colors">{lead.full_name || "UNIDENTIFIED"}</h4>
                        <div className="flex items-center gap-4">
                          <span className="text-[9px] text-zinc-600 tracking-[0.3em]">{new Date(lead.created_at).toLocaleDateString()}</span>
                          <div className="h-1 w-1 rounded-full bg-zinc-800" />
                          <span className="text-[9px] text-[#00f2ff] tracking-[0.3em] font-black">DISCOVERY PHASE</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <p className="text-3xl font-black italic text-white mb-2 tracking-tighter group-hover:scale-110 transition-transform">${lead.deal_value?.toLocaleString() || "0.00"}</p>
                        <div className="flex items-center justify-end gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[10px] text-zinc-500 tracking-widest italic">ACTIVE SESSION</span>
                        </div>
                      </div>
                      <button className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5 text-zinc-600 group-hover:text-white group-hover:border-[#00f2ff]/50 transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[4rem] opacity-20">
                    <Briefcase size={64} className="mx-auto mb-8 text-zinc-800" />
                    <p className="text-xs tracking-[0.6em] font-black italic">PIPELINE DATA ENCRYPTED / EMPTY</p>
                  </div>
                )}
              </div>

              {/* PILLAR BREAKDOWN SECTION (Integrated into Left Column) */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-10 bg-[#00f2ff]/5 border border-[#00f2ff]/10 rounded-[3.5rem]">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-[#00f2ff] text-black rounded-2xl flex items-center justify-center shadow-lg"><Layers size={24} strokeWidth={3} /></div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">CORE PILLARS</h3>
                  </div>
                  <div className="space-y-4">
                    {config?.revenue_pillars?.map((p: string, i: number) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-black/40 border border-white/5 rounded-2xl group hover:border-[#00f2ff]/30 transition-all">
                        <span className="text-xs tracking-widest">{p}</span>
                        <ArrowUpRight size={16} className="text-zinc-800 group-hover:text-[#00f2ff]" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-10 bg-zinc-900/20 border border-white/5 rounded-[3.5rem] flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6"><Activity size={32} className="text-zinc-600" /></div>
                  <h4 className="text-xl font-black italic tracking-tighter text-zinc-500 mb-2 uppercase">System Health Audit</h4>
                  <p className="text-[9px] text-zinc-700 tracking-[0.4em]">AWAITING QUARTERLY METRICS</p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: EXECUTION & STATUS (4 COLUMNS) */}
            <div className="xl:col-span-4 space-y-10">
              
              {/* ACTION CENTER / MINI CALENDAR */}
              <div className="bg-zinc-900/10 border border-white/5 rounded-[4.5rem] p-12 backdrop-blur-md">
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-4">
                    NEXT <span className="text-[#00f2ff]">ACTIONS</span>
                  </h3>
                  <CalendarIcon size={24} className="text-zinc-700" />
                </div>

                <div className="space-y-10">
                  {/* Task 1 */}
                  <div className="flex gap-6 relative group cursor-pointer">
                    <div className="flex flex-col items-center relative">
                      <div className="w-4 h-4 rounded-full bg-[#00f2ff] shadow-[0_0_15px_#00f2ff] z-10" />
                      <div className="w-[2px] h-full bg-zinc-800 absolute top-4 rounded-full" />
                    </div>
                    <div className="pb-10 border-b border-white/5 flex-1">
                      <p className="text-[#00f2ff] text-[10px] tracking-[0.3em] italic mb-2">14:00 - HIGH STAKES EXECUTION</p>
                      <h4 className="text-lg font-black italic uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">APEX SOLUTIONS PROPOSAL</h4>
                      <p className="text-zinc-600 text-[10px] italic mt-2">Value Assessment: $12k Projected</p>
                    </div>
                  </div>

                  {/* Task 2 */}
                  <div className="flex gap-6 relative group cursor-pointer">
                    <div className="flex flex-col items-center relative">
                      <div className="w-4 h-4 rounded-full bg-zinc-800 z-10 group-hover:bg-blue-500 transition-colors" />
                      <div className="w-[2px] h-full bg-zinc-800 absolute top-4 rounded-full" />
                    </div>
                    <div className="pb-10 border-b border-white/5 flex-1">
                      <p className="text-zinc-600 text-[10px] tracking-[0.3em] italic mb-2 group-hover:text-blue-500 transition-colors">16:30 - OPERATIONS AUDIT</p>
                      <h4 className="text-lg font-black italic uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">REVIEW Q1 RETENTION</h4>
                    </div>
                  </div>

                  {/* Task 3 (Completed) */}
                  <div className="flex gap-6 relative group cursor-pointer opacity-30">
                    <div className="flex flex-col items-center relative">
                      <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] z-10" />
                    </div>
                    <div className="flex-1">
                      <p className="text-zinc-500 text-[10px] tracking-[0.3em] italic mb-2 uppercase">COMPLETED MISSION</p>
                      <h4 className="text-lg font-black italic uppercase tracking-tight line-through">DRAFT CONTENT BATCH A</h4>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-10 py-5 bg-zinc-900 border border-white/5 rounded-3xl text-[10px] tracking-[0.4em] font-black italic hover:border-[#00f2ff]/50 transition-all hover:text-[#00f2ff]">
                  EXPAND MASTER CALENDAR
                </button>
              </div>

              {/* SYSTEM HEALTH CARDS */}
              <div className="space-y-6">
                {/* Security Status */}
                <div className="p-8 bg-zinc-900/10 border border-white/5 rounded-[3rem] flex items-center justify-between group hover:bg-[#00f2ff]/5 transition-all cursor-crosshair">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-zinc-900/50 rounded-2xl group-hover:text-[#00f2ff] transition-all"><ShieldCheck size={24} /></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-600 tracking-[0.3em]">SECURITY</span>
                      <span className="text-xs font-black italic text-zinc-400 group-hover:text-white">ENCRYPTION: TIER 1</span>
                    </div>
                  </div>
                  <Lock size={18} className="text-zinc-800 group-hover:text-green-500 transition-all" />
                </div>

                {/* Node Status */}
                <div className="p-8 bg-zinc-900/10 border border-white/5 rounded-[3rem] flex items-center justify-between group hover:bg-blue-500/5 transition-all cursor-crosshair">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-zinc-900/50 rounded-2xl group-hover:text-blue-500 transition-all"><Terminal size={24} /></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-600 tracking-[0.3em]">SYSTEM NODE</span>
                      <span className="text-xs font-black italic text-zinc-400 group-hover:text-white">NORTHERN-VA.R4</span>
                    </div>
                  </div>
                  <Globe size={18} className="text-zinc-800 group-hover:text-blue-500 transition-all" />
                </div>

                {/* Operator Verification (The Cyan Card) */}
                <div className="relative group cursor-pointer overflow-hidden rounded-[3rem]">
                  <div className="absolute inset-0 bg-[#00f2ff] group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative p-10 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-black/10 rounded-2xl text-black"><Fingerprint size={32} strokeWidth={3} /></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-black/60 tracking-[0.3em] font-black">IDENTITY VERIFIED</span>
                        <span className="text-lg font-black italic text-black leading-none uppercase tracking-tighter">OPERATOR AUTHORIZED</span>
                      </div>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-black animate-ping" />
                  </div>
                </div>
              </div>

              {/* REVENUE STATUS BAR */}
              <div className="p-10 bg-zinc-900/10 border border-white/5 rounded-[4rem] backdrop-blur-md">
                 <div className="flex justify-between items-center mb-6">
                    <h5 className="text-[11px] tracking-[0.4em] text-zinc-500">QUARTERLY VOLUME</h5>
                    <BarChart3 size={18} className="text-zinc-800" />
                 </div>
                 <div className="h-20 flex items-end gap-2 mb-6">
                    {[30, 45, 25, 60, 80, 50, 90, 40, 70, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-zinc-800 hover:bg-[#00f2ff] transition-all rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                 </div>
                 <div className="flex justify-between items-center border-t border-white/5 pt-6">
                    <p className="text-xl font-black italic tracking-tighter text-white">ELITE STATUS</p>
                    <div className="flex -space-x-3">
                       {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-900" />)}
                    </div>
                 </div>
              </div>
            </div>
          </section>

          {/* --- SECTION: SYSTEM FOOTER READOUT --- */}
          <footer className="pt-20 pb-10 flex flex-col items-center border-t border-white/5 text-center gap-6">
             <div className="flex gap-12 text-zinc-800 text-[9px] tracking-[1em] font-black italic uppercase">
                <span>ENCRYPTION // RSA-4096</span>
                <span>LATENCY // 14MS</span>
                <span>RUNTIME // 99.9%</span>
             </div>
             <p className="text-zinc-900 text-[10px] tracking-[0.5em] font-black italic leading-loose">
                FULLPRENEUR OPERATING SYSTEM // AUTHORIZED ACCESS ONLY // UNAUTHORIZED ATTEMPTS WILL BE LOGGED <br/>
                PROPRIETARY ARCHITECTURE COPYRIGHT 2026 // NEURAL-LINK CONNECTED
             </p>
             <div className="flex gap-4">
                <div className="w-1 h-1 rounded-full bg-zinc-900" />
                <div className="w-1 h-1 rounded-full bg-zinc-900" />
                <div className="w-1 h-1 rounded-full bg-zinc-900" />
             </div>
          </footer>

        </div>
      </div>
    </div>
  );
}