"use client";
import { useState, useEffect } from "react";
import { supabase } from "../calendar/supabase";
import { Lock, Zap, ArrowRight } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#00f2ff] font-black italic tracking-widest animate-pulse">SYSTEM INITIALIZING...</div>;

  if (!session) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-zinc-900/40 border border-zinc-800 p-12 rounded-[4rem] max-w-md w-full shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-4 bg-black border border-zinc-800 rounded-2xl text-[#00f2ff]"><Lock className="w-6 h-6" /></div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Vault <span className="text-zinc-700">Access</span></h1>
          </div>
          
          <div className="space-y-6">
            <input 
              type="email" placeholder="COMMANDER EMAIL" 
              className="w-full bg-black border border-zinc-800 p-6 rounded-3xl outline-none focus:border-[#00f2ff] text-white font-bold tracking-widest uppercase text-xs"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" placeholder="ACCESS KEY" 
              className="w-full bg-black border border-zinc-800 p-6 rounded-3xl outline-none focus:border-[#00f2ff] text-white font-bold tracking-widest uppercase text-xs"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase italic tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#00f2ff] transition-all">
              Authorize <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-8 text-center text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">Fullpreneur Security Protocol v1.0</p>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}