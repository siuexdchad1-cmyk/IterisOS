"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/person_a/Navbar";
import HeroGlobe from "@/components/person_a/HeroGlobe";
import DualInputSwitcher from "@/components/person_a/DualInputSwitcher";
import DashboardShell from "@/components/person_a/DashboardShell";
import { Sparkles, Layers, Terminal, Workflow } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <main className="min-h-screen bg-[#0A0D14] text-gray-100 relative selection:bg-[#5EE0FF]/30 selection:text-[#5EE0FF] pb-16">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Container with Entrance Stagger Animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-24 space-y-6"
      >
        {/* Hero Section Banner */}
        <motion.div variants={itemVariants} className="text-center py-4 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#5EE0FF]/10 border border-[#5EE0FF]/30 text-[#5EE0FF] text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Problem Statement 1 & 2 Unified Interface</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-tight">
            Autonomous Goal & <span className="text-[#5EE0FF] text-cyan-glow">Meeting Intelligence</span>
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto font-sans">
            Deconstruct complex objectives into live agent tool pipelines while extracting decision matrices and automated task reminders.
          </p>
        </motion.div>

        {/* 3D Wireframe Earth Canvas & Hotspots (HeroGlobe) */}
        <motion.div variants={itemVariants}>
          <HeroGlobe />
        </motion.div>

        {/* Dual Input Switcher Bar */}
        <motion.div variants={itemVariants}>
          <DualInputSwitcher />
        </motion.div>

        {/* Dashboard Shell with Person B and C Stub Panels */}
        <motion.div variants={itemVariants}>
          <DashboardShell />
        </motion.div>

        {/* Footer info bar */}
        <motion.footer
          variants={itemVariants}
          className="pt-8 border-t border-white/10 text-center text-xs font-mono text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2"
        >
          <div className="flex items-center space-x-2">
            <Workflow className="w-4 h-4 text-[#5EE0FF]" />
            <span>Iteris OS — Domain 4 Hackathon Front-End Shell</span>
          </div>
          <div>Visual Shell Person A | Stub Contracts Verified</div>
        </motion.footer>
      </motion.div>
    </main>
  );
}
