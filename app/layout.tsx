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
    <html lang="en" className="overflow-x-hidden max-w-vw">
      <body className="bg-black text-white antialiased overflow-x-hidden max-w-vw">
        {/* We removed Sidebar and AuthGuard from here */}
        {/* Now, the Landing Page and Login can load freely */}
        {children}
      </body>
    </html>
  );
}