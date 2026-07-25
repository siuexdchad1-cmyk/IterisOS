import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { IterisProvider } from "@/lib/store";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Iteris OS — Unified Agentic AI Shell",
  description:
    "Merging Goal Agent (Autonomous Execution) and Meeting Agent (Decision & Action Matrix) into a unified visual operating system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="bg-[#0A0D14] text-gray-100 antialiased selection:bg-[#5EE0FF]/30 selection:text-[#5EE0FF]">
        <IterisProvider>{children}</IterisProvider>
      </body>
    </html>
  );
}
