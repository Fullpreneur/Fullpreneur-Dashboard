"use client";
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Check, Download, Users, 
  Brain, Terminal, Target, Zap, Activity, Fingerprint 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { createClient } from '@/lib/supabase/client';

const DiscoveryForm = () => {
  const router = useRouter();
  const supabase = createClient();
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<any>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [allResponses, setAllResponses] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState('form');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Replaced window.storage with standard localStorage for the Pro Fix
      const submittedStatus = localStorage.getItem('questionnaire_submitted');
      if (submittedStatus === 'true') {
        setIsSubmitted(true);
      }
      const savedProgress = localStorage.getItem('questionnaire_progress');
      if (savedProgress) {
        setResponses(JSON.parse(savedProgress));
      }
      await loadAllResponses();
    } catch (error) {
      console.log('No saved data found');
    }
    setIsLoading(false);
  };

  const loadAllResponses = async () => {
    try {
      // In the Pro Fix, we fetch from Supabase instead of window.storage
      const { data, error } = await supabase
        .from('revenue_goals')
        .select('*')
        .order('updated_at', { ascending: false });
        
      if (data) {
        setAllResponses(data);
      }
    } catch (error) {
      console.log('No responses found yet');
    }
  };

  const sections = [
    {
      title: "Part 1: Your Current Reality",
      subtitle: "The numbers and truth - 15 minutes",
      questions: [
        { id: 'q1', label: 'Current annual income (all sources)', type: 'currency', placeholder: '$50,000' },
        { id: 'q2', label: 'Hours worked per week (total)', type: 'number', placeholder: '40' },
        { id: 'q3', label: 'Your actual $/hour (we\'ll calculate this)', type: 'calculated', calculation: (r: any) => {
          const income = parseFloat(r.q1?.replace(/[$,]/g, '') || 0);
          const hours = parseFloat(r.q2 || 0);
          return hours > 0 ? `$${(income / 52 / hours).toFixed(2)}` : '$0';
        }},
        { id: 'q4', label: 'Target annual income in 18 months', type: 'currency', placeholder: '$100,000' },
        { id: 'q5', label: 'Monthly survival number (minimum expenses)', type: 'currency', placeholder: '$4,000' },
        { id: 'q6', label: 'On a scale of 1-10, how satisfied are you with your current situation?', type: 'scale', min: 1, max: 10 },
        { id: 'q7', label: 'What\'s the ONE thing you\'d change if you could?', type: 'textarea' },
        { id: 'q8', label: 'How many hours per week could you work for 90 days?', type: 'number', placeholder: '60' },
        { id: 'q9', label: 'What are you NOT willing to sacrifice?', type: 'textarea' }
      ]
    },
    {
      title: "Part 2: Your Assets & Advantages",
      subtitle: "What you already have - 10 minutes",
      questions: [
        { id: 'q10', label: 'What do you already do that generates income?', type: 'textarea' },
        { id: 'q11', label: 'What could you sell/do tomorrow that people would pay for?', type: 'textarea' },
        { id: 'q12', label: 'What\'s the "easiest sale" you\'ve ever made?', type: 'textarea' },
        { id: 'q13', label: 'Who already trusts you professionally?', type: 'textarea' },
        { id: 'q14', label: 'What do you know that most people don\'t?', type: 'textarea' }
      ]
    },
    {
      title: "Part 3: Revenue Stream Analysis",
      subtitle: "Evaluating your opportunities - 20 minutes",
      questions: [
        { id: 'q15_streams', label: 'List your potential revenue streams', type: 'streamlist' },
        { id: 'q15', label: 'Which stream should you start FIRST?', type: 'text' },
        { id: 'q15_why1', label: 'Why first?', type: 'textarea' },
        { id: 'q16', label: 'Which stream should you start SECOND?', type: 'text' },
        { id: 'q16_why2', label: 'Why second?', type: 'textarea' },
        { id: 'q17', label: 'Which stream could feed customers to another stream?', type: 'textarea' }
      ]
    },
    {
      title: "Part 4: 90-Day Gameplan",
      subtitle: "Your roadmap - 15 minutes",
      questions: [
        { id: 'q18', label: 'Month 1 revenue target', type: 'currency' },
        { id: 'q19', label: 'What MUST be launched by Day 30?', type: 'textarea' },
        { id: 'q20', label: 'Who are your first 5-10 customers/clients?', type: 'textarea' },
        { id: 'q21', label: 'Month 3 revenue target', type: 'currency' },
        { id: 'q22', label: 'Month 3 recurring monthly revenue', type: 'currency' },
        { id: 'q23', label: 'What will you have validated by Month 3?', type: 'textarea' },
        { id: 'q24', label: 'Weekly time allocation (must total 168 hours)', type: 'timebudget' }
      ]
    },
    {
      title: "Part 5: Your First Week",
      subtitle: "Making it real - 15 minutes",
      questions: [
        { id: 'q25', label: 'Monday - Top 3 priorities', type: 'list3', placeholder: 'Priority' },
        { id: 'q26', label: 'Tuesday - Top 3 priorities', type: 'list3', placeholder: 'Priority' },
        { id: 'q27', label: 'Wednesday - Top 3 priorities', type: 'list3', placeholder: 'Priority' },
        { id: 'q28', label: 'Thursday - Top 3 priorities', type: 'list3', placeholder: 'Priority' },
        { id: 'q29', label: 'Friday - Top 3 priorities', type: 'list3', placeholder: 'Priority' },
        { id: 'q30', label: 'Weekend planning', type: 'textarea' }
      ]
    },
    {
      title: "Part 6: Critical Decisions",
      subtitle: "Strategy and risk - 10 minutes",
      questions: [
        { id: 'q32', label: 'Do you need a compensation conversation?', type: 'yesno' },
        { id: 'q33', label: 'If yes, what are you asking for?', type: 'textarea' },
        { id: 'q34', label: 'At what monthly revenue could you leave your job?', type: 'currency' },
        { id: 'q35', label: 'What could generate $500-1,000 THIS WEEK?', type: 'textarea' },
        { id: 'q36', label: 'Who can you contact TODAY? (3 names)', type: 'list3', placeholder: 'Contact' },
        { id: 'q37', label: 'What\'s your biggest risk?', type: 'textarea' },
        { id: 'q38', label: 'What\'s your backup plan?', type: 'textarea' }
      ]
    },
    {
      title: "Part 7: Tracking & Accountability",
      subtitle: "Measurement system - 5 minutes",
      questions: [
        { id: 'q39', label: 'What 3 metrics will you track daily?', type: 'list3', placeholder: 'Metric' },
        { id: 'q40', label: 'What 3 metrics will you track weekly?', type: 'list3', placeholder: 'Metric' },
        { id: 'q41', label: 'When will you do your weekly review?', type: 'text' },
        { id: 'q42', label: 'Who will hold you accountable?', type: 'text' },
        { id: 'q43', label: 'How often will you report progress?', type: 'text' }
      ]
    },
    {
      title: "Part 8: Immediate Action",
      subtitle: "Commitment - 5 minutes",
      questions: [
        { id: 'q44', label: 'What 3 things will you DO in the next 24 hours?', type: 'list3', placeholder: 'Action' },
        { id: 'q45', label: 'What ONE thing this week would make the biggest difference?', type: 'textarea' },
        { id: 'q46', label: 'What conversation will you have this week?', type: 'textarea' },
        { id: 'q47', label: 'When do you officially start executing?', type: 'date' },
        { id: 'q48', label: 'In 90 days, if this works, I will have...', type: 'textarea' },
        { id: 'q49', label: 'The ONE thing standing between me and success is...', type: 'textarea' },
        { id: 'q50', label: 'How committed are you to starting THIS WEEK? (1-10)', type: 'scale', min: 1, max: 10 }
      ]
    }
  ];

  const handleInputChange = (questionId: string, value: any) => {
    const newResponses = { ...responses, [questionId]: value };
    setResponses(newResponses);
    try {
      localStorage.setItem('questionnaire_progress', JSON.stringify(newResponses));
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("Authentication Required: Please sign in to finalize your OS.");
        setIsLoading(false);
        return;
      }

      const submissionData = {
        user_id: user.id,
        target_milestone: parseFloat(responses.q4?.replace(/[$,]/g, '')) || 0,
        revenue_pillars: responses.q15_streams?.map((s: any) => s.name) || [],
        raw_quiz_data: responses,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
      .from('revenue_goals')
        .upsert([submissionData]);

      if (error) throw error;

      localStorage.setItem('questionnaire_submitted', 'true');
      setIsSubmitted(true);
      router.push('/dashboard');

    } catch (error: any) {
      console.error('Error submitting:', error);
      alert('Error submitting: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    if (allResponses.length === 0) return;
    const headers = ['Timestamp', 'Question', 'Response'];
    const rows: any[] = [];
    allResponses.forEach(submission => {
      const date = new Date(submission.updated_at).toLocaleString();
      Object.entries(submission.raw_quiz_data).forEach(([key, value]) => {
        rows.push([date, key, typeof value === 'object' ? JSON.stringify(value) : value]);
      });
    });
    const csv = [headers, ...rows].map(row => 
      row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `responses-${Date.now()}.csv`;
    a.click();
  };

  const renderQuestion = (q: any) => {
    const val = responses[q.id] || '';
    const baseInput = "w-full p-5 bg-zinc-900/50 border-2 border-zinc-800 text-white rounded-2xl focus:border-[#00f2ff] focus:shadow-[0_0_20px_rgba(0,242,255,0.2)] focus:outline-none transition-all placeholder-zinc-700 font-bold italic uppercase text-sm";

    switch (q.type) {
      case 'currency':
      case 'number':
      case 'text':
        return <input type={q.type === 'currency' ? 'text' : q.type} value={val} onChange={(e) => handleInputChange(q.id, e.target.value)} placeholder={q.placeholder} className={baseInput} />;
      case 'date':
        return <input type="date" value={val} onChange={(e) => handleInputChange(q.id, e.target.value)} className={baseInput} />;
      case 'textarea':
        return <textarea value={val} onChange={(e) => handleInputChange(q.id, e.target.value)} placeholder={q.placeholder} rows={4} className={baseInput} />;
      case 'scale':
        return (
          <div className="space-y-6 pt-4">
            <input type="range" min={q.min} max={q.max} value={val || q.min} onChange={(e) => handleInputChange(q.id, e.target.value)} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00f2ff]" />
            <div className="flex justify-between items-center">
              <span className="text-zinc-600 font-black uppercase text-[10px] tracking-widest">Low Satisfaction</span>
              <span className="text-4xl font-black italic text-[#00f2ff]">{val || q.min}</span>
              <span className="text-zinc-600 font-black uppercase text-[10px] tracking-widest">Full Clearance</span>
            </div>
          </div>
        );
      case 'yesno':
        return (
          <div className="flex gap-6">
            {['yes', 'no'].map(option => (
              <button key={option} onClick={() => handleInputChange(q.id, option)} className={`flex-1 py-4 rounded-xl font-black italic uppercase transition-all border-2 ${val === option ? 'bg-[#00f2ff] border-[#00f2ff] text-black shadow-[0_0_20px_rgba(0,242,255,0.3)]' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}>
                {option}
              </button>
            ))}
          </div>
        );
      case 'list3':
        const list = Array.isArray(val) ? val : ['', '', ''];
        return (
          <div className="space-y-3">
            {[0, 1, 2].map(i => (
              <input key={i} type="text" value={list[i] || ''} onChange={(e) => {
                const newList = [...list];
                newList[i] = e.target.value;
                handleInputChange(q.id, newList);
              }} placeholder={`${q.placeholder} ${i + 1}`} className={baseInput} />
            ))}
          </div>
        );
      case 'calculated':
        return (
          <div className="p-8 bg-[#00f2ff]/5 border-2 border-[#00f2ff]/20 rounded-[2rem] text-center">
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2 italic underline decoration-[#00f2ff]">Calculated Velocity</p>
            <span className="text-5xl font-black italic text-[#00f2ff] tracking-tighter">{q.calculation(responses)}</span>
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mt-2 italic">per hour of execution</p>
          </div>
        );
      case 'streamlist':
        const streams = Array.isArray(val) ? val : [{name:'',monthlyRevenue:'',hoursPerWeek:'',type:'',enjoyment:''}];
        return (
          <div className="space-y-4">
            {streams.map((s: any, i: number) => (
              <div key={i} className="p-6 border-2 border-zinc-800 bg-zinc-900/30 rounded-[2rem] space-y-4">
                <div className="flex justify-between items-center">
                   <h4 className="font-black italic uppercase text-[#00f2ff] text-xs">Revenue Stream {i+1}</h4>
                </div>
                <input type="text" value={s.name} onChange={(e) => {const n=[...streams];n[i].name=e.target.value;handleInputChange(q.id,n);}} placeholder="Stream name" className={baseInput} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={s.monthlyRevenue} onChange={(e) => {const n=[...streams];n[i].monthlyRevenue=e.target.value;handleInputChange(q.id,n);}} placeholder="Monthly revenue" className={baseInput} />
                  <input type="text" value={s.hoursPerWeek} onChange={(e) => {const n=[...streams];n[i].hoursPerWeek=e.target.value;handleInputChange(q.id,n);}} placeholder="Hours/week" className={baseInput} />
                </div>
              </div>
            ))}
            <button onClick={() => handleInputChange(q.id,[...streams,{name:'',monthlyRevenue:'',hoursPerWeek:'',type:'',enjoyment:''}])} className="w-full py-4 border-2 border-dashed border-zinc-800 text-zinc-600 font-black italic uppercase hover:border-[#00f2ff] hover:text-[#00f2ff] transition-all rounded-2xl">
              + Initialize New Stream
            </button>
          </div>
        );
      case 'timebudget':
        const budget = typeof val === 'object' && val !== null ? val : {sleep:'',family:'',currentJob:'',stream1:'',stream2:'',stream3:'',content:'',personal:''};
        const total = Object.values(budget).reduce((sum: number,v: any) => sum + (parseFloat(v)||0), 0);
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(budget).map(k => (
                <div key={k}>
                  <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 italic">{k.replace(/([A-Z])/g,' $1')}</label>
                  <input type="number" value={budget[k]} onChange={(e) => handleInputChange(q.id,{...budget,[k]:e.target.value})} className={baseInput} />
                </div>
              ))}
            </div>
            <div className={`p-6 rounded-[2rem] font-black italic uppercase text-center border-2 transition-all ${total===168?'bg-[#00f2ff]/10 text-[#00f2ff] border-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.2)]':'bg-red-900/10 text-red-500 border-red-900'}`}>
              <p className="text-[10px] mb-1">Weekly Budget Status</p>
              <span className="text-3xl">{total} / 168 HOURS</span>
              {total !== 168 && <p className="text-[10px] mt-1">{total > 168 ? `OVER BY ${total-168}` : `REMAINING: ${168-total}`}</p>}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-[#00f2ff] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(0,242,255,0.4)]" />
        <p className="font-black italic uppercase text-[#00f2ff] tracking-[0.5em] animate-pulse">Initializing System</p>
      </div>
    );
  }

  if (viewMode === 'admin') {
    return (
      <div className="min-h-screen bg-[#020202] p-8 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-zinc-900/40 rounded-[3rem] p-10 mb-8 border border-zinc-800">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">System Log: <span className="text-[#00f2ff]">Responses</span></h1>
              <div className="flex gap-4">
                <button onClick={exportToCSV} className="px-8 py-3 bg-[#00f2ff] text-black rounded-full font-black italic uppercase flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]">
                  <Download size={18} />Export CSV
                </button>
                <button onClick={() => setViewMode('form')} className="px-8 py-3 bg-zinc-800 text-white rounded-full font-black italic uppercase">Back</button>
              </div>
            </div>
          </div>
          <div className="grid gap-6">
            {allResponses.map((sub,idx) => (
              <div key={idx} className="bg-zinc-900/20 rounded-[2rem] p-8 border border-zinc-800">
                <p className="text-[#00f2ff] font-black italic uppercase text-xs mb-4">Entry — {new Date(sub.updated_at).toLocaleString()}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {Object.entries(sub.raw_quiz_data || {}).map(([k,v]: any) => (
                     <div key={k} className="p-4 bg-black/40 rounded-xl border border-zinc-800">
                        <span className="text-[10px] font-black text-zinc-600 uppercase italic mb-1 block underline">{k}</span>
                        <p className="text-white font-bold italic uppercase text-sm">{typeof v==='object'?JSON.stringify(v):v}</p>
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6">
        <div className="bg-zinc-900/30 rounded-[4rem] p-16 max-w-3xl text-center border-2 border-[#00f2ff]/30 shadow-[0_0_50px_rgba(0,242,255,0.1)] relative overflow-hidden text-white">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent" />
          <div className="w-24 h-24 bg-[#00f2ff] rounded-3xl flex items-center justify-center mx-auto mb-10 rotate-12 shadow-[0_0_40px_rgba(0,242,255,0.5)]">
            <Check className="w-14 h-14 text-black" strokeWidth={4} />
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-6">CLEARANCE <br /><span className="text-[#00f2ff]">GRANTED.</span></h1>
          <p className="text-zinc-500 text-xl font-bold italic uppercase mb-12 leading-tight">Your data has been uploaded to the OS. Our architects are currently mapping your custom dashboard.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="px-12 py-6 bg-white text-black font-black uppercase italic tracking-widest rounded-full hover:bg-[#00f2ff] transition-all">
              Enter Dashboard
            </Link>
            <button onClick={() => setViewMode('admin')} className="px-12 py-6 bg-zinc-900 border border-zinc-800 text-zinc-500 font-black uppercase italic rounded-full flex items-center gap-2 justify-center">
              <Users size={18} /> Admin Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentSectionData = sections[currentSection];
  const progress = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="min-h-screen bg-[#020202] pb-24 text-white">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-[#00f2ff] blur-[180px] rounded-full" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-900 blur-[180px] rounded-full" />
      </div>

      <nav className="p-8 border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Brain className="text-[#00f2ff]" />
            <span className="font-black italic uppercase tracking-tighter text-xl">Fullpreneur<span className="text-zinc-700">OS</span></span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden md:block text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] italic">Audit Step {currentSection + 1} / {sections.length}</span>
            <button onClick={() => setViewMode('admin')} className="text-zinc-700 hover:text-[#00f2ff]"><Users size={20} /></button>
          </div>
        </div>
        {/* PROGRESS BAR */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-900">
           <div className="h-full bg-[#00f2ff] shadow-[0_0_15px_#00f2ff] transition-all duration-500" style={{width: `${progress}%`}} />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-16 relative">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse" />
             <p className="text-[#00f2ff] font-black text-[10px] uppercase tracking-[0.4em] italic">Secure Connection Established</p>
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-4">{currentSectionData.title}</h1>
          <p className="text-zinc-500 text-lg font-bold italic uppercase tracking-tight">{currentSectionData.subtitle}</p>
        </div>

        <div className="space-y-12">
          {currentSectionData.questions.map((question, idx) => (
            <div key={question.id} className="p-10 bg-zinc-900/20 border border-white/5 rounded-[3.5rem] hover:border-zinc-800 transition-all">
              <div className="flex gap-4 mb-8">
                <span className="text-[#00f2ff] font-black italic text-2xl opacity-30">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                <label className="text-xl md:text-2xl font-black italic uppercase text-white tracking-tight leading-tight">
                  {question.label}
                </label>
              </div>
              <div className="max-w-xl">
                {renderQuestion(question)}
              </div>
            </div>
          ))}
        </div>

        {/* CONTROLS */}
        <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-16">
          <button onClick={handlePrevious} disabled={currentSection === 0} className={`px-12 py-6 rounded-full font-black italic uppercase text-xs tracking-widest transition-all flex items-center gap-3 ${currentSection === 0 ? 'opacity-20 grayscale cursor-not-allowed' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}>
            <ChevronLeft size={18} /> Previous System
          </button>

          {currentSection === sections.length - 1 ? (
            <button onClick={handleSubmit} className="px-20 py-8 bg-[#00f2ff] text-black rounded-full font-black italic uppercase text-sm tracking-[0.2em] hover:shadow-[0_0_40px_rgba(0,242,255,0.4)] transition-all flex items-center gap-3 scale-110">
              Complete Audit <Check size={20} />
            </button>
          ) : (
            <button onClick={handleNext} className="px-20 py-8 bg-white text-black rounded-full font-black italic uppercase text-sm tracking-[0.2em] hover:bg-[#00f2ff] transition-all flex items-center gap-3 scale-110">
              Next Step <ChevronRight size={20} />
            </button>
          )}
        </div>
        <p className="text-center mt-12 text-[10px] font-black uppercase text-zinc-700 tracking-[0.5em] italic">Progress Secured Automatically</p>
      </main>
    </div>
  );
};

export default DiscoveryForm;