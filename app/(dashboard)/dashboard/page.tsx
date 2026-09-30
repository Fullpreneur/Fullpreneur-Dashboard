"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from '@/lib/supabase/client';
import { asQuizResponses, focusForArea, profilePayload, rankAreas, responsesFromStorage, scoreQuiz } from '@/lib/quiz/profile';
import {
  EMPTY_FOCUS_COPY,
  emptyOpportunity,
  flywheelFromOpportunities,
  flywheelFromStreams,
  FlywheelRow,
  mergeOpportunities,
  opportunitiesFromQuiz,
  UserOpportunity,
} from '@/lib/opportunities';
import { 
  Calendar, Zap, Target, ChevronRight, Play, StopCircle,
  ShieldCheck, ArrowUpRight, Star
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
  const [quizProfile, setQuizProfile] = useState<{
    responses: Record<string, any>;
    scores: ReturnType<typeof scoreQuiz>;
    lowest: ReturnType<typeof rankAreas>;
  } | null>(null);
  const [operator, setOperator] = useState<{ id: string; email: string | null } | null>(null);
  const [hasPendingAudit, setHasPendingAudit] = useState(false);
  const [opportunities, setOpportunities] = useState<UserOpportunity[]>([]);
  const [flywheel, setFlywheel] = useState<FlywheelRow[]>([]);

  // --- SYSTEM CLOCK ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- CONSOLIDATED DATA SYNC ---
  useEffect(() => {
    const syncSystemData = async () => {
      setQuizProfile(null);
      setCrmStats({ fulfillment: 0, capacity: 0, totalLeads: 0, pipelineValue: 0 });
      setHasPendingAudit(false);
      setOpportunities([]);
      setFlywheel([]);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setOperator({ id: user.id, email: user.email ?? null });

        // Fetch both Appointments (Fulfillment/Capacity) and Leads (Revenue)
        const [apptsRes, crmRes, leadsRes, oppRes, streamRes] = await Promise.all([
          supabase.from('appointments').select('pillar').eq('user_id', user.id),
          supabase.from('crm_leads').select('deal_value, pillar_tag').eq('user_id', user.id),
          supabase.from('leads').select('value, deal_value').eq('user_id', user.id),
          supabase.from('opportunities').select('id, name, status, notes, current_revenue, target_revenue').eq('user_id', user.id),
          supabase.from('revenue_streams').select('stream_name, current_revenue, target_revenue').eq('user_id', user.id)
        ]);

        let calculatedFulfillment = 0;
        let calculatedCapacity = 0;
        let totalRevenue = 0;

        // Process Appointments for Fulfillment Score
        if (apptsRes.data && apptsRes.data.length > 0) {
          const total = apptsRes.data.length;
          const personalItems = apptsRes.data.filter(a => a.pillar === 'Personal').length;
          calculatedFulfillment = Math.round((personalItems / total) * 100);
        }

        // Process Leads for Revenue Target
        if (crmRes.data) {
          totalRevenue += crmRes.data.reduce((acc, curr) => acc + (Number(curr.deal_value) || 0), 0);
        }
        if (leadsRes.data) {
          totalRevenue += leadsRes.data.reduce((acc, curr) => acc + (Number(curr.deal_value ?? curr.value) || 0), 0);
        }

        let pendingLeft = false;
        try {
          const pending = localStorage.getItem('pending_audit_submission');
          if (pending) {
            const pendingResponses = responsesFromStorage(JSON.parse(pending));
            const { error: pendingError } = await supabase.from('profiles').upsert(
              profilePayload(user.id, user.email ?? null, pendingResponses),
              { onConflict: 'user_id' }
            );
            if (!pendingError) {
              localStorage.removeItem('pending_audit_submission');
              localStorage.removeItem('questionnaire_progress');
              localStorage.setItem('questionnaire_submitted', 'true');
            } else {
              pendingLeft = true;
              console.error("QUIZ_SYNC_ERROR", pendingError);
            }
          }
        } catch (pendingErr) {
          pendingLeft = true;
          console.error("QUIZ_SYNC_ERROR", pendingErr);
        }
        setHasPendingAudit(pendingLeft);

        const profileRes = await supabase
          .from('profiles')
          .select('quiz_responses')
          .eq('user_id', user.id)
          .maybeSingle();

        const quizResponses = asQuizResponses(profileRes.data?.quiz_responses);
        const hasQuiz = !profileRes.error && quizResponses && Object.keys(quizResponses).length > 0;
        if (hasQuiz && quizResponses) {
          const scores = scoreQuiz(quizResponses);
          setQuizProfile({
            responses: quizResponses,
            scores,
            lowest: rankAreas(scores).slice(0, 3),
          });
        } else {
          setQuizProfile(null);
        }

        const accountOpportunities = mergeOpportunities(
          oppRes.error ? [] : oppRes.data,
          opportunitiesFromQuiz(hasQuiz ? quizResponses : null)
        );
        const accountFlywheel = flywheelFromStreams(streamRes.error ? [] : streamRes.data);
        setOpportunities(accountOpportunities);
        setFlywheel(accountFlywheel.length ? accountFlywheel : flywheelFromOpportunities(accountOpportunities));

        setCrmStats({
          fulfillment: calculatedFulfillment,
          capacity: calculatedCapacity,
          totalLeads: (crmRes.data?.length || 0) + (leadsRes.data?.length || 0),
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

  const primaryFocus = quizProfile?.lowest[0];
  const focus = primaryFocus && quizProfile ? focusForArea(primaryFocus.id, quizProfile.responses) : null;
  const live = focus ?? {
    task: "Review your audit",
    stream: "SYSTEMS",
    path: "/quiz",
    next: "Open the audit to refresh this command center",
  };
  const fulfillmentPct = quizProfile ? Math.round(quizProfile.scores.fulfillment * 10) : 0;
  const capacityPct = quizProfile ? Math.round((10 - quizProfile.scores.capacity) * 10) : 0;
  const revenueTarget = quizProfile ? parseFloat(String(quizProfile.responses.q4 ?? "").replace(/[$,]/g, "")) : 0;
  const revenueWidth = revenueTarget > 0 ? Math.min((crmStats.pipelineValue / revenueTarget) * 100, 100) : 0;
  const lowestIds = new Set(quizProfile?.lowest.map((area) => area.id) ?? []);
  const opportunityCards = opportunities.length ? opportunities : [emptyOpportunity()];
  const flywheelRows = flywheel.length
    ? flywheel
    : [{ name: "Complete diagnostic to auto-populate", current: 0, target: 0 }];
  const focusLabel = primaryFocus?.label ?? EMPTY_FOCUS_COPY;
  const milestones = quizProfile
    ? [
        ...quizProfile.lowest.map((area) => ({
          l: area.label,
          v: focusForArea(area.id, quizProfile.responses).task,
          target: `${area.score}/10`,
        })),
        {
          l: "Start",
          v: quizProfile.responses.q47 || "This week",
          target: "Committed",
        },
      ]
    : [];

  if (loading) return <div className="h-screen bg-black flex items-center justify-center"><Zap className="text-[#00f2ff] animate-pulse" /></div>;

  if (!quizProfile) {
    return (
      <div className="p-4 sm:p-6 md:p-10 bg-[#050505] min-h-full w-full min-w-0 overflow-x-hidden text-white font-sans">
        <div className="max-w-3xl w-full min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00f2ff]">Account {operator?.id ?? "unsigned"}</p>
          <h1 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none break-words">
            CONTROL <span className="text-zinc-800">CENTER</span>
          </h1>
          <p className="mt-6 text-zinc-400 font-bold italic uppercase text-sm sm:text-base leading-relaxed max-w-xl">
            No audit is saved for this account yet. This space stays empty until your own results are on file.
          </p>
          {hasPendingAudit && (
            <p className="mt-4 text-[#facc15] font-bold italic text-sm max-w-xl">
              An audit is still saved on this device. Open it and retry the save. Nothing was discarded.
            </p>
          )}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="w-full min-w-0 bg-zinc-900/40 border border-zinc-800 p-5 rounded-[2rem]">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Revenue</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black truncate">$0</p>
            </div>
            <div className="w-full min-w-0 bg-zinc-900/40 border border-zinc-800 p-5 rounded-[2rem]">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Lead pipeline</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black truncate">0</p>
            </div>
            <div className="w-full min-w-0 bg-zinc-900/40 border border-zinc-800 p-5 rounded-[2rem]">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Primary Focus</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-[#00f2ff] truncate">{EMPTY_FOCUS_COPY}</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunityCards.map((card) => (
              <Link key={card.id} href={card.href} className="w-full min-w-0 bg-zinc-900/30 border border-zinc-800 p-6 rounded-[2rem]">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{card.status}</p>
                <h2 className="mt-3 text-2xl font-black italic uppercase break-words">{card.name}</h2>
                <p className="mt-2 text-sm text-zinc-400 font-bold italic break-words">{card.detail}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 bg-zinc-900/20 border border-zinc-800 p-6 rounded-[2rem]">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Revenue Flywheel</p>
            <div className="mt-4 space-y-3">
              {flywheelRows.map((row) => (
                <div key={row.name} className="flex items-center justify-between gap-4">
                  <p className="font-black italic uppercase break-words">{row.name}</p>
                  <p className="font-black shrink-0">${row.current.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <Link href="/quiz" className="inline-flex items-center justify-center px-8 py-5 bg-[#00f2ff] text-black rounded-2xl font-black uppercase text-[11px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em]">
              Take the Diagnostic Audit
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-8 bg-[#050505] min-h-full w-full min-w-0 overflow-x-hidden text-white font-sans uppercase italic selection:bg-[#00f2ff]/30">
      
      {/* 1. HEADER & KPI ROW */}
      <header className="flex flex-col xl:flex-row justify-between items-start gap-8 w-full min-w-0">
        <div className="w-full min-w-0">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-none break-words">
            CONTROL <span className="text-zinc-800">CENTER</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-4">
             <div className="bg-[#00f2ff]/10 px-3 py-1 rounded border border-[#00f2ff]/20 max-w-full min-w-0">
               <p className="text-[#00f2ff] font-black tracking-[0.15em] sm:tracking-[0.4em] text-[9px] uppercase break-words">Primary Focus: {focusLabel}</p>
             </div>
             <p className="text-zinc-600 font-bold text-[9px] uppercase">OS_VER_4.0.1</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full min-w-0 lg:max-w-6xl">
          {/* FULFILLMENT */}
          <div className={`w-full min-w-0 bg-purple-900/10 border border-purple-500/20 p-5 rounded-[2rem] hover:border-purple-500/50 transition-all ${lowestIds.has("fulfillment") ? "ring-1 ring-purple-400" : ""}`}>
             <div className="flex items-center gap-2 mb-2">
               <Star className="text-purple-400 w-3 h-3 fill-current" />
               <p className="text-[9px] font-black text-purple-400 tracking-widest uppercase">Fulfillment</p>
             </div>
             <p className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter truncate">{fulfillmentPct}%</p>
             <div className="w-full bg-zinc-800 h-1 rounded-full mt-3 overflow-hidden">
               <div className="bg-purple-500 h-full transition-all duration-1000" style={{ width: `${fulfillmentPct}%` }} />
             </div>
             {quizProfile && <p className="text-[9px] text-zinc-600 font-bold uppercase mt-2">Audit satisfaction</p>}
          </div>

          {/* REVENUE */}
          <div className={`w-full min-w-0 bg-zinc-900/40 border border-zinc-800 p-5 rounded-[2rem] hover:border-[#22c55e]/50 transition-all ${lowestIds.has("revenue") ? "ring-1 ring-[#facc15]" : ""}`}>
             <p className="text-[9px] font-black text-zinc-500 tracking-widest mb-1">Pipeline Value</p>
             <p className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter text-white truncate">${crmStats.pipelineValue.toLocaleString()}</p>
             <div className="w-full bg-zinc-800 h-1 rounded-full mt-3 overflow-hidden">
               <div className="bg-[#22c55e] h-full" style={{ width: `${revenueWidth}%` }} />
             </div>
             {quizProfile && lowestIds.has("revenue") && (
               <p className="text-[9px] font-black text-[#facc15] uppercase mt-2">18-mo target {quizProfile.responses.q4 || "unset"}</p>
             )}
          </div>

          {/* SYSTEM STATUS */}
          <div className={`w-full min-w-0 bg-zinc-900/40 border p-5 rounded-[2rem] transition-all ${primaryFocus ? "border-[#facc15]/50" : "border-zinc-800 hover:border-[#00f2ff]/50"}`}>
             <p className="text-[9px] font-black text-zinc-500 tracking-widest mb-1 uppercase">System Status</p>
             <p className={`text-xl sm:text-2xl lg:text-3xl font-black truncate ${primaryFocus ? "text-[#facc15]" : "text-[#00f2ff]"}`}>{focusLabel}</p>
             <p className="text-[9px] text-zinc-600 font-bold uppercase mt-2">{primaryFocus ? `${primaryFocus.score}/10 · lowest area` : EMPTY_FOCUS_COPY}</p>
          </div>

          {/* CAPACITY */}
          <div className={`w-full min-w-0 bg-zinc-900/40 border border-zinc-800 p-5 rounded-[2rem] hover:border-[#facc15]/50 transition-all ${lowestIds.has("capacity") ? "ring-1 ring-[#facc15]" : ""}`}>
             <p className="text-[9px] font-black text-zinc-500 tracking-widest mb-1 uppercase">Capacity</p>
             <p className="text-xl sm:text-2xl lg:text-3xl font-black text-white truncate">{capacityPct}%</p>
             <div className="w-full bg-zinc-800 h-1 rounded-full mt-3 overflow-hidden">
               <div className={`h-full transition-all duration-1000 ${capacityPct > 90 ? 'bg-red-500' : 'bg-[#facc15]'}`} style={{ width: `${capacityPct}%` }} />
             </div>
             {quizProfile && <p className="text-[9px] text-zinc-600 font-bold uppercase mt-2">Hour pressure</p>}
          </div>
        </div>
      </header>

      {/* 2. LIVE ACTION HUB (CENTRAL FOCUS) */}
      
      <section className={`w-full min-w-0 transition-all duration-700 border p-6 sm:p-8 md:p-12 rounded-[3rem] relative overflow-hidden group shadow-2xl ${isSessionActive ? 'bg-[#00f2ff]/5 border-[#00f2ff]' : 'bg-zinc-900/20 border-zinc-800'}`}>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-10 text-center lg:text-left">
          <div className="space-y-6 w-full min-w-0">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className={`w-3 h-3 rounded-full ${isSessionActive ? 'bg-[#00f2ff] animate-ping' : 'bg-red-600 animate-pulse'}`} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.5em] text-zinc-500 break-words">
                {isSessionActive ? 'ACTIVE FOCUS SESSION' : 'LIVE OPERATIONAL STREAM'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[#00f2ff] text-xs font-black uppercase tracking-[0.2em]">{live.stream} — AUDIT PRIORITY</p>
              <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-tight uppercase italic break-words">{live.task}</h2>
              <p className="text-zinc-500 text-sm md:text-lg italic font-bold max-w-3xl border-l-4 border-zinc-800 pl-6 mx-auto lg:mx-0 break-words">Coming up: {live.next}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center lg:items-end gap-6 w-full min-w-0 lg:max-w-sm">
            <div className="bg-black/80 p-6 rounded-[2rem] border border-zinc-800 text-center w-full min-w-0">
              <p className="text-[9px] font-black text-zinc-600 uppercase mb-2 tracking-widest">Timestamp</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter text-white tabular-nums truncate">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full min-w-0">
        {opportunityCards.map((card) => (
          <Link key={card.id} href={card.href} className="w-full min-w-0 bg-zinc-900/30 border border-zinc-800 p-6 sm:p-8 rounded-[2.5rem] hover:border-zinc-500 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-black rounded-xl border border-zinc-800 group-hover:border-zinc-700">
                <Target className="w-6 h-6 text-[#00f2ff]" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#00f2ff]">{card.status}</p>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black italic uppercase tracking-tighter mb-2 break-words">{card.name}</h3>
            <p className="text-[10px] text-zinc-500 font-bold italic mb-6 border-l-2 border-zinc-800 pl-4 break-words">{card.detail}</p>
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-[9px] text-zinc-600 font-black uppercase">Open</span>
              <ChevronRight size={14} className="text-zinc-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      <section className="w-full min-w-0 bg-zinc-900/20 border border-zinc-800 p-6 sm:p-8 rounded-[2.5rem]">
        <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-6">Revenue Flywheel</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flywheelRows.map((row) => (
            <div key={row.name} className="min-w-0 bg-black/40 border border-zinc-800 p-5 rounded-[2rem]">
              <p className="text-sm font-black italic uppercase break-words">{row.name}</p>
              <p className="mt-3 text-2xl font-black">${row.current.toLocaleString()}</p>
              <p className="text-[9px] font-black text-zinc-500 uppercase mt-1">Target ${row.target.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. STRATEGIC MILESTONES FOOTER */}
      <footer className="w-full min-w-0 bg-zinc-900/10 border border-zinc-800 p-6 sm:p-8 md:p-12 rounded-[3rem] grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
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
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {milestones.map((m, i) => (
               <div key={i} className="min-w-0">
                 <p className="text-[9px] font-black text-zinc-700 uppercase italic mb-1 break-words">{m.l}</p>
                 <p className="text-sm font-black italic uppercase text-zinc-300 break-words">{m.v}</p>
                 <p className="text-[9px] font-black text-[#00f2ff] uppercase italic">{m.target}</p>
               </div>
             ))}
           </div>
        </div>
      </footer>
    </div>
  );
}