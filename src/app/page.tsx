"use client";

import React from "react";
import Navbar from "@/components/person_a/Navbar";
import IterisScrollytelling from "@/components/person_a/IterisScrollytelling";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0D14] text-gray-100 relative selection:bg-[#5EE0FF]/30 selection:text-[#5EE0FF] overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar />

      {/* Smooth 350vh Scrollytelling Container */}
      <IterisScrollytelling />

      {/* Footer */}
      <div className="relative z-20 py-8 border-t border-white/10 text-center text-xs font-mono text-gray-600 bg-[#0A0D14]">
        Iteris OS · Domain 4 Hackathon
      </div>
    </main>
  );
}
