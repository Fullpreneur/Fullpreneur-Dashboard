"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "../calendar/supabase"; 
import { 
  Plus, Search, X, User, Mail, Phone, 
  ChevronRight, ArrowUpRight, Zap, Building2, 
  LayoutGrid, DollarSign, CheckCircle2, XCircle, Clock,
  Calendar as CalendarIcon, MapPin, Layers, Globe, Activity, Briefcase, Shield,
  TrendingUp, BarChart3, Fingerprint, Box
} from "lucide-react";

export default function LeadVault() {
  // --- 1. CORE STATE ARCHITECTURE ---
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isSaving, setIsSaving] = useState(false);

  // --- 2. THE FULL DATASET (UNABRIDGED) ---
  const [newLead, setNewLead] = useState({
    full_name: "", email: "", phone: "", address: "",
    pillar: "Dominion", status: "New Lead", service_interest: "", notes: ""
  });

  const [newEvent, setNewEvent] = useState({
    title: "", start_date: "", description: "", pillar: "Dominion"
  });

  // --- 3. THE ENGINE ---
  useEffect(() => { fetchLeads(); }, []);

  async function fetchLeads() {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (!error && data) setLeads(data);
  }

  async function handleAddLead(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    const { data, error } = await supabase.from('leads').insert([newLead]).select();
    if (!error && data) {
      setLeads([data[0], ...leads]);
      setIsModalOpen(false);
      setNewLead({ full_name: "", email: "", phone: "", address: "", pillar: "Dominion", status: "New Lead", service_interest: "", notes: "" });
    }
    setIsSaving(false);
  }

  async function updateStatus(id: number, status: string) {
    const { error } = await supabase.from('leads').update({ status }).eq('id', id);
    if (!error) {
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
      if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status });
    }
  }

  async function handleScheduleDiscovery(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('events').insert([{
      title: `DISCOVERY: ${selectedLead.full_name} | ${newEvent.title}`,
      start_date: newEvent.start_date,
      description: `Lead: ${selectedLead.full_name}\nEmail: ${selectedLead.email}\nService: ${selectedLead.service_interest}\nAddress: ${selectedLead.address}`,
      pillar: selectedLead.pillar
    }]);

    if (!error) {
      await updateStatus(selectedLead.id, 'Meeting Scheduled');
      setIsScheduling(false);
      alert("MASTER CALENDAR SYNC SUCCESSFUL");
    }
  }

  // --- 4. DATA PROCESSING ---
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const searchStr = `${l.full_name} ${l.email} ${l.pillar} ${l.service_interest} ${l.address}`.toLowerCase();
      const match = searchStr.includes(searchTerm.toLowerCase());
      const pill = activeFilter === "All" || l.pillar === activeFilter;
      return match && pill;
    });
  }, [leads, searchTerm, activeFilter]);

  return (
    <div className="p-10 bg-[#020202] min-h-screen text-white font-sans selection:bg-[#00f2ff]/30">
      
      {/* HEADER SECTION - NO STRIPPING */}
      <header className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-[3px] w-16 bg-[#00f2ff] shadow-[0_0_20px_#00f2ff]"></div>
            <p className="text-[#00f2ff] font-black text-[12px] uppercase tracking-[0.7em] italic">Fullpreneur Lead Vault Command Center</p>
          </div>
          <h1 className="text-9xl font-black italic uppercase tracking-tighter leading-[0.75]">
            LEAD <span className="text-zinc-900 uppercase">Vault</span>
          </h1>
        </div>
        
        <div className="flex flex-col gap-6 items-end">
          <div className="bg-zinc-900/40 p-3 rounded-3xl border border-zinc-800/50 flex gap-2 backdrop-blur-xl shadow-2xl">
            {["All", "Dominion", "SBA", "Property Improvements", "AlliO"].map(p => (
              <button 
                key={p} 
                onClick={() => setActiveFilter(p)} 
                className={`px-8 py-4 rounded-2xl text-[10px] whitespace-nowrap font-black uppercase transition-all duration-500 transform ${activeFilter === p ? "bg-white text-black scale-105 shadow-[0_0_25px_rgba(255,255,255,0.2)]" : "text-zinc-600 hover:text-white hover:bg-zinc-800"}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="group bg-white text-black px-12 py-6 rounded-3xl font-black uppercase text-[12px] tracking-[0.2em] hover:bg-[#00f2ff] transition-all flex items-center gap-4 shadow-[0_10px_40px_rgba(255,255,255,0.05)] active:scale-95"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Initialize New Lead Asset
          </button>
        </div>
      </header>

      {/* THE 5-PILLAR METRIC GRID (FULLY RESTORED) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-16">
        {[
          { label: "Total Pipeline", val: leads.length, color: "text-white", icon: LayoutGrid, shadow: "shadow-white/5" },
          { label: "Dominion", val: leads.filter(l => l.pillar === "Dominion").length, color: "text-[#00f2ff]", icon: Zap, shadow: "shadow-[#00f2ff]/5" },
          { label: "SBA Sync", val: leads.filter(l => l.pillar === "SBA").length, color: "text-emerald-400", icon: Shield, shadow: "shadow-emerald-400/5" },
          { label: "Property Improvements", val: leads.filter(l => l.pillar === "Property Improvements").length, color: "text-[#facc15]", icon: Building2, shadow: "shadow-[#facc15]/5" },
          { label: "AlliO Ecosystem", val: leads.filter(l => l.pillar === "AlliO").length, color: "text-purple-400", icon: Globe, shadow: "shadow-purple-400/5" },
        ].map((stat, i) => (
          <div key={i} className={`bg-zinc-900/20 border border-zinc-800/80 p-10 rounded-[3rem] group hover:border-zinc-500 transition-all cursor-default shadow-2xl ${stat.shadow}`}>
            <div className="flex justify-between items-start mb-8">
              <div className={`p-5 rounded-2xl bg-black border border-zinc-800 ${stat.color} group-hover:scale-110 transition-transform duration-500`}><stat.icon className="w-7 h-7" /></div>
              <TrendingUp className="w-5 h-5 text-zinc-800 group-hover:text-zinc-400 transition-colors" />
            </div>
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-2 leading-tight">{stat.label}</p>
            <p className={`text-6xl font-black italic tracking-tighter ${stat.color}`}>
              {stat.val < 10 ? `0${stat.val}` : stat.val}
            </p>
          </div>
        ))}
      </div>

      {/* SEARCH INTERFACE */}
      <div className="relative mb-14 group">
        <Search className="absolute left-12 top-1/2 -translate-y-1/2 text-zinc-700 w-8 h-8 group-focus-within:text-[#00f2ff] transition-all" />
        <input 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Query the Vault: Name, Pillar, Interest, or Metadata..." 
          className="w-full bg-zinc-900/10 border border-zinc-800/60 p-12 pl-28 rounded-[4rem] text-lg font-bold outline-none focus:border-[#00f2ff] focus:bg-zinc-900/30 transition-all shadow-inner placeholder:text-zinc-800" 
        />
        <div className="absolute right-12 top-1/2 -translate-y-1/2 flex gap-4 text-zinc-700 font-black text-[10px] uppercase tracking-widest">
          <span>Search</span>
          <div className="h-4 w-[1px] bg-zinc-800"></div>
          <span>Filter</span>
        </div>
      </div>

      {/* THE MASTER TABLE ARCHITECTURE */}
      <div className="bg-zinc-900/10 border border-zinc-800/60 rounded-[5rem] overflow-hidden shadow-2xl backdrop-blur-md">
        <table className="w-full text-left">
          <thead className="bg-zinc-900/40 border-b border-zinc-800/80">
            <tr>
              <th className="p-14 text-[11px] font-black uppercase text-zinc-500 tracking-[0.4em] italic">Lead Identity & Source</th>
              <th className="p-14 text-[11px] font-black uppercase text-zinc-500 tracking-[0.4em] italic text-center">Lifecycle Phase</th>
              <th className="p-14 text-[11px] font-black uppercase text-zinc-500 tracking-[0.4em] italic text-right">Vault Entry</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {filteredLeads.map((lead) => (
              <tr 
                key={lead.id} 
                onClick={() => setSelectedLead(lead)} 
                className="group hover:bg-[#00f2ff]/[0.04] transition-all duration-300 cursor-pointer"
              >
                <td className="p-14">
                  <div className="flex items-center gap-10">
                    <div className="w-20 h-20 bg-black rounded-[2.2rem] border border-zinc-800 flex items-center justify-center group-hover:border-[#00f2ff]/50 transition-all shadow-2xl relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <User className="w-8 h-8 text-zinc-700 group-hover:text-[#00f2ff] relative z-10" />
                    </div>
                    <div>
                      <p className="text-4xl font-black italic uppercase tracking-tighter text-white group-hover:text-[#00f2ff] transition-all leading-none mb-4">{lead.full_name}</p>
                      <div className="flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] italic">
                        <span className="flex items-center gap-3 text-zinc-600 group-hover:text-zinc-400"><Mail className="w-4 h-4"/> {lead.email || "NO_EMAIL"}</span>
                        <span className="flex items-center gap-3 text-zinc-500"><Globe className="w-4 h-4"/> {lead.pillar}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-14 text-center">
                  <div className={`inline-flex items-center gap-4 px-10 py-5 rounded-[2rem] bg-black border-2 ${lead.status === 'Closed Won' ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'border-zinc-800'}`}>
                    <div className={`w-3 h-3 rounded-full animate-pulse ${lead.status === 'Closed Won' ? 'bg-emerald-400' : 'bg-[#00f2ff]'}`}></div>
                    <span className={`text-xs font-black uppercase tracking-[0.2em] ${lead.status === 'Closed Won' ? 'text-emerald-400' : 'text-zinc-400'}`}>{lead.status}</span>
                  </div>
                </td>
                <td className="p-14 text-right">
                  <button className="p-7 bg-zinc-900/50 border border-zinc-800 rounded-[2.2rem] hover:bg-[#00f2ff] hover:text-black transition-all group/btn shadow-xl">
                    <ChevronRight className="w-8 h-8 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SALES COMMAND CENTER DRAWER (NO STRIPPING) */}
      {selectedLead && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl transition-all" onClick={() => {setSelectedLead(null); setIsScheduling(false);}} />
          <div className="relative w-full max-w-4xl bg-[#050505] border-l border-zinc-800 h-full p-28 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500">
            <button onClick={() => {setSelectedLead(null); setIsScheduling(false);}} className="absolute top-12 right-12 p-6 hover:bg-zinc-800 rounded-full transition-all text-zinc-500 hover:text-white"><X className="w-10 h-10" /></button>
            <p className="text-[#00f2ff] font-black text-[12px] uppercase tracking-[0.8em] italic mb-8">Tactical Execution Interface</p>
            <h2 className="text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.85] mb-20">{selectedLead.full_name}</h2>

            {/* PIPELINE COMMANDS */}
            <div className="space-y-6 mb-20">
              {!isScheduling ? (
                <>
                  <button onClick={() => setIsScheduling(true)} className="w-full p-12 bg-[#00f2ff] text-black rounded-[3rem] flex items-center justify-between hover:bg-white transition-all shadow-[0_0_50px_rgba(0,242,255,0.15)] group">
                    <span className="font-black uppercase italic tracking-[0.3em] text-2xl">Schedule Discovery</span>
                    <CalendarIcon className="w-12 h-12 group-hover:scale-110 transition-transform" />
                  </button>
                  <button onClick={() => updateStatus(selectedLead.id, 'Closed Won')} className="w-full p-12 bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-500 rounded-[3rem] flex items-center justify-between hover:bg-emerald-500 hover:text-black transition-all group">
                    <span className="font-black uppercase italic tracking-[0.3em] text-2xl">Mark as Closed Won</span>
                    <CheckCircle2 className="w-12 h-12 group-hover:rotate-12 transition-transform" />
                  </button>
                </>
              ) : (
                <form onSubmit={handleScheduleDiscovery} className="bg-zinc-900/60 p-12 rounded-[4rem] border-2 border-[#00f2ff]/40 space-y-8 animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center">
                    <p className="text-[#00f2ff] font-black text-xs uppercase italic tracking-[0.4em]">Master Calendar Sync Active</p>
                    <button type="button" onClick={() => setIsScheduling(false)} className="text-zinc-700 hover:text-white"><X className="w-6 h-6"/></button>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4 italic">Execution Timestamp</label>
                    <input required type="datetime-local" onChange={e => setNewEvent({...newEvent, start_date: e.target.value})} className="w-full bg-black border border-zinc-800 p-10 rounded-[2.5rem] text-white text-xl font-bold outline-none focus:border-[#00f2ff] transition-all" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4 italic">Call Objective</label>
                    <input required placeholder="E.G. STRATEGY SESSION / QUOTE REVIEW" onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-black border border-zinc-800 p-10 rounded-[2.5rem] text-white text-xl font-bold outline-none focus:border-[#00f2ff] transition-all uppercase" />
                  </div>
                  <button type="submit" className="w-full bg-white text-black py-10 rounded-[2.5rem] font-black uppercase italic tracking-[0.4em] text-lg hover:bg-[#00f2ff] transition-all shadow-2xl">Confirm & Commit to Master Calendar</button>
                </form>
              )}
            </div>

            {/* METADATA & PERSISTENCE */}
            <div className="p-14 bg-black border border-zinc-800/80 rounded-[4.5rem] space-y-12 shadow-inner">
               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest italic flex items-center gap-3"><Activity className="w-4 h-4"/> Pillar Origin</p>
                    <p className="text-3xl font-black italic text-white uppercase">{selectedLead.pillar}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest italic flex items-center gap-3"><TrendingUp className="w-4 h-4"/> Interest Level</p>
                    <p className="text-3xl font-black italic text-[#facc15] uppercase">{selectedLead.service_interest || "GENERAL"}</p>
                  </div>
               </div>
               <div className="space-y-3">
                  <p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest italic flex items-center gap-3"><MapPin className="w-4 h-4"/> Target Location</p>
                  <p className="text-xl font-bold text-zinc-400 italic leading-relaxed">{selectedLead.address || "NO LOCATION DATA RECORDED"}</p>
               </div>
               <div className="h-[2px] bg-zinc-900/50 w-full"></div>
               <div className="space-y-6">
                 <p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest italic flex items-center gap-3"><Layers className="w-5 h-5"/> Tactical Project Documentation</p>
                 <textarea 
                  className="w-full bg-transparent border-none text-zinc-300 font-bold text-2xl h-96 outline-none resize-none placeholder:text-zinc-900 leading-relaxed" 
                  placeholder="BEGIN LOGGING LEAD INTELLIGENCE..."
                  defaultValue={selectedLead.notes}
                 ></textarea>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* INITIALIZATION MODAL (THE FULL ARCHITECTURE) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[2000] flex items-center justify-center p-10 animate-in fade-in duration-500">
          <form onSubmit={handleAddLead} className="bg-zinc-900 border border-zinc-800 p-24 rounded-[6rem] max-w-6xl w-full shadow-[0_0_150px_rgba(0,242,255,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f2ff]/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>
            <div className="flex justify-between items-start mb-20 relative z-10">
              <div>
                <h2 className="text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.8]">INITIALIZE<br/><span className="text-zinc-800">VAULT ENTRY</span></h2>
                <p className="text-[#00f2ff] font-black text-xs uppercase tracking-[0.7em] italic mt-6">Secure Asset Deployment</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-8 hover:bg-zinc-800 rounded-full transition-all text-zinc-700 hover:text-white"><X className="w-12 h-12" /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-10 relative z-10">
              <div className="col-span-2 group">
                <input required value={newLead.full_name} onChange={e => setNewLead({...newLead, full_name: e.target.value})} className="w-full bg-black border-2 border-zinc-800 p-12 rounded-[3.5rem] text-3xl font-black italic text-white outline-none focus:border-[#00f2ff] focus:shadow-[0_0_30px_rgba(0,242,255,0.1)] transition-all uppercase" placeholder="FULL LEGAL NAME" />
              </div>
              <input value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} className="bg-black border-2 border-zinc-800 p-10 rounded-[3rem] text-lg font-bold text-white outline-none focus:border-[#00f2ff] transition-all" placeholder="EMAIL ADDRESS" />
              <input value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} className="bg-black border-2 border-zinc-800 p-10 rounded-[3rem] text-lg font-bold text-white outline-none focus:border-[#00f2ff] transition-all" placeholder="CONTACT PHONE" />
              <input value={newLead.address} onChange={e => setNewLead({...newLead, address: e.target.value})} className="col-span-2 bg-black border-2 border-zinc-800 p-10 rounded-[3.5rem] text-lg font-bold text-white outline-none focus:border-[#00f2ff] transition-all uppercase" placeholder="PROPERTY / TARGET STREET ADDRESS" />
              
              <div className="relative group">
                <select value={newLead.pillar} onChange={e => setNewLead({...newLead, pillar: e.target.value})} className="w-full bg-black border-2 border-zinc-800 p-10 rounded-[3rem] text-sm font-black italic text-[#00f2ff] outline-none uppercase tracking-widest appearance-none cursor-pointer">
                  {["Dominion", "SBA", "Property Improvements", "AlliO"].map(p => <option key={p} value={p}>{p} PILLAR</option>)}
                </select>
                <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-700 font-black">▼</div>
              </div>
              
              <input value={newLead.service_interest} onChange={e => setNewLead({...newLead, service_interest: e.target.value})} className="bg-black border-2 border-zinc-800 p-10 rounded-[3rem] text-sm font-black italic text-zinc-500 outline-none focus:border-[#00f2ff] transition-all uppercase tracking-widest" placeholder="SPECIFIC SERVICE INTEREST" />
            </div>

            <button type="submit" disabled={isSaving} className="w-full bg-white text-black py-16 rounded-[4rem] font-black uppercase tracking-[1em] text-[18px] mt-20 hover:bg-[#00f2ff] transition-all shadow-2xl transform hover:-translate-y-2 active:scale-95">
              {isSaving ? "SYNCING TO VAULT..." : "CONFIRM INITIALIZATION"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}