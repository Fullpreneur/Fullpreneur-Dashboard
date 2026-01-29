import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AuthGuard from "./components/AuthGuard"; // 1. Import the bouncer

export const metadata: Metadata = {
  title: "Fullpreneur Dashboard",
  description: "ADHD-Friendly, Execution-Focused",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden bg-black text-white">
        {/* 2. Wrap EVERYTHING in the AuthGuard */}
        <AuthGuard>
          {/* Your Sidebar - Now hidden unless logged in */}
          <Sidebar />
          
          {/* Your Main Content - Now hidden unless logged in */}
          <main className="flex-1 overflow-y-auto bg-black">
            {children}
          </main>
        </AuthGuard>
      </body>
    </html>
  );
}