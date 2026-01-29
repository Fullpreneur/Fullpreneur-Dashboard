"use client";
import { useState, useEffect } from "react";
import { 
  Zap, Plus, CheckCircle2, Trash2, Mic2, AlertCircle, ChevronRight, BarChart3, Target
} from "lucide-react";

interface Task { id: number; text: string; completed: boolean; }
interface Lead { id: number; name: string; interest: string; }

export default function DominionCommand() {
  const [activeTab, setActiveTab] = useState("negotiation");
  const [newTask, setNewTask] = useState("");
  const [newLead, setNewLead] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem("dominion_tasks");
    const savedLeads = localStorage.getItem("dominion_leads");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedLeads) setLeads(JSON.parse(savedLeads));
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("dominion_tasks", JSON.stringify(tasks));
      localStorage.setItem("dominion_leads", JSON.stringify(leads));
    }
  }, [tasks, leads, isMounted]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const addLead = () => {
    if (newLead.trim()) {
      setLeads([...leads, { id: Date.now(), name: newLead, interest: "Prospect" }]);
      setNewLead("");
    }
  };

  if (!isMounted) return <div className="bg-black min-h-screen" />;

  return (
    <div className="p-10 space-y-8 bg-black min-h-screen text-white font-sans">
      <header className="flex justify-between items-end border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic text-glow text-white">Dominion Raceway</h1>
          <p className="text-[#facc15] font-bold tracking-[0.3em] text-xs mt-2 uppercase italic">Tuesday Week 2 Execution</p>
        </div>
      </header>

      {/* TABS */}
      <div className="flex gap-4 border-b border-zinc-900 pb-4">
        {["negotiation", "duty-tracker", "execution-pulse", "leads"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? "bg-[#facc15] text-black shadow-[0_0_20px_rgba(250,204,21,0.4)]" : "bg-zinc-900 text-zinc-500"
            }`}
          >
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* 1. NEGOTIATION HUB - FULL UNABRIDGED SCRIPT */}
      {activeTab === "negotiation" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in">
          <div className="lg:col-span-3 space-y-6">
            <section className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl">
              <h2 className="text-[#facc15] font-black uppercase text-xs tracking-widest flex items-center gap-2 mb-6">
                <Mic2 className="w-4 h-4" /> COMPLETE NEGOTIATION SCRIPT
              </h2>
              <div className="bg-black/80 p-8 rounded-2xl border border-zinc-800 h-[700px] overflow-y-auto space-y-10 text-sm leading-relaxed text-zinc-300">
                
                <div className="space-y-4">
                  <p className="text-white font-bold italic text-lg leading-snug">
                    "[Boss], thanks for taking the time to meet. I want to have an important conversation about my role here at Dominion and some projects I'm working on. I've prepared some thoughts, and I'd love your input."
                  </p>
                </div>

                <div className="space-y-2 border-l-2 border-[#facc15] pl-6 italic">
                  <p className="text-[#facc15] font-black text-[10px] uppercase mb-2">What I love about working here:</p>
                  <p>• I'm passionate about racing and this community</p>
                  <p>• I love announcing - it's one of the highlights of my week</p>
                  <p>• I'm proud of what we've built with our diversified event model</p>
                  <p>• I've learned an incredible amount working across all our businesses</p>
                </div>

                <div className="space-y-4 bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800">
                  <p className="font-bold text-white uppercase text-xs mb-3 underline">1) My Current Scope:</p>
                  <p className="text-xs italic mb-4">"I've documented my responsibilities over the past month. Currently, I'm handling:"</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-[11px] text-zinc-400 font-medium">
                    <li>• Marketing Director duties (all content, social media, advertising, website)</li>
                    <li>• Live stream production for Saturday races</li>
                    <li>• Track announcer</li>
                    <li>• Social media for 118 Bar & Grill, Road Course, No Prep, Groove Music Hall</li>
                    <li>• Press releases and media relations</li>
                    <li>• All printed materials design and coordination</li>
                    <li>• Ticketing platform management (all levels)</li>
                    <li>• Sponsor fulfillment and interfacing</li>
                    <li>• Suite guest relations</li>
                    <li>• Customer service (most complex questions route to me)</li>
                    <li>• Digital signage maintenance</li>
                    <li>• Various operational tasks (food prep, bar-back, IT issues as needed)</li>
                    <li>• Strategic conversations: Available 7am-11pm most days</li>
                  </ul>
                  <div className="pt-4 mt-4 border-t border-zinc-800 text-white italic space-y-1">
                    <p>Market research for these roles:</p>
                    <p>• Marketing Director alone: $65k-75k</p>
                    <p>• Content Creator/Social Media Manager: $45k-55k</p>
                    <p>• Live Stream Producer: $40k-50k</p>
                    <p className="text-[#facc15] font-bold mt-2">I'm currently at $50k base, which means I'm providing significant value beyond my compensation.</p>
                  </div>
                </div>

                <div className="space-y-4 border-l-2 border-zinc-700 pl-6">
                  <p className="font-bold text-white uppercase text-xs">2) Projects I'm Building (Transparency):</p>
                  <div className="space-y-4 text-xs text-zinc-300">
                    <p><strong>AlliO</strong> - Facility management SaaS for entertainment venues. I'm using Dominion as my pilot to understand real operational pain points. If successful, it could modernize the industry.</p>
                    <p><strong>Rooted</strong> - A local homeowner and business platform that connects residents with vetted contractors and local services.</p>
                    <p><strong>Octane Nation</strong> - A fan community platform for motorsports. Could enhance engagement for venues like ours.</p>
                    <p><strong>SBA 7(a) Loans</strong> - Helping businesses secure funding, which has proven to be a valuable service with good income potential.</p>
                  </div>
                  <p className="text-zinc-500 italic text-[11px] mt-4">Reason for sharing: Transparency (no surprises), Opportunity (benefit to Dominion), and Alignment.</p>
                </div>

                <div className="space-y-6">
                  <p className="font-bold text-white uppercase text-xs">3) What I'm Proposing:</p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-zinc-900 border border-[#facc15]/30 rounded-xl">
                      <p className="text-[#facc15] font-black text-[10px] uppercase mb-1">Option A: Compensation Alignment</p>
                      <p className="text-sm font-bold">$75,000 base salary + 15% commission on sponsorships I bring in over $15,000 annually</p>
                    </div>
                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <p className="text-white font-black text-[10px] uppercase mb-1">Option B: Reduced Hours</p>
                      <p className="text-sm">30 hours/week at my current $50,000 salary (Eff. $32/hr)</p>
                    </div>
                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <p className="text-zinc-500 font-black text-[10px] uppercase mb-1">Option C: Strategic Partnership</p>
                      <p className="text-sm text-zinc-400">Dominion takes 5-10% equity in AlliO in exchange for continued development using our ops as pilot.</p>
                    </div>
                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <p className="text-zinc-500 font-black text-[10px] uppercase mb-1">Option D: Part-time Transition (6+ months out)</p>
                      <p className="text-sm text-zinc-400">Transition if other platforms reach revenue threshold; keep announcer role.</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-red-900/10 border border-red-900/30 rounded-2xl">
                   <p className="text-red-500 font-black uppercase text-[10px] mb-2 italic underline">What I'm NOT proposing:</p>
                   <p className="text-xs italic text-zinc-400">Leaving Dominion immediately, letting work quality slip, competing with Dominion, or taking action that harms the business.</p>
                </div>

                <div className="pt-6 border-t border-zinc-800 text-white font-bold italic text-lg">
                  "I'm curious: What are your thoughts? What concerns do you have? What would work best for Dominion?"
                </div>
              </div>
            </section>
          </div>

          {/* BATTLE CARD / REBUTTALS */}
          <div className="space-y-6">
            <section className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl">
              <h3 className="text-red-500 font-black text-[10px] uppercase mb-4 flex items-center gap-2 italic"><AlertCircle className="w-4 h-4" /> REBUTTALS</h3>
              <div className="space-y-6 text-[11px] italic text-zinc-300">
                <p><strong className="text-white">"Can't afford $75k"</strong><br/>"I understand. What about Option B - reduced hours? Or $60k base plus commission?"</p>
                <p><strong className="text-white">"Conflicts of interest"</strong><br/>"What specific boundaries would make you comfortable? I'm happy to put agreements in writing."</p>
                <p><strong className="text-white">"Choose between us"</strong><br/>"Can I ask for 60-90 days to think about that and see where my projects are? I don't want to leave you in a lurch."</p>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* 2. DUTY TRACKER - FULL VERBATIM LIST */}
      {activeTab === "duty-tracker" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
          <section className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl">
            <h2 className="text-[#facc15] font-black uppercase text-xs mb-6 underline">Duty Audit (To Systemize/Offload)</h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { title: "Marketing & Digital", items: ["Marketing Director Duties (Content, Social, Ads, Web)", "Social Media for 118 Bar, Road Course, No Prep, Groove Music Hall", "Digital Signage Maintenance", "Website/Ticketing Management"] },
                { title: "Production & Media", items: ["Live Stream Production (Saturday Races)", "Track Announcer", "Press Releases & Media Relations", "Printed Materials Coordination"] },
                { title: "Ops & Guest Relations", items: ["Sponsor Fulfillment & Interfacing", "Suite Guest Relations", "Complex Customer Service", "Operational Tasks (Food prep, bar-back, IT issues)"] }
              ].map(group => (
                <div key={group.title} className="p-4 bg-black border border-zinc-800 rounded-2xl">
                  <p className="text-[#facc15] font-black text-[10px] uppercase mb-2">{group.title}</p>
                  <ul className="space-y-1 text-[11px] text-zinc-400">
                    {group.items.map(i => <li key={i}>• {i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          <div className="bg-[#facc15]/5 border border-[#facc15]/20 p-8 rounded-3xl flex flex-col justify-center text-center">
             <Target className="w-8 h-8 text-[#facc15] mx-auto mb-4" />
             <h3 className="text-[#facc15] font-black uppercase text-xs">Capacity Target</h3>
             <p className="text-6xl font-black text-white italic underline">30 HR</p>
             <p className="text-[10px] text-zinc-500 uppercase font-bold mt-4 tracking-widest italic">Weekly Manual Work Limit</p>
          </div>
        </div>
      )}

      {/* 3. EXECUTION PULSE & 4. LEADS (PERSISTENT DATA) */}
      {activeTab === "execution-pulse" && (
        <section className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl">
          <h2 className="text-[#facc15] font-black uppercase text-xs mb-6">Hit-List (Auto-Saves)</h2>
          <div className="flex gap-4 mb-8">
            <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Add goal..." className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 text-sm outline-none" />
            <button onClick={addTask} className="bg-[#facc15] text-black px-6 py-2 rounded-xl font-black text-xs uppercase">Save</button>
          </div>
          <div className="space-y-2">
            {tasks.map(t => (
              <div key={t.id} className="flex justify-between p-4 bg-black border border-zinc-800 rounded-xl">
                <span className={`text-sm ${t.completed ? 'line-through text-zinc-600' : ''}`}>{t.text}</span>
                <button onClick={() => setTasks(tasks.filter(x => x.id !== t.id))}><Trash2 className="w-4 h-4 text-zinc-700" /></button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "leads" && (
        <section className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl">
          <h2 className="text-[#facc15] font-black uppercase text-xs mb-6 underline">Magnet CRM: Lead Capture</h2>
          <div className="flex gap-4 mb-8">
            <input type="text" value={newLead} onChange={(e) => setNewLead(e.target.value)} placeholder="Lead Name..." className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 text-sm outline-none" />
            <button onClick={addLead} className="bg-[#facc15] text-black px-6 py-2 rounded-xl font-black text-xs uppercase">Capture</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leads.map(l => (
              <div key={l.id} className="p-4 bg-black border border-zinc-800 rounded-xl flex justify-between">
                <span className="text-sm font-bold uppercase">{l.name}</span>
                <Zap className="text-[#facc15] w-4 h-4" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}