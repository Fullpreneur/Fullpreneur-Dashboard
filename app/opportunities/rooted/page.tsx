"use client";
import { Users, ShieldCheck, MapPin, Search, Star, ArrowUpRight } from "lucide-react";

export default function RootedCommand() {
  return (
    <div className="p-10 space-y-8 bg-black min-h-screen text-white font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-end border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-glow">Rooted Marketplace</h1>
          <p className="text-[#00f2ff] font-bold tracking-[0.2em] text-xs mt-2 uppercase">Local Service Vetting & Marketplace Hub</p>
        </div>
        <div className="text-right">
          <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block italic">Platform Status</span>
          <span className="text-2xl font-black text-green-500 uppercase">Pre-Launch</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PHILOSOPHY & VETTING ENGINE */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-[#00f2ff] mb-6">
              <Star className="w-4 h-4" /> The 34-Page Standard
            </h2>
            <div className="space-y-4">
              <p className="italic text-zinc-400 text-lg leading-relaxed">
                "Rooted is about trust. We aren't just a directory; we are the quality filter for the local community. Every provider must be vetted against our internal 'Standard of Excellence'."
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-black/40 border border-zinc-800 rounded-xl">
                  <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">Provider Requirement</p>
                  <p className="text-sm font-bold">Licensed, Insured, & Community-Reviewed.</p>
                </div>
                <div className="p-4 bg-black/40 border border-zinc-800 rounded-xl">
                  <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">User Benefit</p>
                  <p className="text-sm font-bold">Concierge-level service discovery.</p>
                </div>
              </div>
            </div>
          </section>

          {/* PROVIDER PIPELINE */}
          <section className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">
              <ShieldCheck className="w-4 h-4" /> Provider Onboarding
            </h2>
            <div className="space-y-4">
              {[
                { category: "HVAC", count: 0, status: "Vetting Opens Soon" },
                { category: "Landscaping", count: 0, status: "Vetting Opens Soon" },
                { category: "Electrical", count: 0, status: "Vetting Opens Soon" }
              ].map((group) => (
                <div key={group.category} className="flex justify-between items-center p-4 bg-zinc-800/20 rounded-xl border border-zinc-800/50">
                  <div>
                    <span className="text-sm font-bold block">{group.category}</span>
                    <span className="text-[9px] uppercase font-black text-zinc-500">Waitlist Count: {group.count}</span>
                  </div>
                  <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">
                    {group.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* METRICS & QUICK SEARCH */}
        <div className="space-y-8">
          <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">
              <Search className="w-4 h-4" /> Provider Search
            </h2>
            <div className="relative">
              <div className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-xs text-zinc-600 flex justify-between items-center italic">
                Search zip code...
                <MapPin className="w-3 h-3" />
              </div>
            </div>
          </section>

          <section className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">
              <Users className="w-4 h-4" /> User Growth
            </h2>
            <div className="text-center py-4">
              <p className="text-4xl font-black italic">0</p>
              <p className="text-[9px] text-zinc-600 uppercase font-black mt-1">Verified Homeowners</p>
            </div>
          </section>

          <section className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl flex justify-between items-center group cursor-pointer hover:border-[#00f2ff]/50 transition-all">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-[#00f2ff]/10 rounded-lg">
                  <ArrowUpRight className="text-[#00f2ff] w-4 h-4" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest">Marketplace Analytics</p>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}