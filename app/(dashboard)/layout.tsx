"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    }
    checkUser();
  }, [router, supabase]);

  if (loading) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#020202]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#020202] custom-scrollbar">
        {children}
      </main>
    </div>
  );
}