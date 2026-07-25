"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/person_a/Navbar";
import DualInputSwitcher from "@/components/person_a/DualInputSwitcher";
import DashboardShell from "@/components/person_a/DashboardShell";
import Background3DMotionCanvas from "@/components/person_a/Background3DMotionCanvas";

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
    <main className="min-h-screen bg-[#0A0D14] bg-[radial-gradient(ellipse_at_top,rgba(15,35,48,0.7)_0%,rgba(10,13,20,1)_80%)] bg-tech-grid text-gray-100 pb-20 relative selection:bg-[#5EE0FF]/30 selection:text-[#5EE0FF]">
      {/* 3D Motion Fullscreen Background Canvas */}
      <Background3DMotionCanvas />

      {/* Navbar with Supabase Auth & PillNav */}
      <Navbar />

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-24 space-y-6">
        {/* Hero Header */}
        <motion.div
          custom={0}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-center py-4 space-y-3"
        >
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-tight">
            Iteris OS — <span className="text-[#5EE0FF]">Autonomous Execution Engine</span>
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto font-sans leading-relaxed">
            Deploy autonomous workflows in seconds. Input high-level objectives or upload meeting audio to auto-extract and execute action items.
          </p>
        </motion.div>

        {/* Input Area (Command Prompt + Mode Switcher) */}
        <motion.div custom={1} variants={fade} initial="hidden" animate="visible">
          <DualInputSwitcher />
        </motion.div>

        {/* Dynamic Dashboard Shell */}
        <motion.div custom={2} variants={fade} initial="hidden" animate="visible">
          <DashboardShell />
        </motion.div>

        {/* Footer */}
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
