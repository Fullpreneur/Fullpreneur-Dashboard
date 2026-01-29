"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Users, Calendar, Palette, Database, 
  Trophy, Zap, Home as House, Briefcase, Globe, CheckCircle2
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Full CRM", href: "/crm", icon: Users },
  { name: "Master Calendar", href: "/calendar", icon: Calendar },
  { name: "Creative Space", href: "/creative", icon: Palette },
  { name: "The Vault", href: "/vault", icon: Database },
];

const opportunities = [
  { name: "Dominion Raceway", href: "/opportunities/dominion", icon: Trophy },
  { name: "SBA Funding", href: "/opportunities/sba", icon: Briefcase },
  { name: "Property Improvement", href: "/opportunities/property-improvement", icon: House },
  { name: "AlliO SaaS", href: "/opportunities/allio", icon: Zap },
  { name: "Octane Nation", href: "/opportunities/octane-nation", icon: Globe },
  { name: "Rooted Marketplace", href: "/opportunities/rooted", icon: CheckCircle2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-zinc-950 border-r border-zinc-800 font-sans">
      {/* BRANDING */}
      <div className="flex h-20 items-center px-6">
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">Fullpreneur</span>
          <span className="text-[10px] text-[#00f2ff] font-bold tracking-[0.2em] uppercase opacity-80">Command Center</span>
        </div>
      </div>

      <nav className="flex-1 space-y-8 px-4 mt-4 overflow-y-auto pb-10">
        {/* CORE TOOLS */}
        <div>
          <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3 px-3 italic">Systems</h3>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all ${isActive ? "bg-zinc-900 text-[#00f2ff] border border-[#00f2ff]/20" : "text-zinc-500 hover:text-zinc-200"}`}>
                  <item.icon className={`w-4 h-4 ${isActive ? "text-[#00f2ff]" : "text-zinc-500"}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* OPPORTUNITIES / REVENUE STREAMS */}
        <div>
          <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3 px-3 italic">Opportunities</h3>
          <div className="space-y-1">
            {opportunities.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all ${isActive ? "bg-zinc-900 text-[#00f2ff] border border-[#00f2ff]/20" : "text-zinc-500 hover:text-zinc-200"}`}>
                  <item.icon className={`w-4 h-4 ${isActive ? "text-[#00f2ff]" : "text-zinc-500 group-hover:text-[#00f2ff]/70"}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* FOOTER STATUS */}
      <div className="p-4 bg-black/40 border-t border-zinc-900/50">
        <div className="flex items-center gap-3 px-2 py-2 bg-zinc-900/30 rounded-lg border border-zinc-800/50">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] shadow-[0_0_5px_#00f2ff]" />
          <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest leading-none">All Systems Nominal</span>
        </div>
      </div>
    </div>
  );
}