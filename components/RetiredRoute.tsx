"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RetiredRoute() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center text-zinc-500 font-bold uppercase tracking-widest text-xs">
      Opening your account
    </div>
  );
}
