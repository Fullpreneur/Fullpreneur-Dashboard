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
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 border-b ${scrolled ? "bg-black/80 backdrop-blur-2xl border-white/10 py-4" : "bg-transparent border-transparent py-6 md:py-8"}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap xl:flex-nowrap justify-between items-center gap-3 xl:gap-8">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 shrink-0 bg-[#00f2ff] rounded-2xl shadow-[0_0_30px_rgba(0,242,255,0.4)] flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-12">
              <Terminal className="text-black w-5 h-5" />
            </div>
            <div className="w-10 h-10 shrink-0 bg-[#00f2ff] rounded-2xl shadow-[0_0_30px_rgba(0,242,255,0.4)] flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-12">
              <Brain className="text-black w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-black italic uppercase tracking-tighter text-lg sm:text-xl leading-none whitespace-nowrap">Fullpreneur<span className="text-[#00f2ff]">OS</span></span>
              <span className="text-[8px] font-black uppercase tracking-[0.18em] text-zinc-500 italic whitespace-nowrap">Command & Control</span>
            </div>
          </Link>

          <div className="hidden xl:flex flex-nowrap items-center gap-4 shrink-0">
            <NavLink href="#logic">The Architecture</NavLink>
            <NavLink href="#problem">The ADHD Fix</NavLink>
            <NavLink href="#diagnostic" active>Diagnostic Clearances</NavLink>
            <Link href="/dashboard" className="whitespace-nowrap text-[11px] px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-full hover:bg-white hover:text-black transition-all font-black italic uppercase">
              Operator Login
            </Link>
          </div>

          <button className="xl:hidden text-white shrink-0" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="xl:hidden px-4 sm:px-6 pt-4 pb-2 flex flex-col items-start gap-3">
            <NavLink href="#logic" onClick={() => setIsMenuOpen(false)}>The Architecture</NavLink>
            <NavLink href="#problem" onClick={() => setIsMenuOpen(false)}>The ADHD Fix</NavLink>
            <NavLink href="#diagnostic" active onClick={() => setIsMenuOpen(false)}>Diagnostic Clearances</NavLink>
            <Link href="/dashboard" className="whitespace-nowrap text-xs px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-full font-black italic uppercase">
              Operator Login
            </Link>
          </div>
        )}
      </nav>

      {/* --- HERO: THE PSYCHOLOGICAL INTERVENTION --- */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[800px] max-w-full bg-[radial-gradient(circle_at_center,_rgba(0,242,255,0.12)_0%,transparent_65%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative w-full min-w-0">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex max-w-full items-center justify-center gap-3 mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8 py-3 bg-zinc-900/80 border border-zinc-700 rounded-full">
              <Fingerprint className="w-5 h-5 shrink-0 text-[#00f2ff]" />
              <p className="text-[#00f2ff] font-black text-[10px] sm:text-xs uppercase italic tracking-[0.12em] sm:tracking-[0.28em] md:tracking-[0.4em] text-center">Tailored for ADHD High-Performers</p>
            </div>
            
            <h1 className="w-full max-w-full px-4 sm:px-6 lg:px-8 text-[clamp(3.25rem,10vw,8rem)] font-black italic uppercase leading-[0.85] mb-6 sm:mb-8 select-none tracking-[clamp(-0.05em,-0.6vw,-0.02em)] break-words">
              KILL THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-800">NOISE.</span>
            </h1>
            
            <p className="max-w-4xl text-zinc-400 text-lg sm:text-xl md:text-2xl font-bold italic uppercase mb-8 sm:mb-10 leading-[1.15] tracking-tight px-4 sm:px-6">
              The first Digital Command Center that thinks like you do. 
              <span className="text-white"> CRM, Task Master, Accountability Mastermind,</span> and <span className="text-white">Revenue Flywheel</span>—fused into one high-intensity interface.
            </p>
            
            <div className="flex w-full max-w-full justify-center px-4 sm:px-6 lg:px-8">
              <Link href="/quiz" className="group relative max-w-full mx-auto">
                <div className="absolute inset-0 bg-[#00f2ff] rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                <button className="relative max-w-full px-6 sm:px-12 lg:px-20 py-5 sm:py-8 lg:py-10 bg-[#00f2ff] text-black font-black uppercase italic tracking-[0.12em] sm:tracking-widest text-xs sm:text-sm rounded-full transition-all flex items-center justify-center gap-4">
                  Build Your Custom OS <ArrowRight className="shrink-0 group-hover:translate-x-3 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE "ADHD PROBLEM" SECTION --- */}
      <section id="problem" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="w-20 h-2 bg-[#00f2ff]" />
            <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
              LINEAR TOOLS <br /> <span className="text-zinc-700">FAIL US.</span>
            </h2>
            <div className="space-y-6">
              <ProblemItem title="Context Switching" desc="Losing focus between CRM, Email, and Task apps. Fullpreneur OS keeps it in one view." />
              <ProblemItem title="The 90% Curse" desc="Finishing the last 10% is where we die. Our accountability logic forces completion." />
              <ProblemItem title="Revenue Blindness" desc="Tracking 7+ streams manually is impossible. We automate the math so you see the money." />
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-[#00f2ff]/20 blur-[120px] rounded-full" />
            <div className="relative p-8 sm:p-10 bg-black border border-white/10 rounded-[2.5rem] transform rotate-2 hover:rotate-0 transition-transform duration-700">
               <AlertTriangle className="text-[#00f2ff] w-16 h-16 mb-8" />
               <p className="text-3xl font-black italic uppercase text-white leading-tight">"Most entrepreneurs fail because they manage tasks. We teach you to manage an ecosystem."</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE MASTERMIND HUB: 4 PILLARS --- */}
      <section id="logic" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <FeatureBlock 
              icon={Users} 
              title="Personal CRM" 
              desc="The brain for your network. Track leads for multiple opportunities, manage projects and tasks, store documents and notes without forgetting a thing." 
            />
            <FeatureBlock 
              icon={Target} 
              title="Execution Engine" 
              desc="A 168-hour tactical map. We don't just list tasks; we assign them to revenue-generating time blocks." 
            />
            <FeatureBlock 
              icon={Gauge} 
              title="Revenue Flywheel" 
              desc="Real-time tracking for your revenue milestones. Visualizing the integration of all your income streams." 
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
      <section id="diagnostic" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[#00f2ff]">
        <div className="max-w-5xl mx-auto text-black text-center w-full min-w-0">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6 sm:mb-8 break-words">
            INITIAL <br /> DIAGNOSTIC
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-black italic uppercase mb-8 sm:mb-10 max-w-2xl mx-auto opacity-80 break-words px-2">
            We don't sell access. We grant clearance. Take the 50-question audit to determine your custom OS configuration.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <DiagnosticStep number="01" text="Define Revenue Pillars" />
            <DiagnosticStep number="02" text="Map ADHD Friction" />
            <DiagnosticStep number="03" text="Generate Control Center" />
          </div>

          <Link href="/quiz" className="inline-flex max-w-full items-center justify-center px-6 sm:px-12 md:px-20 py-5 sm:py-8 bg-black text-white font-black uppercase italic tracking-[0.12em] sm:tracking-[0.3em] text-xs sm:text-sm rounded-full hover:scale-105 transition-all shadow-2xl">
            Start Questionnaire
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-10 sm:py-12 border-t border-white/5 text-center">
        <div className="flex justify-center gap-4 mb-4">
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

function NavLink({ href, children, active, onClick }: { href: string; children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="relative inline-flex whitespace-nowrap text-[11px] font-black uppercase tracking-[0.14em] text-zinc-500 hover:text-[#00f2ff] transition-colors"
    >
      <span className="relative inline-block">
        {children}
        {active && (
          <span className="pointer-events-none absolute left-0 -bottom-1.5 h-px bg-[#00f2ff] w-[calc(100%-0.14em)]" />
        )}
      </span>
    </a>
  );
}

function FeatureBlock({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-8 sm:p-10 bg-zinc-900/20 border border-white/5 rounded-[2rem] hover:bg-zinc-900/40 hover:border-[#00f2ff]/30 transition-all group">
      <div className="w-14 h-14 bg-black border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
    <div className="border-4 border-black p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] min-w-0">
      <p className="text-3xl sm:text-5xl font-black italic mb-4">{number}</p>
      <p className="text-xs sm:text-sm font-black uppercase tracking-wide sm:tracking-widest break-words">{text}</p>
    </div>
  );
}

function Users(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
}