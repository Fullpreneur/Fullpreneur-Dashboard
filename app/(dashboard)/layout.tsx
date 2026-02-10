"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="flex h-screen overflow-hidden bg-[#020202] relative">
      
      {/* MOBILE HAMBURGER */}
      {!isMobileMenuOpen && (
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden fixed top-6 left-6 z-[150] p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[#00f2ff]"
        >
          <Menu size={24} />
        </button>
      )}

      {/* SIDEBAR */}
      <div className={`
        fixed inset-y-0 left-0 z-[200] transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar />
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-6 right-[-50px] p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[180] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* DASHBOARD CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-[#020202] relative">
        {children}
      </main>
    </div>
  );
}