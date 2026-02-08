"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Zap, ShieldCheck, Target, ChevronRight, 
  BarChart3, Layers, CheckCircle2, Menu, X,
  ArrowRight, Brain, Fingerprint, Activity,
  Lock, Beaker, Terminal, Rocket, HardHat,
  Landmark, Sparkles, AlertTriangle, Gauge
} from "lucide-react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#020202] min-h-screen text-white font-sans selection:bg-[#00f2ff] selection:text-black overflow-x-hidden">
      
      {/* --- HUD NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 border-b ${scrolled ? "bg-black/80 backdrop-blur-2xl border-white/10 py-4" : "bg-transparent border-transparent py-8"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-[#00f2ff] rounded-2xl shadow-[0_0_30px_rgba(0,242,255,0.4)] flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-12">
              <Terminal className="text-black w-7 h-7" />
            </div><div className="w-12 h-12 bg-[#00f2ff] rounded-2xl shadow-[0_0_30px_rgba(0,242,255,0.4)] flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-12">
              <Brain className="text-black w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="font-black italic uppercase tracking-tighter text-2xl leading-none">Fullpreneur<span className="text-[#00f2ff]">OS</span></span>
              <span className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-500 italic">Command & Control</span>
            </div>
          </Link>

          <div className="hidden lg:flex gap-12 items-center text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
            <a href="#logic" className="hover:text-[#00f2ff] transition-all">The Architecture</a>
            <a href="#problem" className="hover:text-[#00f2ff] transition-all">The ADHD Fix</a>
            <a href="#diagnostic" className="hover:text-[#00f2ff] transition-all underline decoration-[#00f2ff] underline-offset-8">Diagnostic Clearances</a>
            <Link href="/dashboard" className="px-10 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-full hover:bg-white hover:text-black transition-all font-black italic">
              Operator Login
            </Link>
          </div>

          <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* --- HERO: THE PSYCHOLOGICAL INTERVENTION --- */}
      <section className="relative pt-64 pb-40 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-[radial-gradient(circle_at_center,_rgba(0,242,255,0.12)_0%,transparent_65%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-4 mb-12 px-8 py-3 bg-zinc-900/80 border border-zinc-700 rounded-full animate-in fade-in slide-in-from-top duration-1000">
              <Fingerprint className="w-5 h-5 text-[#00f2ff]" />
              <p className="text-[#00f2ff] font-black text-xs uppercase tracking-[0.5em] italic">Tailored for ADHD High-Performers</p>
            </div>
            
            <h1 className="text-7xl md:text-[14rem] font-black italic uppercase tracking-tighter leading-[0.75] mb-16 select-none">
              KILL THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-800">NOISE.</span>
            </h1>
            
            <p className="max-w-4xl text-zinc-400 text-xl md:text-3xl font-bold italic uppercase mb-20 leading-[1.1] tracking-tight">
              The first Digital Command Center that thinks like you do. 
              <span className="text-white"> CRM, Task Master, Accountability Mastermind,</span> and <span className="text-white">Revenue Flywheel</span>—fused into one high-intensity interface.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 items-center">
              <Link href="/quiz" className="group relative">
                <div className="absolute -inset-1 bg-[#00f2ff] rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                <button className="relative px-20 py-10 bg-[#00f2ff] text-black font-black uppercase italic tracking-widest rounded-full transition-all flex items-center gap-4 scale-110">
                  Build Your Custom OS <ArrowRight className="group-hover:translate-x-3 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE "ADHD PROBLEM" SECTION --- */}
      <section id="problem" className="py-40 px-6 bg-zinc-950/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <div className="w-20 h-2 bg-[#00f2ff]" />
            <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
              LINEAR TOOLS <br /> <span className="text-zinc-700">FAIL US.</span>
            </h2>
            <div className="space-y-8">
              <ProblemItem title="Context Switching" desc="Losing focus between CRM, Email, and Task apps. Fullpreneur OS keeps it in one view." />
              <ProblemItem title="The 90% Curse" desc="Finishing the last 10% is where we die. Our accountability logic forces completion." />
              <ProblemItem title="Revenue Blindness" desc="Tracking 7+ streams manually is impossible. We automate the math so you see the money." />
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-[#00f2ff]/20 blur-[120px] rounded-full" />
            <div className="relative p-12 bg-black border border-white/10 rounded-[4rem] transform rotate-3 hover:rotate-0 transition-transform duration-700">
               <AlertTriangle className="text-[#00f2ff] w-16 h-16 mb-8" />
               <p className="text-3xl font-black italic uppercase text-white leading-tight">"Most entrepreneurs fail because they manage tasks. We teach you to manage an ecosystem."</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE MASTERMIND HUB: 4 PILLARS --- */}
      <section id="logic" className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <FeatureBlock 
              icon={Users} 
              title="Personal CRM" 
              desc="The brain for your network. Track leads for Landscaping, sponsors for Dominion, and partners for Rooted without forgetting a name." 
            />
            <FeatureBlock 
              icon={Target} 
              title="Execution Engine" 
              desc="A 168-hour tactical map. We don't just list tasks; we assign them to revenue-generating time blocks." 
            />
            <FeatureBlock 
              icon={Gauge} 
              title="Revenue Flywheel" 
              desc="Real-time tracking for the $137k milestone. Visualizing the integration of all 7 income streams." 
            />
            <FeatureBlock 
              icon={Beaker} 
              title="Mastermind Hub" 
              desc="Store your scripts, your negotiation protocols, and your high-level strategy. Your digital executive assistant." 
            />
          </div>
        </div>
      </section>

      {/* --- THE 50-QUESTION DIAGNOSTIC PREVIEW --- */}
      <section id="diagnostic" className="py-40 px-6 bg-[#00f2ff]">
        <div className="max-w-5xl mx-auto text-black text-center">
          <h2 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] mb-12">
            INITIAL <br /> DIAGNOSTIC
          </h2>
          <p className="text-2xl font-black italic uppercase mb-16 max-w-2xl mx-auto opacity-80">
            We don't sell access. We grant clearance. Take the 50-question audit to determine your custom OS configuration.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <DiagnosticStep number="01" text="Define Revenue Pillars" />
            <DiagnosticStep number="02" text="Map ADHD Friction" />
            <DiagnosticStep number="03" text="Generate Control Center" />
          </div>

          <Link href="/quiz" className="inline-block px-24 py-10 bg-black text-white font-black uppercase italic tracking-[0.3em] rounded-full hover:scale-105 transition-all shadow-2xl">
            Start Questionnaire
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/5 text-center">
        <div className="flex justify-center gap-4 mb-8">
           <div className="w-2 h-2 rounded-full bg-zinc-800" />
           <div className="w-2 h-2 rounded-full bg-zinc-800" />
           <div className="w-2 h-2 rounded-full bg-zinc-800" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-700 italic">Fullpreneur Operational System — No Data Loss</p>
      </footer>
    </div>
  );
}

/* --- SUB-COMPONENTS --- */

function FeatureBlock({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-16 bg-zinc-900/20 border border-white/5 rounded-[5rem] hover:bg-zinc-900/40 hover:border-[#00f2ff]/30 transition-all group">
      <div className="w-20 h-20 bg-black border border-zinc-800 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
        <Icon className="w-10 h-10 text-[#00f2ff]" />
      </div>
      <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-6">{title}</h3>
      <p className="text-zinc-500 font-bold italic uppercase text-sm leading-relaxed tracking-tight">{desc}</p>
    </div>
  );
}

function ProblemItem({ title, desc }: any) {
  return (
    <div className="flex gap-6 items-start">
      <CheckCircle2 className="text-[#00f2ff] w-6 h-6 mt-1 flex-shrink-0" />
      <div>
        <h4 className="text-xl font-black italic uppercase text-white mb-2">{title}</h4>
        <p className="text-zinc-500 font-bold italic uppercase text-xs">{desc}</p>
      </div>
    </div>
  );
}

function DiagnosticStep({ number, text }: any) {
  return (
    <div className="border-4 border-black p-8 rounded-[3rem]">
      <p className="text-5xl font-black italic mb-4">{number}</p>
      <p className="text-sm font-black uppercase tracking-widest">{text}</p>
    </div>
  );
}

function Users(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
}