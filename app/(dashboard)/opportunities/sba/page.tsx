"use client";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, Landmark, Plus, Search, 
  Phone, Mail, ChevronRight, BadgeDollarSign, 
  X, CheckCircle2, AlertCircle, Filter,
  TrendingUp, Activity, ArrowUpRight, FileText,
  UserPlus, Save, Trash2, ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function SBAManager() {
  // --- 1. DATA STATE: THE CRM CORE ---
  const [leads, setLeads] = useState([
    { 
      id: 1, 
      name: "Dominion Vendor A", 
      contact: "Mike Smith", 
      email: "mike@vendor.com", 
      phone: "555-0199", 
      amount: "$250,000", 
      status: "Queue", 
      narrative: "Strong assets, low debt-to-income.",
      score: 85 
    },
    { 
      id: 2, 
      name: "Apex Landscaping", 
      contact: "Sarah Chen", 
      email: "sarah@apex.com", 
      phone: "555-0244", 
      amount: "$450,000", 
      status: "Active", 
      narrative: "Seasonal revenue peaks, high equipment equity.",
      score: 72 
    }
  ]);

  // --- 2. UI STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Queue");
  const [search, setSearch] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // --- 3. FORM STATE: DATA ENTRY ---
  const [newLead, setNewLead] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    amount: "",
    narrative: ""
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- 4. ACTION HANDLERS: CONNECTED BUTTONS ---
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const leadEntry = {
      ...newLead,
      id: Date.now(),
      status: "Queue",
      score: 50 // Default baseline score
    };
    setLeads([leadEntry, ...leads]);
    setNewLead({ name: "", contact: "", email: "", phone: "", amount: "", narrative: "" });
    setIsModalOpen(false);
  };

  const deleteLead = (id: number) => {
    if(confirm("Delete this lead permanently?")) {
      setLeads(leads.filter(l => l.id !== id));
    }
  };

  const updateStatus = (id: number, newStatus: string) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const filteredLeads = leads.filter(l => 
    l.status === activeTab && 
    (l.name.toLowerCase().includes(search.toLowerCase()) || 
     l.contact.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 bg-[#050505] min-h-screen text-white font-sans selection:bg-[#facc15]/30">
      
      {/* --- LEVEL 1: HEADER & TARGETS --- */}
      <header className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex items-center gap-6">
          <Link href="/" className="p-4 bg-zinc-900 rounded-[1.5rem] border border-zinc-800 hover:bg-zinc-800 transition-all group">
            <ArrowLeft className="w-6 h-6 text-zinc-500 group-hover:text-white" />
          </Link>
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
              SBA 7(a) <span className="text-zinc-800">MANAGER</span>
            </h1>
            <p className="text-[#facc15] font-black text-[10px] uppercase tracking-[0.4em] mt-2 italic">
              LEAD GEN & BROKER LOGISTICS
            </p>
          </div>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl flex-1 lg:min-w-[200px]">
             <p className="text-[9px] font-black text-zinc-500 uppercase italic">Active Pipeline</p>
             <p className="text-2xl font-black italic text-[#22c55e]">${leads.reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9]/g, '') || '0'), 0).toLocaleString()}</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-[#facc15] transition-all flex items-center gap-3 shadow-xl"
          >
            <UserPlus className="w-4 h-4" /> Initialize Lead
          </button>
        </div>
      </header>

      {/* --- LEVEL 2: OPERATIONAL GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: BROKER & STRATEGY PANEL */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900/20 border border-zinc-800 p-8 rounded-[2.5rem]">
            <h3 className="text-[11px] font-black uppercase text-zinc-500 mb-6 italic tracking-widest">Broker Portals</h3>
            <div className="space-y-3">
              {[
                { name: 'Lendio', status: 'Active', url: 'https://lendio.com' },
                { name: 'Biz2Credit', status: 'Active', url: 'https://biz2credit.com' },
                { name: 'Funding Circle', status: 'Active', url: 'https://fundingcircle.com' }
              ].map(portal => (
                <a key={portal.name} href={portal.url} target="_blank" className="flex justify-between items-center p-4 bg-black/40 border border-zinc-800 rounded-xl hover:border-white transition-all group">
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-white uppercase italic">{portal.name}</span>
                  <ExternalLink className="w-3 h-3 text-zinc-700 group-hover:text-[#facc15]" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-[#facc15]/5 border border-[#facc15]/20 p-8 rounded-[2.5rem]">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-[#facc15] w-5 h-5" />
              <p className="text-[11px] font-black text-[#facc15] uppercase italic tracking-widest">Strategy Pulse</p>
            </div>
            <p className="text-sm font-bold italic text-zinc-400 leading-relaxed">
              Focus on **Business Acquisitions** and **Partner Buyouts** for highest margins.
            </p>
          </div>
        </div>

        {/* MAIN: THE CRM TABLE --- */}
        <div className="lg:col-span-9 bg-zinc-900/20 border border-zinc-800 rounded-[3.5rem] overflow-hidden flex flex-col">
          
          {/* TABS CONTROLLER */}
          <div className="flex border-b border-zinc-800 bg-zinc-900/10">
            {['Queue', 'Active', 'Funded'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-zinc-800 text-[#facc15] border-b-2 border-[#facc15]' : 'text-zinc-500 hover:text-white'}`}
              >
                {tab} ({leads.filter(l => l.status === tab).length})
              </button>
            ))}
          </div>

          {/* SEARCH & FILTER */}
          <div className="p-8 border-b border-zinc-800 bg-black/20 flex gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company name, contact, or email..."
                className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold focus:border-[#facc15] outline-none transition-all"
              />
            </div>
            <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* TABLE DATA */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-[10px] font-black uppercase text-zinc-600 tracking-widest italic">
                  <th className="px-10 py-6">Company & Lead</th>
                  <th className="px-10 py-6">Contact Channels</th>
                  <th className="px-10 py-6">Capital Target</th>
                  <th className="px-10 py-6 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {filteredLeads.length > 0 ? filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] group transition-colors">
                    <td className="px-10 py-8">
                      <p className="text-xl font-black italic uppercase text-white leading-none mb-2">{lead.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase italic">{lead.contact}</span>
                        <div className="w-1 h-1 rounded-full bg-zinc-800" />
                        <span className="text-[9px] text-[#facc15] font-black uppercase">Score: {lead.score}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-zinc-400 group-hover:text-white transition-colors">
                          <Mail className="w-3 h-3 text-zinc-700" />
                          <p className="text-[11px] font-bold italic">{lead.email}</p>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 group-hover:text-white transition-colors">
                          <Phone className="w-3 h-3 text-zinc-700" />
                          <p className="text-[11px] font-bold italic">{lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-2xl font-black italic text-[#22c55e] tabular-nums">{lead.amount}</p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1 italic">SBA 7(A) Standard</p>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end gap-3">
                        {lead.status === 'Queue' && (
                          <button 
                            onClick={() => updateStatus(lead.id, 'Active')}
                            className="bg-white text-black px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-[#facc15] transition-all"
                          >
                            Move to Active
                          </button>
                        )}
                        <button 
                          onClick={() => deleteLead(lead.id)}
                          className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-700 hover:text-red-500 hover:border-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-10 py-20 text-center">
                      <p className="text-zinc-600 font-black uppercase italic tracking-widest text-sm">No results found in {activeTab} stage.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- ADD LEAD MODAL: FULLY WIRED --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <form 
            onSubmit={handleAddLead}
            className="bg-zinc-900 border border-zinc-800 p-12 rounded-[4rem] max-w-2xl w-full shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">Initialize Lead</h2>
                <p className="text-zinc-500 text-xs font-bold italic mt-1 uppercase tracking-widest">Entry for SBA Pipeline v4.0</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-zinc-800 rounded-full transition-colors">
                <X className="w-7 h-7 text-zinc-600" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-zinc-500 uppercase italic ml-2">Company Entity</p>
                <input required value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} className="w-full bg-black border border-zinc-800 p-5 rounded-[1.5rem] text-sm font-bold outline-none focus:border-[#facc15] transition-all" placeholder="Legal Name" />
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-zinc-500 uppercase italic ml-2">Primary Officer</p>
                <input required value={newLead.contact} onChange={e => setNewLead({...newLead, contact: e.target.value})} className="w-full bg-black border border-zinc-800 p-5 rounded-[1.5rem] text-sm font-bold outline-none focus:border-[#facc15] transition-all" placeholder="Full Name" />
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-zinc-500 uppercase italic ml-2">Email Address</p>
                <input required type="email" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} className="w-full bg-black border border-zinc-800 p-5 rounded-[1.5rem] text-sm font-bold outline-none focus:border-[#facc15] transition-all" placeholder="contact@company.com" />
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-zinc-500 uppercase italic ml-2">Phone Number</p>
                <input required type="tel" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} className="w-full bg-black border border-zinc-800 p-5 rounded-[1.5rem] text-sm font-bold outline-none focus:border-[#facc15] transition-all" placeholder="(555) 000-0000" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <p className="text-[9px] font-black text-zinc-500 uppercase italic ml-2">Funding Goal</p>
                <input required value={newLead.amount} onChange={e => setNewLead({...newLead, amount: e.target.value})} className="w-full bg-black border border-zinc-800 p-5 rounded-[1.5rem] text-sm font-black italic outline-none focus:border-[#facc15] transition-all text-[#22c55e]" placeholder="$0.00" />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-white text-black py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs mt-10 hover:bg-[#facc15] hover:scale-[1.02] transition-all shadow-2xl relative z-10">
              Finalize & Add to Queue
            </button>
            <Landmark className="absolute -bottom-10 -left-10 w-64 h-64 text-zinc-800 opacity-[0.05] pointer-events-none" />
          </form>
        </div>
      )}
    </div>
  );
}