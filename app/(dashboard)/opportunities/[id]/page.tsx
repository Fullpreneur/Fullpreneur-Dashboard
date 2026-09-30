"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { asQuizResponses, clip } from "@/lib/quiz/profile";
import { opportunitiesFromQuiz, UserOpportunity } from "@/lib/opportunities";

export default function OpportunityDetail() {
  const params = useParams<{ id: string }>();
  const supabase = createClient();
  const [record, setRecord] = useState<UserOpportunity | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !params.id) {
        setMissing(true);
        return;
      }

      const id = decodeURIComponent(params.id);
      if (id.startsWith("stream-")) {
        const profileRes = await supabase
          .from("profiles")
          .select("quiz_responses")
          .eq("user_id", user.id)
          .maybeSingle();
        const match = opportunitiesFromQuiz(asQuizResponses(profileRes.data?.quiz_responses)).find((item) => item.id === id);
        if (match) setRecord(match);
        else setMissing(true);
        return;
      }

      const { data, error } = await supabase
        .from("opportunities")
        .select("id, name, status, notes, current_revenue, target_revenue")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !data) {
        setMissing(true);
        return;
      }

      setRecord({
        id: data.id,
        name: clip(data.name, 80) || "Untitled opportunity",
        detail: clip(data.notes, 240) || "Saved to your account",
        status: data.status || "OPEN",
        currentRevenue: Number(data.current_revenue) || 0,
        targetRevenue: Number(data.target_revenue) || 0,
        href: `/opportunities/${data.id}`,
      });
    };

    load();
  }, [params.id, supabase]);

  if (missing) {
    return (
      <div className="p-6 md:p-10 text-white max-w-2xl">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00f2ff]">Opportunity</p>
        <h1 className="mt-4 text-4xl font-black italic uppercase">Not on this account</h1>
        <p className="mt-4 text-zinc-400">This record is not saved for the signed-in user.</p>
        <Link href="/dashboard" className="inline-flex mt-8 px-6 py-4 bg-[#00f2ff] text-black rounded-2xl font-black uppercase text-[11px] tracking-widest">
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (!record) {
    return <div className="p-10 text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading your opportunity</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 text-white w-full min-w-0 max-w-3xl">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00f2ff]">{record.status}</p>
      <h1 className="mt-4 text-4xl sm:text-6xl font-black italic uppercase tracking-tighter break-words">{record.name}</h1>
      <p className="mt-6 text-zinc-400 font-bold italic break-words">{record.detail}</p>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-[2rem]">
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Current</p>
          <p className="text-2xl font-black">${record.currentRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-[2rem]">
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Target</p>
          <p className="text-2xl font-black">${record.targetRevenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
