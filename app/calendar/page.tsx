"use client";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "./supabase";
import { 
  ChevronLeft, ChevronRight, Plus, X, 
  ArrowLeft, Trash2, Target, Calendar 
} from "lucide-react";
import Link from "next/link";

export default function MasterCalendar() {
  // --- 1. CORE STATE ---
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [viewDate, setViewDate] = useState(new Date(2026, 0, 19));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState("All");
  const [appointments, setAppointments] = useState<any[]>([]);

  // --- 2. EDITING/FORM STATE ---
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formState, setFormState] = useState({ 
    title: "", time: "09:00", day: 19, pillar: "SBA", contact: "", is_lead: false 
  });

  // --- 3. DATABASE ACTIONS ---
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const { data, error } = await supabase.from('appointments').select('*');
    if (!error && data) setAppointments(data);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormState({ 
      title: "", 
      time: "09:00", 
      day: viewDate.getDate(), 
      pillar: "SBA", 
      contact: "", 
      is_lead: false 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (appt: any) => {
    // Correctly parse the date from Postgres YYYY-MM-DD
    const dateParts = appt.date.split('-');
    const dayValue = parseInt(dateParts[2]);
    
    setEditingId(appt.id);
    setFormState({
      title: appt.title,
      time: appt.time,
      day: dayValue,
      pillar: appt.pillar,
      contact: appt.contact || "",
      is_lead: appt.is_lead
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDate = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(formState.day).padStart(2, '0')}`;
    
    const payload = { 
      title: formState.title, 
      time: formState.time, 
      pillar: formState.pillar, 
      date: formattedDate,
      contact: formState.contact,
      is_lead: formState.is_lead 
    };

    if (editingId) {
      const { error } = await supabase.from('appointments').update(payload).eq('id', editingId);
      if (!error) {
        setAppointments(prev => prev.map(a => a.id === editingId ? { ...a, ...payload } : a));
      }
    } else {
      const { data, error } = await supabase.from('appointments').insert([payload]).select();
      if (data) setAppointments(prev => [...prev, ...data]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (!error) {
      setAppointments(prev => prev.filter(a => a.id !== id));
      setIsModalOpen(false);
    }
  };

  // --- 4. CALENDAR ENGINE LOGIC ---
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // Weekly View Logic
  const startOfWeek = new Date(viewDate);
  startOfWeek.setDate(viewDate.getDate() - viewDate.getDay());
  const weekDaysArray = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const navigate = (direction: number) => {
    const next = new Date(viewDate);
    if (viewMode === "month") next.setMonth(viewDate.getMonth() + direction);
    else next.setDate(viewDate.getDate() + (direction * 7));
    setViewDate(next);
  };

  const filteredAppts = useMemo(() => {
    return appointments.filter(a => selectedPillar === "All" || a.pillar === selectedPillar);
  }, [appointments, selectedPillar]);

  return (
    <div className="p-8 bg-[#050505] min-h-screen text-white font-sans selection:bg-[#facc15]/30">
      
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition-all">
            <ArrowLeft className="w-6 h-6 text-zinc-500" />
          </Link>
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
              MASTER <span className="text-zinc-800 uppercase">Timeline</span>
            </h1>
            <p className="text-[#facc15] font-black text-[10px] uppercase tracking-[0.4em] mt-2 italic">Strategic Execution Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 flex gap-1 shadow-inner">
            <button onClick={() => setViewMode("month")} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === "month" ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"}`}>Month</button>
            <button onClick={() => setViewMode("week")} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === "week" ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"}`}>Week</button>
          </div>
          <button onClick={openAddModal} className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-[#facc15] transition-all flex items-center gap-3">
            <Plus className="w-4 h-4" /> Add Entry
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2.5rem]">
            <p className="text-[10px] font-black text-zinc-600 uppercase mb-6 tracking-widest italic text-center">Execution Pillars</p>
            <div className="space-y-2">
              {["All", "SBA", "Dominion", "AlliO", "Property", "Personal", "Creative"].map(p => (
                <button key={p} onClick={() => setSelectedPillar(p)} className={`w-full p-4 rounded-xl flex justify-between items-center transition-all border ${selectedPillar === p ? 'bg-[#facc15] text-black border-[#facc15]' : 'bg-black/40 text-zinc-500 border-zinc-800 hover:border-zinc-600'}`}>
                  <span className="text-[10px] font-black uppercase italic tracking-widest">{p}</span>
                  <span className="text-[10px] font-bold opacity-30">{appointments.filter(a => a.pillar === p || p === "All").length}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CALENDAR GRID */}
        <div className="lg:col-span-9 bg-zinc-900/10 border border-zinc-800 rounded-[4rem] p-10 shadow-2xl relative min-h-[700px]">
          <div className="flex justify-between items-center mb-10 px-4">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">
              {viewMode === "month" ? `${monthName} ` : "Week Of "} 
              <span className="text-zinc-800">{viewMode === "month" ? year : `${viewDate.getDate()} ${monthName}`}</span>
            </h2>
            <div className="flex gap-4">
              <button onClick={() => navigate(-1)} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:text-[#facc15] transition-all"><ChevronLeft/></button>
              <button onClick={() => setViewDate(new Date())} className="px-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase">Today</button>
              <button onClick={() => navigate(1)} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:text-[#facc15] transition-all"><ChevronRight/></button>
            </div>
          </div>

          {viewMode === "month" ? (
            <div className="grid grid-cols-7 gap-px bg-zinc-800/50 border border-zinc-800/50 rounded-[2rem] overflow-hidden">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(wd => (
                <div key={wd} className="bg-zinc-900/50 py-5 text-center text-[10px] font-black text-zinc-600 tracking-[0.3em] uppercase">{wd}</div>
              ))}
              {paddingDays.map(b => <div key={`blank-${b}`} className="bg-[#050505]/40 min-h-[150px]" />)}
              {daysArray.map(d => {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const dayAppts = filteredAppts.filter(a => a.date === dateStr);
                const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
                return (
                  <div key={d} className={`min-h-[150px] bg-[#050505] p-4 border-r border-b border-zinc-900/50 group relative ${isToday ? "bg-[#facc15]/5" : ""}`}>
                    <span className={`text-xs font-black italic ${isToday ? "text-[#facc15]" : "text-zinc-800"}`}>{d < 10 ? `0${d}` : d}</span>
                    <div className="mt-3 space-y-1.5 relative z-10 text-white">
                      {dayAppts.map(a => (
                        <button 
                          key={a.id} 
                          onClick={() => openEditModal(a)}
                          className={`w-full text-left flex justify-between items-center text-[8px] font-black uppercase p-2 rounded truncate border-l-2 bg-zinc-900 shadow-lg hover:bg-zinc-800 transition-all ${a.is_lead ? 'border-[#00f2ff]' : 'border-zinc-800'} text-zinc-400`}
                        >
                          <span className="truncate">{a.time} | {a.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-4">
              {weekDaysArray.map((dateObj, idx) => {
                const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
                const dayAppts = filteredAppts.filter(a => a.date === dateStr);
                return (
                  <div key={idx} className="bg-zinc-900/20 border-t-4 border-zinc-800 p-6 rounded-3xl min-h-[500px]">
                    <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <p className="text-2xl font-black italic mb-6">{dateObj.getDate()}</p>
                    <div className="space-y-3">
                      {dayAppts.map(a => (
                        <button 
                          key={a.id} 
                          onClick={() => openEditModal(a)}
                          className={`w-full text-left group/item flex flex-col p-4 rounded-2xl border-l-4 ${a.is_lead ? 'border-[#00f2ff]' : 'border-zinc-700'} bg-black/40 shadow-xl hover:bg-zinc-900 transition-all`}
                        >
                          <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">{a.time}</p>
                          <p className="text-xs font-black italic uppercase leading-tight text-white">{a.title}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL FORM (Handles Add & Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200] flex items-center justify-center p-6">
          <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 p-12 rounded-[4rem] max-w-2xl w-full shadow-2xl">
            <div className="flex justify-between items-start mb-10">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
                {editingId ? "Edit" : "Schedule"}<br/><span className="text-zinc-700">Timeline Entry</span>
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)}><X className="w-8 h-8 text-zinc-600 hover:text-white transition-colors" /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <input required value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} className="col-span-2 bg-black border border-zinc-800 p-6 rounded-2xl text-sm font-bold focus:border-[#facc15] outline-none text-white transition-all" placeholder="Entry Title" />
              <select value={formState.day} onChange={e => setFormState({...formState, day: parseInt(e.target.value)})} className="bg-black border border-zinc-800 p-6 rounded-2xl text-sm font-bold text-white outline-none focus:border-[#facc15]">
                {daysArray.map(d => <option key={d} value={d}>The {d}th</option>)}
              </select>
              <input required type="time" value={formState.time} onChange={e => setFormState({...formState, time: e.target.value})} className="bg-black border border-zinc-800 p-6 rounded-2xl text-sm font-bold text-white outline-none focus:border-[#facc15]" />
              <select value={formState.pillar} onChange={e => setFormState({...formState, pillar: e.target.value})} className="col-span-2 bg-black border border-zinc-800 p-6 rounded-2xl text-sm font-black italic text-[#facc15] outline-none">
                {["SBA", "Dominion", "AlliO", "Property", "Personal", "Creative"].map(p => (
                   <option key={p} value={p}>{p.toUpperCase()} PILLAR</option>
                ))}
              </select>
            </div>

            <div className="mt-8 flex items-center justify-between p-6 bg-black border border-zinc-800 rounded-3xl">
              <div className="flex items-center gap-4 text-white">
                <Target className={`w-4 h-4 ${formState.is_lead ? 'text-[#00f2ff]' : 'text-zinc-600'}`} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Lead Vault Sync</p>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase italic">Tag as Revenue Lead</p>
                </div>
              </div>
              <button type="button" onClick={() => setFormState({ ...formState, is_lead: !formState.is_lead })} className={`w-14 h-7 rounded-full relative transition-all ${formState.is_lead ? 'bg-[#00f2ff]' : 'bg-zinc-800'}`}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${formState.is_lead ? 'left-8' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex gap-4 mt-10">
              {editingId && (
                <button type="button" onClick={() => handleDelete(editingId)} className="flex-1 bg-zinc-900 border border-red-900/50 text-red-500 py-8 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[12px] hover:bg-red-500 hover:text-white transition-all">
                  Delete
                </button>
              )}
              <button type="submit" className="flex-[2] bg-white text-black py-8 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[12px] hover:bg-[#facc15] transition-all">
                {editingId ? "Update Entry" : "Lock into Timeline"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}