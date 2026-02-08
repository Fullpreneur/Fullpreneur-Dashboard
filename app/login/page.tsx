"use client";
import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 text-white font-bold italic uppercase">
      <div className="max-w-md w-full bg-zinc-900/30 border border-white/5 p-12 rounded-[3rem] backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <Zap className="text-[#00f2ff]" size={32} fill="#00f2ff" />
          <h1 className="text-3xl tracking-tighter">Fullpreneur<span className="text-zinc-700">OS</span></h1>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] tracking-[0.3em] text-zinc-500 block mb-2">Operator Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#00f2ff] transition-all italic"
              placeholder="EMAIL@ACCESS.COM"
            />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.3em] text-zinc-500 block mb-2">Security Key</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#00f2ff] transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            disabled={loading}
            className="w-full py-5 bg-[#00f2ff] text-black rounded-2xl hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all flex items-center justify-center gap-3 tracking-widest"
          >
            {loading ? "AUTHENTICATING..." : "INITIALIZE SESSION"} <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}