"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Mic, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Terminal, Activity } from "lucide-react";
import Navbar from "@/components/person_a/Navbar";
import DualInputSwitcher from "@/components/person_a/DualInputSwitcher";
import Background3DMotionCanvas from "@/components/person_a/Background3DMotionCanvas";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"goal" | "meeting">("goal");

  const traceSteps = [
    {
      num: "01",
      title: "Plan",
      desc: "Deconstruct objective into executable sub-tasks & tool dependencies.",
      badge: "Goal Agent",
      color: "border-[#FFB84D]/40 text-[#FFB84D]",
    },
    {
      num: "02",
      title: "Act",
      desc: "Invoke external tools, query databases, and execute policy operations.",
      badge: "Tool Call",
      color: "border-[#5EE0FF]/40 text-[#5EE0FF]",
    },
    {
      num: "03",
      title: "Observe / Adjust",
      desc: "Analyze outputs, self-correct errors, and request human authorization if needed.",
      badge: "Reflection",
      color: "border-purple-400/40 text-purple-400",
    },
    {
      num: "04",
      title: "Summarize",
      desc: "Synthesize structured execution logs, audit trails, and action items.",
      badge: "Resolved",
      color: "border-[#3DDC84]/40 text-[#3DDC84]",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0A0D14] bg-[radial-gradient(ellipse_at_top,rgba(15,35,48,0.7)_0%,rgba(10,13,20,1)_80%)] bg-tech-grid text-gray-100 pb-20 relative selection:bg-[#5EE0FF]/30 selection:text-[#5EE0FF]">
      {/* 3D Motion Fullscreen Background Canvas */}
      <Background3DMotionCanvas />

      {/* Top Navbar */}
      <Navbar />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-24 space-y-12">
        {/* Hero Header */}
        <div className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#5EE0FF]" />
            <span className="text-gray-300">Dual-Agent Execution System</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl md:text-6xl text-white tracking-tight leading-tight">
            Iteris OS — <span className="text-[#5EE0FF]">Autonomous Execution Engine</span>
          </h1>

          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto font-sans leading-relaxed">
            Deploy autonomous workflows in seconds. Input high-level objectives or upload meeting audio to auto-extract and execute action items.
          </p>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#5EE0FF] text-black font-display font-bold text-xs hover:bg-[#5EE0FF]/90 transition-all shadow-[0_0_20px_rgba(94,224,255,0.35)]"
            >
              <span>Launch Execution Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Input Area (Dual Agent Command Box) */}
        <div className="max-w-4xl mx-auto">
          <DualInputSwitcher />
        </div>

        {/* Two-Agent Split Showcase Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Goal Agent Card */}
          <div className="p-6 rounded-3xl bg-black/40 border border-[#FFB84D]/30 backdrop-blur-xl space-y-4 hover:border-[#FFB84D]/60 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[#FFB84D] font-mono text-sm font-bold">
                <Zap className="w-5 h-5" />
                <span>Goal Agent</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#FFB84D]/15 text-[#FFB84D] border border-[#FFB84D]/30 uppercase font-semibold">
                Amber Mode
              </span>
            </div>
            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              Transforms natural language instructions into a multi-step execution plan. Executes tool calls, queries compliance frameworks, and generates patch summaries.
            </p>
          </div>

          {/* Meeting Agent Card */}
          <div className="p-6 rounded-3xl bg-black/40 border border-[#5EE0FF]/30 backdrop-blur-xl space-y-4 hover:border-[#5EE0FF]/60 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[#5EE0FF] font-mono text-sm font-bold">
                <Mic className="w-5 h-5" />
                <span>Meeting Agent</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#5EE0FF]/15 text-[#5EE0FF] border border-[#5EE0FF]/30 uppercase font-semibold">
                Teal Mode
              </span>
            </div>
            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              Ingests meeting recordings & transcript files. Extracts key decisions, maps assigned action items, and seamlessly hands off tasks to the Goal Agent.
            </p>
          </div>
        </div>

        {/* 4-Step Trace Section (Plan → Act → Observe/Adjust → Summarize) */}
        <div className="space-y-6 pt-6 max-w-4xl mx-auto">
          <div className="text-center space-y-1">
            <h2 className="font-display font-bold text-xl text-white">4-Step Agent Reasoning Trace</h2>
            <p className="text-xs text-gray-400 font-mono">Plan → Act → Observe / Adjust → Summarize</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {traceSteps.map((step) => (
              <div
                key={step.num}
                className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2 relative overflow-hidden"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-gray-500">{step.num}</span>
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-mono uppercase ${step.color}`}>
                    {step.badge}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-sm text-white">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-white/10 text-center text-xs font-mono text-gray-600">
          Iteris OS · Autonomous Execution Engine
        </div>
      </div>
    </main>
  );
}
