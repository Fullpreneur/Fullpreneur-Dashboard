"use client";
import { useState, useEffect } from "react";
import { 
  Users, Trash2, Home, PlusCircle, Clock, MapPin, 
  Phone, Mail, HardHat, ChevronRight, Plus, ClipboardList, 
  DollarSign, Repeat, TrendingUp, ShieldCheck, Star, Briefcase,
  AlertCircle, CheckCircle2, Construction, FileText, LayoutGrid,
  Trophy, Percent, Lightbulb
} from "lucide-react";

// --- TYPES ---
interface Lead { 
  id: number; 
  name: string; 
  email: string;
  phone: string;
  type: string; 
  address: string; 
  notes: string;
}

interface Property {
  id: number;
  owner: string;
  address: string;
  email: string;
  phone: string;
  scopeOfWork: string; 
  status: "Estimate Pending" | "Install In-Progress" | "Complete" | "Maintenance";
  notes: string;
}

export default function PropertyImprovementHub() {
  const [activeTab, setActiveTab] = useState("crm");
  const [isMounted, setIsMounted] = useState(false);
  
  // Data State Persistence
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  
  // Lead Form State
  const [newLead, setNewLead] = useState({ 
    name: "", email: "", phone: "", type: "Trimlight Residential", address: "", notes: "" 
  });

  // Property Form State
  const [newProp, setNewProp] = useState({
    owner: "", address: "", email: "", phone: "", scopeOfWork: "", status: "Estimate Pending" as const, notes: ""
  });

  // VERBATIM CATEGORIES FROM YOUR INSTRUCTIONS
  const categories = [
    "Trimlight Residential", 
    "Trimlight Commercial", 
    "Roofing", 
    "Siding", 
    "Windows", 
    "Doors", 
    "Exterior Attachments", 
    "Hardscapes", 
    "Pools", 
    "Additions", 
    "Remodels"
  ];

  // --- HYDRATION & PERSISTENCE ---
  useEffect(() => {
    const savedLeads = localStorage.getItem("prop_imp_leads_vFINAL");
    const savedProps = localStorage.getItem("prop_imp_assets_vFINAL");
    if (savedLeads) setLeads(JSON.parse(savedLeads));
    if (savedProps) setProperties(JSON.parse(savedProps));
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("prop_imp_leads_vFINAL", JSON.stringify(leads));
      localStorage.setItem("prop_imp_assets_vFINAL", JSON.stringify(properties));
    }
  }, [leads, properties, isMounted]);

  const addLead = () => {
    if (newLead.name.trim()) {
      setLeads([{ id: Date.now(), ...newLead }, ...leads]);
      setNewLead({ name: "", email: "", phone: "", type: "Trimlight Residential", address: "", notes: "" });
    }
  };

  const addProperty = () => {
    if (newProp.owner.trim() && newProp.address.trim()) {
      setProperties([{ id: Date.now(), ...newProp }, ...properties]);
      setNewProp({ owner: "", address: "", email: "", phone: "", scopeOfWork: "", status: "Estimate Pending", notes: "" });
    }
  };

  const updatePropertyStatus = (id: number, status: Property["status"]) => {
    setProperties(properties.map(p => p.id === id ? { ...p, status } : p));
  };

  if (!isMounted) return <div className="bg-black min-h-screen" />;

  return (
    <div className="p-10 space-y-8 bg-black min-h-screen text-white font-sans">
      {/* ----------------- HEADER ----------------- */}
      <header className="flex justify-between items-end border-b border-zinc-800 pb-12">
        <div>
          <h1 className="text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
            Property <span className="text-zinc-600">Improvements</span>
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <p className="text-[#facc15] font-black tracking-[0.4em] text-xs uppercase italic bg-[#facc15]/10 px-3 py-1 rounded">
              Trimlight & Exterior Specialists
            </p>
            <div className="h-px w-12 bg-zinc-800" />
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest italic">
              Legacy Operations
            </p>
          </div>
        </div>
        <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800 flex items-center gap-6">
          <div className="text-right">
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Development Platform</p>
            <p className="text-xl font-black text-[#22c55e] italic tracking-tighter uppercase">ROOTED CONCEPT</p>
          </div>
          <div className="bg-[#22c55e]/20 p-3 rounded-2xl border border-[#22c55e]/30">
            <TrendingUp className="w-6 h-6 text-[#22c55e]" />
          </div>
        </div>
      </header>

      {/* ----------------- NAVIGATION ----------------- */}
      <nav className="flex gap-4 border-b border-zinc-900 pb-6 overflow-x-auto no-scrollbar">
        {[
          { id: "crm", label: "Opportunity Tracker", icon: Users, color: "#facc15" },
          { id: "properties", label: "Customer Ledger", icon: Home, color: "#facc15" },
          { id: "flywheel", label: "The Flywheel Bible", icon: Repeat, color: "#22c55e" },
          { id: "pricing", label: "Economic Model", icon: DollarSign, color: "#22c55e" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === tab.id 
                ? "bg-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.1)] scale-105" 
                : "bg-zinc-950 text-zinc-500 border border-zinc-900 hover:border-zinc-700 hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ----------------- 1. CRM: LEAD CAPTURE ----------------- */}
      {activeTab === "crm" && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <section className="bg-zinc-900/30 border border-zinc-800 p-10 rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
               <PlusCircle className="w-32 h-32" />
            </div>
            <h2 className="text-[#facc15] font-black uppercase text-xs mb-8 flex items-center gap-3 tracking-widest">
              <PlusCircle className="w-5 h-5" /> Capture New Sales Opportunity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">Customer Name</label>
                <input type="text" placeholder="Full Name" value={newLead.name} onChange={(e) => setNewLead({...newLead, name: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#facc15] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">Email Address</label>
                <input type="email" placeholder="email@example.com" value={newLead.email} onChange={(e) => setNewLead({...newLead, email: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#facc15] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">Phone Number</label>
                <input type="tel" placeholder="(555) 000-0000" value={newLead.phone} onChange={(e) => setNewLead({...newLead, phone: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#facc15] transition-all" />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">Property Address</label>
                <input type="text" placeholder="Street, City, State, Zip" value={newLead.address} onChange={(e) => setNewLead({...newLead, address: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#facc15] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">Service Interest</label>
                <select value={newLead.type} onChange={(e) => setNewLead({...newLead, type: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-400 outline-none focus:border-[#facc15] appearance-none">
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <button onClick={addLead} className="lg:col-span-3 bg-[#facc15] text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl hover:bg-white h-16 transition-all shadow-[0_10px_30px_rgba(250,204,21,0.2)]">
                Initialize Opportunity Card
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.map(lead => (
              <div key={lead.id} className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2.5rem] relative group hover:border-[#facc15]/50 transition-all border-t-4 border-t-[#facc15]">
                <button onClick={() => setLeads(leads.filter(l => l.id !== lead.id))} className="absolute top-6 right-6 text-zinc-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#facc15] animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-[#facc15] tracking-tighter">{lead.type}</span>
                </div>
                <h3 className="font-black uppercase italic text-2xl leading-none mb-6 tracking-tighter">{lead.name}</h3>
                <div className="space-y-4 pt-6 border-t border-zinc-800">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-4 h-4 text-zinc-600 shrink-0 mt-1" />
                    <p className="text-xs text-zinc-400 font-bold leading-relaxed">{lead.address}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="w-4 h-4 text-zinc-600 shrink-0" />
                    <p className="text-xs text-zinc-400 font-bold tracking-tight">{lead.email || "NO EMAIL PROVIDED"}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-4 h-4 text-zinc-600 shrink-0" />
                    <p className="text-xs text-zinc-400 font-bold">{lead.phone || "NO PHONE PROVIDED"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- 2. PROPERTIES: CUSTOMER LEDGER ----------------- */}
      {activeTab === "properties" && (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-500">
          <section className="bg-zinc-900/30 border border-zinc-800 p-10 rounded-[3rem]">
            <h2 className="text-[#facc15] font-black uppercase text-xs mb-8 italic flex items-center gap-3">
              <Home className="w-5 h-5" /> Add Existing Client Property Asset
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <input type="text" placeholder="Owner Name" value={newProp.owner} onChange={(e) => setNewProp({...newProp, owner: e.target.value})} className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-sm outline-none focus:border-white transition-all" />
              <input type="text" placeholder="Property Address" value={newProp.address} onChange={(e) => setNewProp({...newProp, address: e.target.value})} className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-sm outline-none focus:border-white transition-all" />
              <input type="email" placeholder="Contact Email" value={newProp.email} onChange={(e) => setNewProp({...newProp, email: e.target.value})} className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-sm outline-none focus:border-white transition-all" />
              <input type="tel" placeholder="Contact Phone" value={newProp.phone} onChange={(e) => setNewProp({...newProp, phone: e.target.value})} className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-sm outline-none focus:border-white transition-all" />
              <div className="md:col-span-4 space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Primary Scope of Work & Project History</label>
                <textarea 
                  placeholder="Describe Trimlight configuration, landscaping schedule, siding details, or general property notes..." 
                  value={newProp.scopeOfWork} 
                  onChange={(e) => setNewProp({...newProp, scopeOfWork: e.target.value})} 
                  className="w-full bg-black border border-zinc-800 rounded-[2rem] px-6 py-5 text-sm outline-none focus:border-white h-40 resize-none transition-all leading-relaxed"
                />
              </div>
              <button onClick={addProperty} className="md:col-span-4 bg-white text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 h-20 hover:bg-[#facc15] transition-all">
                <Plus className="w-6 h-6" /> Commit Asset to Property Ledger
              </button>
            </div>
          </section>

          <div className="space-y-6">
            {properties.map(prop => (
              <div key={prop.id} className="bg-zinc-900/20 border border-zinc-800 p-10 rounded-[3.5rem] group relative hover:bg-zinc-900/40 transition-all border-l-[12px] border-l-[#facc15]">
                <div className="flex justify-between items-start mb-10">
                  <div className="flex gap-8 items-center">
                    <div className="bg-zinc-900 p-8 rounded-[2rem] text-[#facc15] border border-zinc-800 shadow-2xl">
                      <Home className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase italic text-4xl text-white tracking-tighter leading-none mb-2">{prop.owner}</h4>
                      <p className="text-sm text-zinc-500 uppercase font-black tracking-widest flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {prop.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-4">
                    <button onClick={() => setProperties(properties.filter(p => p.id !== prop.id))} className="text-zinc-800 hover:text-red-500 transition-colors">
                      <Trash2 className="w-6 h-6" />
                    </button>
                    <div className="bg-black/50 px-4 py-2 rounded-xl border border-zinc-800">
                      <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Status Code</p>
                      <p className="text-xs font-black text-[#facc15] uppercase italic">{prop.status}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Scope Section */}
                  <div className="lg:col-span-7 bg-black/40 p-8 rounded-[2.5rem] border border-zinc-800/50 relative overflow-hidden shadow-inner">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="p-2 bg-[#facc15]/10 rounded-lg">
                        <ClipboardList className="w-4 h-4 text-[#facc15]" />
                       </div>
                       <p className="text-[#facc15] text-[11px] font-black uppercase tracking-[0.2em] italic">Scope of Work & Logistics</p>
                    </div>
                    <p className="text-base text-zinc-400 italic whitespace-pre-wrap leading-relaxed">
                      {prop.scopeOfWork || "NO SCOPE OF WORK DEFINED FOR THIS ASSET."}
                    </p>
                  </div>

                  {/* Workflow / Status Update */}
                  <div className="lg:col-span-3 space-y-3">
                    <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest italic mb-4 flex items-center gap-2">
                      <Construction className="w-4 h-4" /> Update Workflow State
                    </p>
                    {["Estimate Pending", "Install In-Progress", "Complete", "Maintenance"].map((s) => (
                      <button
                        key={s}
                        onClick={() => updatePropertyStatus(prop.id, s as any)}
                        className={`w-full text-left px-5 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                          prop.status === s 
                            ? "bg-[#facc15] text-black scale-105 shadow-xl" 
                            : "bg-black/40 text-zinc-600 border border-zinc-800 hover:text-white"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* Contact Sidecard */}
                  <div className="lg:col-span-2 bg-black/40 p-8 rounded-[2.5rem] border border-zinc-800/50 flex flex-col justify-center gap-6">
                    <div>
                      <p className="text-zinc-600 text-[9px] font-black uppercase tracking-tighter italic border-b border-zinc-800 pb-2 mb-3">Owner Email</p>
                      <p className="text-[11px] text-zinc-300 font-bold break-words">{prop.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-zinc-600 text-[9px] font-black uppercase tracking-tighter italic border-b border-zinc-800 pb-2 mb-3">Direct Line</p>
                      <p className="text-xs text-zinc-300 font-black">{prop.phone || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- 3. FLYWHEEL: THE STRATEGY ----------------- */}
      {activeTab === "flywheel" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in duration-700">
          <section className="bg-zinc-900/40 border border-zinc-800 p-12 rounded-[4rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Repeat className="w-48 h-48" />
            </div>
            <h2 className="text-[#22c55e] font-black uppercase text-xs mb-12 tracking-[0.3em] flex items-center gap-3">
              <TrendingUp className="w-5 h-5" /> The Flywheel (Rooted Ecosystem)
            </h2>
            <div className="space-y-12 relative z-10">
              {[
                { t: "01. Service Landscaping", d: "Landscaping clients represent established trust. Every lawn serviced is a warm lead for the entire ecosystem." },
                { t: "02. The Rooted Invitation", d: "Invite clients into the Rooted app. They get access to your vetted network of contractors (Siding, Roofing, Windows)." },
                { t: "03. Trimlight Installation", d: "You install Trimlight or refer it. High-ticket revenue + permanent branding for the neighborhood." },
                { t: "04. Neighborhood Network Effect", d: "Every lighted house refers neighbors. Members refer neighbors to Rooted. The density increases exponentially." },
                { t: "05. Multi-Stream Revenue", d: "Direct Sales (Trimlight) + Referral Fees (10-15% on high-ticket) + SaaS Membership fees." }
              ].map((step, i) => (
                <div key={i} className="flex gap-8 group">
                  <span className="text-6xl font-black text-zinc-800 group-hover:text-[#22c55e] transition-colors leading-none">
                    {i+1}
                  </span>
                  <div>
                    <h4 className="text-white font-black uppercase text-lg italic mb-2 tracking-tight group-hover:translate-x-2 transition-transform">{step.t}</h4>
                    <p className="text-zinc-500 text-xs italic leading-relaxed max-w-md">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-[#22c55e]/5 border border-[#22c55e]/20 p-12 rounded-[4rem]">
              <h3 className="text-[#22c55e] font-black uppercase text-[10px] tracking-widest mb-6">Market Positioning</h3>
              <p className="text-4xl font-black italic text-white leading-[1.1] uppercase mb-8">
                "Brandon Fuller - <span className="text-[#22c55e]">Founder's Choice</span> Partner & Property Improvement Specialist"
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { l: "Discount", v: "10-15% Off" },
                  { l: "Priority", v: "Top of List" },
                  { l: "Trust", v: "Personally Vetted" },
                  { l: "Support", v: "24hr Response" }
                ].map((stat, i) => (
                  <div key={i} className="bg-black/40 p-5 rounded-2xl border border-zinc-800">
                    <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">{stat.l}</p>
                    <p className="text-sm font-black text-[#22c55e] uppercase italic">{stat.v}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-zinc-900/40 border border-zinc-800 p-10 rounded-[3rem] flex items-center gap-8">
               <div className="bg-[#22c55e] p-6 rounded-[2rem] text-black">
                 <ShieldCheck className="w-10 h-10" />
               </div>
               <div>
                 <h4 className="text-white font-black uppercase italic text-xl">The Rooted Promise</h4>
                 <p className="text-xs text-zinc-500 italic mt-1">Every contractor in the ecosystem is personally vetted. You stand behind the work personally.</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- 4. PRICING: THE ECONOMICS ----------------- */}
      {activeTab === "pricing" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-700">
          <section className="bg-zinc-900/30 border border-zinc-800 p-12 rounded-[4rem]">
            <h2 className="text-[#22c55e] font-black uppercase text-xs mb-10 tracking-[0.3em] italic flex items-center gap-3">
              <Users className="w-5 h-5" /> Homeowner Membership
            </h2>
            <div className="space-y-6">
              <div className="p-8 bg-black/60 border border-zinc-800 rounded-[2.5rem] group hover:border-[#22c55e]/50 transition-all">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-2xl font-black text-white italic uppercase">Standard</h4>
                  <div className="text-right">
                    <p className="text-3xl font-black text-[#22c55e]">$9.99</p>
                    <p className="text-[10px] text-zinc-600 font-black uppercase">Per Month</p>
                  </div>
                </div>
                <ul className="space-y-3 pt-6 border-t border-zinc-900">
                  <li className="text-[11px] text-zinc-400 italic flex items-center gap-2 font-bold"><CheckCircle2 className="w-3 h-3 text-[#22c55e]" /> ACCESS TO VETTED CONTRACTOR DIRECTORY</li>
                  <li className="text-[11px] text-zinc-400 italic flex items-center gap-2 font-bold"><CheckCircle2 className="w-3 h-3 text-[#22c55e]" /> MEMBER-EXCLUSIVE PRICING (10-15% OFF)</li>
                </ul>
              </div>

              <div className="p-10 bg-[#22c55e]/5 border border-[#22c55e]/30 rounded-[3rem] relative shadow-[0_30px_60px_rgba(34,197,94,0.1)]">
                <div className="absolute -top-4 left-10 bg-[#22c55e] text-black text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Most Valuable</div>
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-3xl font-black text-white italic uppercase leading-none">Premium</h4>
                  <div className="text-right">
                    <p className="text-4xl font-black text-white">$19.99</p>
                    <p className="text-[10px] text-zinc-400 font-black uppercase">Per Month</p>
                  </div>
                </div>
                <ul className="space-y-4 pt-6 border-t border-[#22c55e]/20">
                  <li className="text-xs text-zinc-200 italic flex items-center gap-3 font-black"><Star className="w-4 h-4 text-[#facc15]" /> WHITE-GLOVE CONCIERGE SERVICE</li>
                  <li className="text-xs text-zinc-200 italic flex items-center gap-3 font-black"><Star className="w-4 h-4 text-[#facc15]" /> PRIORITY SCHEDULING (FRONT OF LINE)</li>
                  <li className="text-xs text-zinc-200 italic flex items-center gap-3 font-black"><Star className="w-4 h-4 text-[#facc15]" /> STACKABLE DISCOUNTS ON HIGH-TICKET</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-zinc-900/30 border border-zinc-800 p-12 rounded-[4rem]">
            <h2 className="text-[#22c55e] font-black uppercase text-xs mb-10 tracking-[0.3em] italic flex items-center gap-3">
              <Briefcase className="w-5 h-5" /> Contractor Partnerships
            </h2>
            <div className="space-y-8">
              <div className="bg-black/60 p-8 rounded-[2.5rem] border border-zinc-800">
                <p className="text-[#22c55e] text-[10px] font-black uppercase tracking-widest mb-6 border-b border-zinc-900 pb-4">High-Ticket Referral Model</p>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-4xl font-black text-white italic uppercase tracking-tighter">10-15%</p>
                  <p className="text-right text-xs text-zinc-500 font-black uppercase leading-tight">Project<br/>Value</p>
                </div>
                <p className="text-[10px] text-zinc-500 italic leading-relaxed mt-4">
                  Applied to Roofing, HVAC, Windows, Pools, and Major Remodels. You earn this for every member referred to a partner.
                </p>
              </div>

              <div className="bg-black/60 p-8 rounded-[2.5rem] border border-zinc-800">
                <p className="text-[#22c55e] text-[10px] font-black uppercase tracking-widest mb-6 border-b border-zinc-900 pb-4">Directory Listing Model</p>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-4xl font-black text-white italic uppercase tracking-tighter">$99-299</p>
                  <p className="text-right text-xs text-zinc-500 font-black uppercase leading-tight">Per<br/>Month</p>
                </div>
                <p className="text-[10px] text-zinc-500 italic leading-relaxed mt-4">
                  Applied to high-volume/lower-ticket services like Handymen, Cleaners, and standard Landscapers.
                </p>
              </div>

              <div className="bg-[#facc15]/10 border border-[#facc15]/30 p-8 rounded-[2.5rem] flex items-center gap-6">
                <div className="bg-[#facc15] p-4 rounded-2xl text-black">
                  <Percent className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-white font-black uppercase text-xs italic">Trimlight Exclusive</p>
                   <p className="text-zinc-500 text-[10px] font-bold italic">Featured partner status included with Founder's Choice level.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}