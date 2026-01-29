"use client";
import { Globe, Flag, Handshake, Users, ShieldAlert } from "lucide-react";

export default function OctaneNationCommand() {
  return (
    <div className="p-10 space-y-8 bg-black min-h-screen text-white font-sans">
      <header className="flex justify-between items-end border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-glow">Octane Nation</h1>
          <p className="text-[#00f2ff] font-bold tracking-[0.2em] text-xs mt-2 uppercase">Community & Partner Hub</p>
        </div>
        <div className="text-right">
          <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block italic">Community Pulse</span>
          <span className="text-2xl font-black text-red-500 uppercase tracking-tighter">High Gear</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-[#00f2ff] mb-6">
              <Globe className="w-4 h-4" /> The 34-Page Community Vision
            </h2>
            <p className="italic text-zinc-400 text-lg leading-relaxed mb-6">
              "Octane Nation is the fuel for the ecosystem. We build the audience here and bridge them into the AlliO and SBA pillars."
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 border border-zinc-800 rounded-xl">
                <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">Target Persona</p>
                <p className="text-sm font-bold">Business-owning motorsport enthusiasts.</p>
              </div>
              <div className="p-4 bg-black/40 border border-zinc-800 rounded-xl">
                <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">Primary Hook</p>
                <p className="text-sm font-bold">Track-Day Networking.</p>
              </div>
            </div>
          </section>

          <section className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">
              <Handshake className="w-4 h-4" /> Partner Pipeline
            </h2>
            <div className="space-y-4">
              {[
                { name: "Local Performance Shop", status: "Negotiating" },
                { name: "Regional Tire Distributor", status: "Discovery" }
              ].map((partner) => (
                <div key={partner.name} className="flex justify-between items-center p-4 bg-zinc-800/20 rounded-xl border border-zinc-800/50">
                  <span className="text-sm font-bold">{partner.name}</span>
                  <span className="text-[9px] bg-zinc-800 px-3 py-1 rounded-full text-zinc-400 font-black uppercase border border-zinc-700">
                    {partner.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-zinc-900 border border-red-500/20 p-8 rounded-3xl">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-red-500 mb-6">
              <Flag className="w-4 h-4" /> Upcoming Events
            </h2>
            <p className="text-[10px] font-black uppercase text-zinc-500">Next Race Meet</p>
            <p className="font-bold text-white mb-4">Dominion Spring Opener</p>
            <button className="w-full py-3 bg-zinc-800 text-[10px] font-black uppercase tracking-widest rounded-xl border border-zinc-700">
              Add To Calendar
            </button>
          </section>

          <section className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">
              <Users className="w-4 h-4" /> Member Growth
            </h2>
            <p className="text-4xl font-black italic">0</p>
            <p className="text-[9px] text-zinc-600 uppercase font-black mt-1">Founding Members</p>
          </section>

          <section className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
             <ShieldAlert className="text-yellow-500 w-5 h-5" />
             <div>
                <p className="text-[10px] font-black uppercase text-zinc-500">Liability Check</p>
                <p className="text-xs font-bold">Standard Waiver Required</p>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}