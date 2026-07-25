"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, ChevronDown, Activity, Sparkles } from "lucide-react";
import { useIterisStore } from "@/lib/store";
import { AgentStatus } from "@/types";

const statusConfig: Record<
  AgentStatus,
  { label: string; dotColor: string; pingColor: string; badgeBg: string }
> = {
  idle: {
    label: "Idle / Ready",
    dotColor: "bg-slate-400",
    pingColor: "bg-slate-400/40",
    badgeBg: "border-slate-500/30 text-slate-300",
  },
  thinking: {
    label: "Thinking...",
    dotColor: "bg-[#5EE0FF]",
    pingColor: "bg-[#5EE0FF]",
    badgeBg: "border-[#5EE0FF]/40 text-[#5EE0FF]",
  },
  executing: {
    label: "Executing Plan",
    dotColor: "bg-[#3DDC84]",
    pingColor: "bg-[#3DDC84]",
    badgeBg: "border-[#3DDC84]/40 text-[#3DDC84]",
  },
  awaiting_approval: {
    label: "Awaiting Approval",
    dotColor: "bg-[#FFB84D]",
    pingColor: "bg-[#FFB84D]",
    badgeBg: "border-[#FFB84D]/40 text-[#FFB84D]",
  },
  error: {
    label: "Execution Error",
    dotColor: "bg-[#FF5C5C]",
    pingColor: "bg-[#FF5C5C]",
    badgeBg: "border-[#FF5C5C]/40 text-[#FF5C5C]",
  },
};

export default function Navbar() {
  const { state, setAgentStatus } = useIterisStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentConfig = statusConfig[state.agentStatus];

  const handleSelectStatus = (status: AgentStatus) => {
    setAgentStatus(status);
    setDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0A0D14]/80 border-b border-white/10 px-4 md:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logotype */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#5EE0FF]/20 to-[#5EE0FF]/5 border border-[#5EE0FF]/40 shadow-[0_0_15px_rgba(94,224,255,0.2)]">
            <Cpu className="w-5 h-5 text-[#5EE0FF]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#5EE0FF] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-lg md:text-xl tracking-tight text-white">
                ITERIS<span className="text-[#5EE0FF]">.OS</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase rounded-full bg-[#5EE0FF]/10 text-[#5EE0FF] border border-[#5EE0FF]/30">
                Agentic v1.0
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden md:block">
              Goal & Meeting Agent Visual Shell
            </p>
          </div>
        </div>

        {/* Center: System Architecture Pill (Hidden on mobile) */}
        <div className="hidden lg:flex items-center space-x-3 text-xs font-mono px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
          <Sparkles className="w-3.5 h-3.5 text-[#5EE0FF]" />
          <span>Domain 4: Dual Agent Interface</span>
          <span className="text-gray-600">|</span>
          <span className="text-[#5EE0FF]">Standalone Shell</span>
        </div>

        {/* Right: Live Agent Status Pill & Manual Controls */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full border backdrop-blur-md transition-all ${currentConfig.badgeBg} bg-white/5 hover:bg-white/10`}
            aria-label="Toggle agent status dropdown"
          >
            <span className="relative flex h-2.5 w-2.5">
              {state.agentStatus !== "idle" && (
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentConfig.pingColor}`}
                />
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${currentConfig.dotColor}`}
              />
            </span>
            <span className="font-mono text-xs font-medium tracking-wide">
              {currentConfig.label}
            </span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-1" />
          </button>

          {/* Status Switcher Dropdown */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 4, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0A0D14]/95 border border-white/15 backdrop-blur-2xl shadow-2xl p-1.5 z-50"
              >
                <div className="px-2.5 py-1.5 border-b border-white/10 mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    Simulate Agent State
                  </span>
                  <Activity className="w-3 h-3 text-[#5EE0FF]" />
                </div>
                {(
                  [
                    "idle",
                    "thinking",
                    "executing",
                    "awaiting_approval",
                    "error",
                  ] as AgentStatus[]
                ).map((statusKey) => {
                  const cfg = statusConfig[statusKey];
                  const isSelected = state.agentStatus === statusKey;
                  return (
                    <button
                      key={statusKey}
                      onClick={() => handleSelectStatus(statusKey)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center space-x-2.5 transition-colors ${
                        isSelected
                          ? "bg-[#5EE0FF]/15 text-[#5EE0FF]"
                          : "text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${cfg.dotColor}`} />
                      <span>{cfg.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
