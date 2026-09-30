"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { asQuizResponses, clip } from "@/lib/quiz/profile";
import { EMPTY_FOCUS_COPY, EMPTY_OPPORTUNITY_COPY, opportunitiesFromQuiz } from "@/lib/opportunities";

export default function VaultPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [focus, setFocus] = useState(EMPTY_FOCUS_COPY);
  const [streams, setStreams] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [target, setTarget] = useState("$0");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("quiz_responses")
        .eq("user_id", user.id)
        .maybeSingle();
      const responses = asQuizResponses(data?.quiz_responses);
      if (responses) {
        const first = clip(responses.q15, 80);
        setFocus(first || EMPTY_FOCUS_COPY);
        setStreams(opportunitiesFromQuiz(responses).map((item) => item.name));
        const days = ["q25", "q26", "q27", "q28", "q29"];
        const listed = days.flatMap((id) => (Array.isArray(responses[id]) ? responses[id] : [])).map((item) => clip(item, 80)).filter(Boolean);
        setPriorities(listed);
        const annual = clip(responses.q4, 40);
        setTarget(annual ? `$${annual.replace(/[$,]/g, "")}` : "$0");
      }
      setLoading(false);
    };
    load();
  }, [supabase]);

  if (loading) {
    return <div className="p-10 text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading your vault</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 text-white w-full min-w-0 max-w-4xl">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00f2ff]">Your plan</p>
      <h1 className="mt-4 text-4xl sm:text-6xl font-black italic uppercase tracking-tighter">Vault</h1>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem]">
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Primary Focus</p>
          <p className="mt-2 text-2xl font-black break-words">{focus}</p>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem]">
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">18-month target</p>
          <p className="mt-2 text-2xl font-black">{target}</p>
        </div>
      </div>
      <section className="mt-8 bg-zinc-900/20 border border-zinc-800 p-6 rounded-[2rem]">
        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Opportunities</p>
        {streams.length === 0 ? (
          <p className="mt-4 text-zinc-400 font-bold italic">{EMPTY_OPPORTUNITY_COPY}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {streams.map((name) => (
              <li key={name} className="font-black uppercase italic">{name}</li>
            ))}
          </ul>
        )}
      </section>
      <section className="mt-8 bg-zinc-900/20 border border-zinc-800 p-6 rounded-[2rem]">
        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">First-week priorities</p>
        {priorities.length === 0 ? (
          <p className="mt-4 text-zinc-400 font-bold italic">No priorities saved yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {priorities.map((item, index) => (
              <li key={`${item}-${index}`} className="text-zinc-200 font-bold">{item}</li>
            ))}
          </ul>
        )}
      </section>
      {focus === EMPTY_FOCUS_COPY && (
        <Link href="/quiz" className="inline-flex mt-10 px-8 py-5 bg-[#00f2ff] text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.15em]">
          Take the Diagnostic Audit
        </Link>
      )}
    </div>
  );
}
