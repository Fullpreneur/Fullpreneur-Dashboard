"use client";
import { useState, useEffect } from "react";
import { 
  Cpu, Target, Rocket, BarChart3, Users, Clock, 
  CheckCircle2, Circle, Globe, Share2, DollarSign, 
  Zap, Flag, Layers, Briefcase, Calendar, Trophy, 
  ShieldCheck, FileText, Lock, ChevronRight, AlertCircle,
  TrendingUp, Star, Network, Lightbulb, ClipboardCheck
} from "lucide-react";

// --- TYPES ---
interface Prospect {
  id: number;
  name: string;
  status: string;
  value: number;
  type: string;
}

interface ExitDoc {
  id: number;
  label: string;
  status: "Secure" | "Draft" | "Pending" | "Critical";
  category: string;
}

export default function AlliOTracker() {
  const [activeTab, setActiveTab] = useState("roadmap");
  const [isMounted, setIsMounted] = useState(false);

  // Persistence State
  const [prospects, setProspects] = useState<Prospect[]>([
    { id: 1, name: "Dominion Raceway", status: "Pilot/Beta", value: 0, type: "Pilot Customer" },
    { id: 2, name: "Regional Track A", status: "Contacted", value: 299, type: "Beta Prospect" },
    { id: 3, name: "Local Drift Facility", status: "Nurturing", value: 499, type: "New Lead" }
  ]);

  const [exitDocs, setExitDocs] = useState<ExitDoc[]>([
    { id: 1, label: "Codebase IP Ownership", status: "Secure", category: "Legal" },
    { id: 2, label: "Customer Master Agreement", status: "Draft", category: "Legal" },
    { id: 3, label: "Financial P&L Ledger", status: "Pending", category: "Finance" },
    { id: 4, label: "Tech Stack Documentation", status: "Pending", category: "Technical" }
  ]);

  useEffect(() => {
    const savedProspects = localStorage.getItem("allio_pipeline_vFINAL");
    if (savedProspects) setProspects(JSON.parse(savedProspects));
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("allio_pipeline_vFINAL", JSON.stringify(prospects));
    }
  }, [prospects, isMounted]);

  if (!isMounted) return <div className="bg-black min-h-screen" />;

  return (
    <div className="p-10 space-y-8 bg-black min-h-screen text-white font-sans">
      {/* ----------------- HEADER ----------------- */}
      <header className="flex justify-between items-end border-b border-zinc-800 pb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#3b82f6]/20 p-2 rounded-lg border border-[#3b82f6]/30">
              <Cpu className="text-[#3b82f6] w-5 h-5" />
            </div>
            <p className="text-[#3b82f6] font-black tracking-[0.4em] text-[10px] uppercase italic bg-[#3b82f6]/5 px-3 py-1 rounded">
              SaaS Development Asset
            </p>
          </div>
          <h1 className="text-8xl font-black tracking-tighter uppercase italic text-white leading-none">
            Alli<span className="text-zinc-700">O</span>
          </h1>
          <div className="flex items-center gap-4 mt-6">
            <p className="text-zinc-500 text-xs font-bold italic max-w-md leading-relaxed">
              Proprietary Facility Management & Event Operations ecosystem designed for high-exit motorsports acquisition.
            </p>
          </div>
        </div>
        
        <div className="flex gap-6">
          <div className="bg-zinc-900/40 p-6 rounded-[2.5rem] border border-zinc-800 flex items-center gap-6 shadow-2xl">
            <div className="text-right">
              <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mb-1">Target Monthly Revenue</p>
              <p className="text-3xl font-black text-[#22c55e] italic tracking-tighter uppercase">
                $3,000<span className="text-[10px] text-zinc-500 ml-1">USD/MO</span>
              </p>
            </div>
            <div className="bg-[#22c55e]/20 p-4 rounded-2xl border border-[#22c55e]/30">
              <BarChart3 className="w-6 h-6 text-[#22c55e]" />
            </div>
          </div>
        </div>
      </header>

      {/* ----------------- NAVIGATION ----------------- */}
      <nav className="flex gap-4 border-b border-zinc-900 pb-8 overflow-x-auto no-scrollbar">
        {[
          { id: "roadmap", label: "8-Week Roadmap", icon: Flag, color: "#3b82f6" },
          { id: "mvp", label: "MVP Architecture", icon: Layers, color: "#3b82f6" },
          { id: "sales", label: "Sales & Beta Pipeline", icon: Target, color: "#3b82f6" },
          { id: "branding", label: "Build In Public", icon: Share2, color: "#3b82f6" },
          { id: "exit", label: "Exit Readiness", icon: Lock, color: "#facc15" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === tab.id 
                ? "bg-white text-black shadow-[0_20px_50px_rgba(255,255,255,0.1)] scale-105" 
                : "bg-zinc-950 text-zinc-600 border border-zinc-900 hover:border-zinc-700 hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ----------------- 1. ROADMAP ----------------- */}
      {activeTab === "roadmap" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in duration-500">
          {/* Phase 1 */}
          <section className="bg-zinc-900/30 border border-zinc-800 p-12 rounded-[4rem] relative overflow-hidden group hover:bg-zinc-900/50 transition-all">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
              <Clock className="w-48 h-48" />
            </div>
            <div className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-8">
              <div>
                <h3 className="text-4xl font-black italic uppercase text-white tracking-tighter">Weeks 1-4</h3>
                <p className="text-[#3b82f6] text-[10px] font-black uppercase tracking-[0.3em] mt-2">The Development Sprint</p>
              </div>
              <div className="bg-black/60 px-6 py-3 rounded-2xl border border-zinc-800 text-[10px] font-black text-zinc-400 italic">
                EST: 10-12 HRS / WK
              </div>
            </div>
            <div className="space-y-6">
              {[
                "Define MVP feature set (Dominion Ops specs)",
                "Build Event Scheduling completely (Core Logic)",
                "Build Ticketing/Registration completely",
                "Automate Compliance Reporting workflows",
                "Secure 2-3 Beta customers (90 days free)",
                "Weekly &apos;Building in Public&apos; LinkedIn updates"
              ].map((goal, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-black/40 rounded-[2rem] border border-zinc-800/50 group/item hover:border-[#3b82f6]/50 transition-all">
                  <div className="bg-[#3b82f6]/10 p-2 rounded-lg group-hover/item:bg-[#3b82f6] transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-[#3b82f6] group-hover/item:text-black" />
                  </div>
                  <p className="text-sm font-black text-zinc-300 italic uppercase tracking-tight">{goal}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Phase 2 */}
          <section className="bg-[#22c55e]/5 border border-[#22c55e]/20 p-12 rounded-[4rem] relative overflow-hidden group hover:bg-[#22c55e]/10 transition-all">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap className="w-48 h-48" />
            </div>
            <div className="flex justify-between items-center mb-12 border-b border-[#22c55e]/10 pb-8">
              <div>
                <h3 className="text-4xl font-black italic uppercase text-white tracking-tighter">Week 5+</h3>
                <p className="text-[#22c55e] text-[10px] font-black uppercase tracking-[0.3em] mt-2">The Paid Launch</p>
              </div>
              <div className="bg-[#22c55e]/10 px-6 py-3 rounded-2xl border border-[#22c55e]/20 text-[10px] font-black text-[#22c55e] italic uppercase">
                Revenue Phase
              </div>
            </div>
            <div className="space-y-6">
              {[
                "Launch Paid Version @ $299-499/month",
                "Convert beta users to paying tier",
                "Sign 2-3 NEW paying customers (Direct Outreach)",
                "Target: 4-6 Paying Customers Total",
                "Implement Customer Success/Onboarding flow",
                "Begin building venue referral rewards"
              ].map((goal, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-black/40 rounded-[2rem] border border-zinc-800/50 group/item hover:border-[#22c55e]/50 transition-all">
                   <div className="bg-[#22c55e]/10 p-2 rounded-lg group-hover/item:bg-[#22c55e] transition-colors">
                    <TrendingUp className="w-5 h-5 text-[#22c55e] group-hover/item:text-black" />
                  </div>
                  <p className="text-sm font-black text-zinc-300 italic uppercase tracking-tight">{goal}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ----------------- 2. MVP ARCHITECTURE ----------------- */}
      {activeTab === "mvp" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-500">
          {[
            { 
              title: "Event Scheduling", 
              desc: "Dynamic multi-track scheduling engine. Handles everything from track days to high-ticket race weekends with custom staffing triggers.", 
              icon: Calendar,
              stat: "Core MVP"
            },
            { 
              title: "Ticketing / Reg", 
              desc: "Deeply integrated registration flow. Handles driver waivers, pit passes, and general admission with instant QR-code verification.", 
              icon: DollarSign,
              stat: "Core MVP"
            },
            { 
              title: "Compliance Bot", 
              desc: "Automated facility maintenance logs and insurance compliance reporting. Removes the manual paper trail from venue operations.", 
              icon: ShieldCheck,
              stat: "Automation"
            }
          ].map((feature, i) => (
            <div key={i} className="bg-zinc-900/40 border border-zinc-800 p-12 rounded-[3.5rem] flex flex-col gap-8 group hover:border-[#3b82f6]/50 transition-all">
              <div className="bg-black p-6 rounded-[2rem] border border-zinc-800 w-fit group-hover:scale-110 transition-transform">
                <feature.icon className="w-8 h-8 text-[#3b82f6]" />
              </div>
              <div>
                <span className="text-[9px] font-black text-[#3b82f6] uppercase tracking-widest bg-[#3b82f6]/10 px-3 py-1 rounded-full">{feature.stat}</span>
                <h4 className="text-3xl font-black italic uppercase mt-6 mb-4 tracking-tighter">{feature.title}</h4>
                <p className="text-sm text-zinc-500 italic leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ----------------- 3. SALES PIPELINE ----------------- */}
      {activeTab === "sales" && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-zinc-500 text-xs font-black uppercase tracking-[0.4em] italic flex items-center gap-3">
                <Target className="w-5 h-5" /> Beta & Sales Pipeline
              </h3>
              {prospects.map(p => (
                <div key={p.id} className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2.5rem] flex justify-between items-center group hover:bg-zinc-900/60 transition-all border-l-8 border-l-[#3b82f6]">
                  <div className="flex items-center gap-8">
                    <div className="bg-black p-6 rounded-2xl border border-zinc-800 text-zinc-600 group-hover:text-[#3b82f6] transition-colors shadow-xl">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase italic text-2xl tracking-tighter">{p.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-[#3b82f6] font-black uppercase tracking-widest">{p.type}</span>
                        <div className="w-1 h-1 rounded-full bg-zinc-800" />
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">{p.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-right">
                      <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Contract Potential</p>
                      <p className="text-xl font-black text-white italic tracking-tighter">${p.value}<span className="text-[10px] text-zinc-600 ml-1">/MO</span></p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-zinc-800" />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
               <div className="bg-[#3b82f6]/5 border border-[#3b82f6]/20 p-10 rounded-[3rem]">
                  <h3 className="text-white font-black uppercase text-sm italic mb-6">Target Venue Profile</h3>
                  <div className="space-y-4">
                    {[
                      { l: "Primary", v: "Local/Regional Tracks" },
                      { l: "Secondary", v: "Drift Facilities" },
                      { l: "Secondary", v: "Drag Strips" },
                      { l: "Growth", v: "Entertainment Complexes" }
                    ].map((t, i) => (
                      <div key={i} className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-zinc-800">
                        <span className="text-[9px] font-black text-zinc-600 uppercase italic">{t.l}</span>
                        <span className="text-[11px] font-black text-white italic uppercase">{t.v}</span>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="bg-zinc-900/40 border border-zinc-800 p-10 rounded-[3rem] text-center">
                  <Star className="w-10 h-10 text-[#facc15] mx-auto mb-6" />
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">The Pilot Star</p>
                  <p className="text-xl font-black italic uppercase text-white">Dominion Raceway</p>
                  <p className="text-xs text-zinc-600 italic mt-4 leading-relaxed">Your proof-of-concept. All operational metrics must be derived from this facility first.</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- 4. BRANDING ----------------- */}
      {activeTab === "branding" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in duration-500">
          <section className="bg-zinc-900/40 border border-zinc-800 p-12 rounded-[4rem]">
            <h3 className="text-[#3b82f6] font-black uppercase text-xs mb-10 tracking-[0.3em] italic flex items-center gap-3">
              <Share2 className="w-5 h-5" /> LinkedIn &quot;Build In Public&quot; Strategy
            </h3>
            <div className="space-y-8">
               <div className="p-8 bg-black/60 rounded-[2.5rem] border border-zinc-800 hover:border-[#3b82f6]/50 transition-all">
                  <p className="text-[#3b82f6] text-[10px] font-black uppercase tracking-widest mb-4">Content Pillar 01</p>
                  <h4 className="text-2xl font-black italic uppercase text-white mb-4">The Efficiency Story</h4>
                  <p className="text-zinc-500 text-sm italic leading-relaxed">
                    Post specific operational wins. &quot;We saved the Dominion track crew 4 hours of scheduling this week with AlliO&apos;s STAFFING engine.&quot;
                  </p>
               </div>
               <div className="p-8 bg-black/60 rounded-[2.5rem] border border-zinc-800 hover:border-[#3b82f6]/50 transition-all">
                  <p className="text-[#3b82f6] text-[10px] font-black uppercase tracking-widest mb-4">Content Pillar 02</p>
                  <h4 className="text-2xl font-black italic uppercase text-white mb-4">Industry Authority</h4>
                  <p className="text-zinc-500 text-sm italic leading-relaxed">
                    &quot;Excel is where venue profits go to die. Why manual scheduling is costing regional tracks $20k+ in liability risk.&quot;
                  </p>
               </div>
            </div>
          </section>
          
          <div className="bg-[#3b82f6]/5 border border-[#3b82f6]/20 p-12 rounded-[4rem] flex flex-col justify-center text-center">
              <Network className="w-16 h-16 text-[#3b82f6] mx-auto mb-8 animate-pulse" />
              <h3 className="text-5xl font-black italic uppercase text-white tracking-tighter mb-6">The Referral Engine</h3>
              <p className="text-zinc-500 text-sm italic max-w-sm mx-auto leading-relaxed mb-10">
                Current customers become the sales force. Every new venue signed by an existing venue owner earns them 3 months free or a direct payout.
              </p>
              <div className="flex justify-center gap-4">
                 <div className="bg-black/40 px-6 py-4 rounded-2xl border border-zinc-800 font-black italic text-[#22c55e]">$500 BOUNTY</div>
                 <div className="bg-black/40 px-6 py-4 rounded-2xl border border-zinc-800 font-black italic text-white">OR 3MO FREE</div>
              </div>
          </div>
        </div>
      )}

      {/* ----------------- 5. EXIT READINESS (NEW & DETAILED) ----------------- */}
      {activeTab === "exit" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500">
          <div className="lg:col-span-8 space-y-8">
            <h3 className="text-[#facc15] text-xs font-black uppercase tracking-[0.4em] italic flex items-center gap-3">
              <Lock className="w-5 h-5" /> Due Diligence Vault
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exitDocs.map(doc => (
                <div key={doc.id} className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2.5rem] flex flex-col gap-6 group hover:bg-zinc-900/60 transition-all border-b-8 border-b-zinc-900 hover:border-b-[#facc15]">
                  <div className="flex justify-between items-start">
                    <div className="bg-black p-4 rounded-xl border border-zinc-800">
                      <FileText className="w-6 h-6 text-zinc-500 group-hover:text-[#facc15] transition-colors" />
                    </div>
                    <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase italic ${
                      doc.status === 'Secure' ? 'bg-[#22c55e]/20 text-[#22c55e]' : 
                      doc.status === 'Draft' ? 'bg-[#facc15]/20 text-[#facc15]' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase mb-2 tracking-widest">{doc.category}</p>
                    <h4 className="text-xl font-black italic uppercase text-white tracking-tight">{doc.label}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <section className="bg-zinc-900/60 border border-zinc-800 p-10 rounded-[3.5rem] text-center border-t-8 border-t-[#facc15] shadow-2xl">
              <Trophy className="w-16 h-16 text-[#facc15] mx-auto mb-8" />
              <h3 className="text-4xl font-black italic uppercase text-white leading-none mb-6">The Exit Thesis</h3>
              <p className="text-zinc-500 text-xs italic leading-relaxed mb-10">
                Scale to 50 active venues within 18 months. Standardize the &quot;AlliO Protocol&quot; for facility operations. Sell to a major conglomerate (NASCAR, SMI, or Liberty Media).
              </p>
              <div className="space-y-4">
                <div className="bg-black/60 p-6 rounded-2xl border border-zinc-800 text-left">
                  <p className="text-[9px] font-black text-[#facc15] uppercase italic mb-1">Target Exit Metric</p>
                  <p className="text-3xl font-black italic uppercase text-white tracking-tighter">50 VENUES</p>
                  <p className="text-sm font-black text-[#22c55e] italic mt-1">~$300k Annual Revenue</p>
                </div>
              </div>
            </section>

            <div className="bg-[#facc15]/5 border border-[#facc15]/20 p-10 rounded-[3rem] flex items-center gap-6">
               <div className="bg-[#facc15] p-4 rounded-2xl text-black">
                  <Lightbulb className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-white font-black uppercase text-xs italic">Exit Strategic</p>
                  <p className="text-zinc-600 text-[10px] font-bold italic leading-tight mt-1">
                    &quot;Buyers don&apos;t just buy revenue, they buy a system that works without you.&quot;
                  </p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}