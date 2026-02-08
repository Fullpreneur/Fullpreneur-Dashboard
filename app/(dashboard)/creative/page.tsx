"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client"; // FIXED: Correct absolute path
import { 
  Palette, Music, Globe, Plus, Star, Zap, ArrowLeft, Sparkles, 
  Brain, X, Trash2, Calendar, PenTool, Save, Cpu, Layout, 
  ImageIcon, Terminal, Linkedin, Rocket, Instagram, Copy, 
  Fingerprint, ExternalLink, ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export default function CreativeSpace() {
  // INITIALIZE SUPABASE CLIENT
  const supabase = createClient();

  // --- FULFILLMENT STATE ---
  const [entries, setEntries] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newEntry, setNewEntry] = useState({
    title: "", pillar: "Creative", category: "Art", rating: 5,
    date: new Date().toISOString().split('T')[0]
  });

  // --- SCRATCHPAD STATE (THE FIX) ---
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  // --- 1. INITIAL LOAD ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // 1. Fetch Fulfillment Logs
      const { data: appts } = await supabase
        .from('appointments')
        .select('*')
        .eq('pillar', 'Creative')
        .order('date', { ascending: false });
      if (appts) setEntries(appts);

      // 2. Fetch Persistent Scratchpad (Targeting ID 1)
      const { data: pad, error } = await supabase
        .from('scratchpad')
        .select('content')
        .eq('id', 1)
        .single();
      
      if (pad) setNote(pad.content);
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  // --- 2. AUTO-SAVE LOGIC ---
  const triggerSave = async (currentContent: string) => {
    setIsSaving(true);
    const { error } = await supabase
      .from('scratchpad')
      .upsert({ id: 1, content: currentContent, updated_at: new Date() });
    
    if (error) console.error("Scratchpad Save Error:", error);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNote(val);

    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      triggerSave(val);
    }, 2000);
  };

  // --- 3. FULFILLMENT LOGIC ---
  const handleLogFulfillment = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase.from('appointments').insert([{
      title: `${newEntry.category}: ${newEntry.title}`,
      pillar: "Creative",
      date: newEntry.date,
      time: "Logged",
    }]).select();

    if (data) {
      setEntries([data[0], ...entries]);
      setIsModalOpen(false);
      setNewEntry({ ...newEntry, title: "", category: "Art" });
    }
  };

  const deleteEntry = async (id: number) => {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (!error) setEntries(entries.filter(e => e.id !== id));
  };

  const categories = [
    { name: "Art", icon: Palette, color: "#a855f7", current: entries.filter(e => e.title?.includes("Art")).length },
    { name: "Music", icon: Music, color: "#3b82f6", current: entries.filter(e => e.title?.includes("Music")).length },
    { name: "Travel", icon: Globe, color: "#22c55e", current: entries.filter(e => e.title?.includes("Travel")).length },
    { name: "Mind", icon: Brain, color: "#facc15", current: entries.filter(e => e.title?.includes("Mind")).length },
  ];

  return (
    <div className="p-8 bg-[#020202] min-h-screen text-white font-sans selection:bg-[#a855f7]/30">
      
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-8">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-5 bg-zinc-900/50 rounded-[1.5rem] border border-zinc-800 hover:border-[#a855f7] transition-all group backdrop-blur-md">
            <ArrowLeft className="w-6 h-6 text-zinc-500 group-hover:text-[#a855f7]" />
          </Link>
          <div>
            <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">
              CREATIVE <span className="text-zinc-800 uppercase">Space</span>
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="bg-[#a855f7]/10 px-3 py-1 rounded border border-[#a855f7]/20">
                <p className="text-[#a855f7] font-black tracking-[0.4em] text-[10px] uppercase italic">EXECUTION HUB</p>
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-[#a855f7] transition-all flex items-center gap-3 shadow-2xl">
          <Plus className="w-4 h-4" /> Log Fulfillment
        </button>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        {categories.map((cat, i) => (
          <div key={i} className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2.5rem] relative group transition-all">
            <div className="flex justify-between items-start">
              <div className="p-4 bg-black/50 rounded-2xl border border-zinc-800">
                <cat.icon className="w-8 h-8" style={{ color: cat.color }} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-zinc-600 uppercase italic">Weekly</p>
                <p className="text-2xl font-black italic">{cat.current} / 1</p>
              </div>
            </div>
            <h3 className="mt-8 text-xl font-black uppercase italic tracking-tight">{cat.name}</h3>
            <div className="mt-4 h-1 w-full bg-black/50 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-1000" style={{ backgroundColor: cat.color, width: cat.current >= 1 ? '100%' : '15%' }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* LEFT: THE FUNCTIONAL SCRATCHPAD */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-zinc-900/20 border border-zinc-800 rounded-[3rem] p-10 relative group shadow-2xl">
            <div className="flex justify-between items-center mb-8 px-4">
              <div className="flex items-center gap-4">
                <PenTool className="text-[#a855f7] w-6 h-6" />
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">IDEATION <span className="text-zinc-800">Scratchpad</span></h2>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-[#a855f7] animate-pulse' : 'bg-zinc-800'}`}></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  {isSaving ? "Syncing..." : "Saved to Cloud"}
                </span>
              </div>
            </div>
            <textarea 
              value={note}
              onChange={handleNoteChange}
              placeholder="Dump raw concepts here. Autosaves on stop..."
              className="w-full h-[500px] bg-transparent border-none text-2xl font-bold text-zinc-300 placeholder:text-zinc-900 outline-none resize-none leading-relaxed px-4"
            />
          </div>

          {/* ACTIVITY ARCHIVE */}
          <div className="bg-zinc-900/10 border border-zinc-800 rounded-[3rem] p-10">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-10">Activity <span className="text-zinc-800">Archive</span></h2>
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="group bg-black/40 border border-zinc-800/50 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-zinc-600 transition-all">
                  <div className="flex items-center gap-8">
                    <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 text-[#a855f7]"><Sparkles className="w-6 h-6" /></div>
                    <div>
                      <p className="text-2xl font-black italic uppercase tracking-tighter leading-none mb-2">{entry.title}</p>
                      <p className="text-[10px] font-black text-zinc-600 uppercase italic tracking-widest">{entry.date}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteEntry(entry.id)} className="p-4 text-zinc-800 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: TOOLS & IDENTITY */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* TOOL DOCK */}
          <div className="bg-zinc-900/10 border border-zinc-800 rounded-[3.5rem] p-10 shadow-xl">
            <h3 className="font-black uppercase italic tracking-widest text-xs text-zinc-500 mb-8 flex items-center gap-3">
              <Cpu className="w-4 h-4 text-[#a855f7]"/> Power Tool Dock
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Canva", url: "https://canva.com", icon: Layout },
                { name: "Claude", url: "https://claude.ai", icon: Sparkles },
                { name: "Perplexity", url: "https://perplexity.ai", icon: Globe },
                { name: "ElevenLabs", url: "https://elevenlabs.io", icon: Zap },
              ].map((tool) => (
                <a key={tool.name} href={tool.url} target="_blank" className="bg-black/60 border border-zinc-800 p-6 rounded-3xl flex flex-col gap-4 hover:border-[#a855f7] transition-all group">
                  <tool.icon className="w-6 h-6 text-zinc-700 group-hover:text-white" />
                  <span className="font-black uppercase text-[10px] italic tracking-widest">{tool.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* SOCIAL HUB */}
          <div className="bg-zinc-900/10 border border-zinc-800 rounded-[3.5rem] p-10">
            <h3 className="font-black uppercase italic tracking-widest text-xs text-zinc-500 mb-8 flex items-center gap-3">
              <Fingerprint className="w-4 h-4 text-[#a855f7]"/> Identity Hub
            </h3>
            <div className="space-y-6">
              {[
                { platform: "LinkedIn", handle: "/in/fullpreneur", bio: "Engineering Business Pillars | AI Strategy" },
                { platform: "Octane Nation", handle: "@MasterCommand", bio: "The high-performance ecosystem for execution." },
              ].map((social) => (
                <div key={social.platform} className="p-6 bg-black border border-zinc-900 rounded-3xl group">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-black text-[10px] uppercase italic tracking-widest text-[#a855f7]">{social.platform}</span>
                    <button onClick={() => navigator.clipboard.writeText(social.bio)} className="text-zinc-800 hover:text-white transition-all"><Copy className="w-4 h-4"/></button>
                  </div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">{social.handle}</p>
                  <p className="text-sm font-bold text-zinc-400 italic leading-snug">{social.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[500] flex items-center justify-center p-6">
          <form onSubmit={handleLogFulfillment} className="bg-zinc-900 border border-zinc-800 p-16 rounded-[4rem] max-w-2xl w-full">
            <div className="flex justify-between items-start mb-12">
              <h2 className="text-5xl font-black italic uppercase tracking-tighter">Log <span className="text-[#a855f7]">Fulfillment</span></h2>
              <button type="button" onClick={() => setIsModalOpen(false)}><X className="text-zinc-600 hover:text-white" /></button>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                {['Art', 'Music', 'Travel', 'Mind'].map(c => (
                  <button key={c} type="button" onClick={() => setNewEntry({...newEntry, category: c})}
                    className={`p-6 rounded-2xl font-black uppercase text-[10px] tracking-widest border transition-all ${newEntry.category === c ? 'bg-[#a855f7] border-[#a855f7] text-white shadow-lg' : 'bg-black border-zinc-800 text-zinc-500'}`}
                  >
                    {c} Cycle
                  </button>
                ))}
              </div>
              <input required placeholder="Session Description..." className="w-full bg-black border border-zinc-800 p-8 rounded-3xl outline-none focus:border-[#a855f7] text-white text-xl font-bold italic"
                value={newEntry.title} onChange={e => setNewEntry({...newEntry, title: e.target.value})}
              />
              <button className="w-full bg-white text-black py-8 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[12px] hover:bg-[#a855f7] transition-all">
                Initialize Rejuvenation Cycle
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}