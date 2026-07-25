import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iteris OS | Autonomous Task Orchestration",
  description: "Next-gen AI Platform for Autonomous Task Orchestration across Global Workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
