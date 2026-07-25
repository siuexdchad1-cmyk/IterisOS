"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/person_a/Navbar";
import DualInputSwitcher from "@/components/person_a/DualInputSwitcher";
import DashboardShell from "@/components/person_a/DashboardShell";

const fade = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.3, ease: "easeOut" },
  }),
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0D14] text-gray-100 pb-20 selection:bg-[#5EE0FF]/30 selection:text-[#5EE0FF]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-24 space-y-6">
        {/* Hero — headline + subheading only */}
        <motion.div
          custom={0}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-center py-6 space-y-3"
        >
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white tracking-tight leading-tight">
            Iteris <span className="text-[#5EE0FF]">OS</span>
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto">
            Type a goal and let the agent break it down — or paste a meeting transcript to extract action items and track what's pending.
          </p>
        </motion.div>

        {/* Input area */}
        <motion.div custom={1} variants={fade} initial="hidden" animate="visible">
          <DualInputSwitcher />
        </motion.div>

        {/* Dashboard — only renders non-empty sections */}
        <motion.div custom={2} variants={fade} initial="hidden" animate="visible">
          <DashboardShell />
        </motion.div>

        {/* Minimal footer */}
        <motion.div
          custom={3}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="pt-8 border-t border-white/10 text-center text-xs font-mono text-gray-600"
        >
          Iteris OS · Domain 4 Hackathon
        </motion.div>
      </div>
    </main>
  );
}
