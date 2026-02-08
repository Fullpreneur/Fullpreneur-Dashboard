import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fullpreneur OS",
  description: "ADHD-Friendly, Execution-Focused",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        {/* We removed Sidebar and AuthGuard from here */}
        {/* Now, the Landing Page and Login can load freely */}
        {children}
      </body>
    </html>
  );
}