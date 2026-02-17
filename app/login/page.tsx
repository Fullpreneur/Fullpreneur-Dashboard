"use client";
import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // New Toggle State
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Logic switches based on isSignUp state
    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      if (isSignUp) {
        alert("Verification email sent! Check your inbox to activate your OS profile.");
        setLoading(false);
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 text-white font-bold italic uppercase">
      <div className="max-w-md w-full bg-zinc-900/30 border border-white/5 p-12 rounded-[3rem] backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <Zap className="text-[#00f2ff]" size={32} fill="#00f2ff" />
          <h1 className="text-3xl tracking-tighter">Fullpreneur<span className="text-zinc-700">OS</span></h1>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-[10px] tracking-[0.4em] text-[#00f2ff]">
            {isSignUp ? "INITIALIZE NEW OPERATOR" : "SECURE SESSION START"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="text-[10px] tracking-[0.3em] text-zinc-500 block mb-2">Operator Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#00f2ff] transition-all italic"
              placeholder="EMAIL@ACCESS.COM"
              required
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
              required
            />
          </div>
          <button 
            disabled={loading}
            className="w-full py-5 bg-[#00f2ff] text-black rounded-2xl hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all flex items-center justify-center gap-3 tracking-widest"
          >
            {loading ? "PROCESSING..." : isSignUp ? "CREATE ACCOUNT" : "INITIALIZE SESSION"} <ArrowRight size={20} />
          </button>
        </form>

        {/* TOGGLE BUTTON */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[10px] tracking-[0.2em] text-zinc-600 hover:text-white transition-all"
          >
            {isSignUp ? "ALREADY REGISTERED? SIGN IN" : "NEW OPERATOR? INITIALIZE HERE"}
          </button>
        </div>
      </div>
    </div>
  );
}