"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Mic,
  ListTodo,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  CornerDownRight,
  AlertTriangle,
  AlertCircle,
  Wrench,
  User,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/person_a/Navbar";
import {
  mockGoalSteps,
  mockGoalLogs,
  mockGoalApprovals,
  mockGoalActionItems,
  mockMeetingSteps,
  mockMeetingLogs,
  mockMeetingApprovals,
  mockMeetingActionItems,
} from "@/data/mock";
import { LogLevel } from "@/types";

export default function DashboardPage() {
  // Client-side agent mode state: "goal" (Amber) vs "meeting" (Teal)
  const [agentMode, setAgentMode] = useState<"goal" | "meeting">("goal");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Swapped mock data based on active agent mode
  const currentSteps = agentMode === "goal" ? mockGoalSteps : mockMeetingSteps;
  const currentLogs = agentMode === "goal" ? mockGoalLogs : mockMeetingLogs;
  const currentApprovals = agentMode === "goal" ? mockGoalApprovals : mockMeetingApprovals;
  const currentActionItems = agentMode === "goal" ? mockGoalActionItems : mockMeetingActionItems;

  const getStatusIcon = (level: LogLevel) => {
    switch (level) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-[#3DDC84] flex-shrink-0" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-[#FF5C5C] flex-shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-[#FFB84D] flex-shrink-0" />;
      case "tool_call":
        return <Wrench className="w-4 h-4 text-[#5EE0FF] flex-shrink-0" />;
      default:
        return <Zap className="w-4 h-4 text-[#5EE0FF] flex-shrink-0" />;
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0D14] bg-[radial-gradient(ellipse_at_top,rgba(15,35,48,0.7)_0%,rgba(10,13,20,1)_80%)] bg-tech-grid text-gray-100 pb-20 relative selection:bg-[#5EE0FF]/30 selection:text-[#5EE0FF]">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 space-y-6">
        {/* Header Control Strip & Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
              title="Back to Landing Page"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight">
                Iteris OS Dashboard
              </h1>
              <p className="text-xs text-gray-400 font-mono">
                Live Agent Execution & Step-by-Step Reasoning
              </p>
            </div>
          </div>

          {/* Mode Switcher (Goal Agent vs Meeting Agent) */}
          <div className="relative flex p-1 rounded-xl bg-black/50 border border-white/10 w-full sm:w-auto">
            <button
              onClick={() => setAgentMode("goal")}
              className={`relative flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                agentMode === "goal"
                  ? "text-[#FFB84D] bg-[#FFB84D]/15 border border-[#FFB84D]/40 shadow-[0_0_12px_rgba(255,184,77,0.25)]"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Zap className="w-4 h-4 text-[#FFB84D]" />
              <span>⚡ Goal Agent (Amber)</span>
            </button>

            <button
              onClick={() => setAgentMode("meeting")}
              className={`relative flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                agentMode === "meeting"
                  ? "text-[#5EE0FF] bg-[#5EE0FF]/15 border border-[#5EE0FF]/40 shadow-[0_0_12px_rgba(94,224,255,0.25)]"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Mic className="w-4 h-4 text-[#5EE0FF]" />
              <span>🎙️ Meeting Agent (Teal)</span>
            </button>
          </div>
        </div>

        {/* Responsive 3-Column Layout: Left Rail (Step Tracker) | Center Hero (Reasoning Log) | Right Sidebar (Approvals & Action Items) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* 1. Left Rail (3 Cols on Desktop): Step Tracker Rail */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-4 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="font-display font-semibold text-sm text-white flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-[#5EE0FF]" />
                  Execution Steps
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                  {currentSteps.filter((s) => s.status === "completed").length}/{currentSteps.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {currentSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-2xl border text-xs transition-all ${
                      step.status === "completed"
                        ? "bg-[#3DDC84]/10 border-[#3DDC84]/30 text-white"
                        : step.status === "in_progress"
                        ? "bg-[#5EE0FF]/10 border-[#5EE0FF]/40 text-white shadow-[0_0_12px_rgba(94,224,255,0.2)]"
                        : step.status === "awaiting_approval"
                        ? "bg-[#FFB84D]/10 border-[#FFB84D]/40 text-white"
                        : "bg-white/5 border-white/10 text-gray-400"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                      <span className="font-bold text-[#5EE0FF]">Step {String(idx + 1).padStart(2, "0")}</span>
                      {step.status === "completed" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3DDC84]" />
                      ) : step.status === "in_progress" ? (
                        <div className="w-2 h-2 rounded-full bg-[#5EE0FF] animate-ping" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-[#FFB84D]" />
                      )}
                    </div>
                    <p className="font-sans text-xs font-medium leading-snug">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Center Hero (6 Cols on Desktop): Reasoning Log (The Main Hero) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-3xl bg-black/50 border border-white/15 backdrop-blur-2xl space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-[#5EE0FF]" />
                  <h2 className="font-display font-bold text-base text-white">
                    Live Reasoning Log & Trace
                  </h2>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
                  agentMode === "goal"
                    ? "bg-[#FFB84D]/15 text-[#FFB84D] border-[#FFB84D]/30"
                    : "bg-[#5EE0FF]/15 text-[#5EE0FF] border-[#5EE0FF]/30"
                }`}>
                  {agentMode === "goal" ? "⚡ Goal Agent Active" : "🎙️ Meeting Agent Active"}
                </span>
              </div>

              {/* Step-by-Step Reasoning Timeline Entries */}
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {currentLogs.map((log, index) => {
                  const stepNum = String(index + 1).padStart(2, "0");
                  const isExpanded = expandedLogId === log.id;
                  const hasDetails = Boolean(log.payload);

                  return (
                    <div
                      key={log.id}
                      className="rounded-2xl bg-black/40 border border-white/10 transition-all overflow-hidden"
                    >
                      <div
                        onClick={() => hasDetails && setExpandedLogId(isExpanded ? null : log.id)}
                        className={`flex items-center justify-between p-3.5 transition-colors ${
                          hasDetails ? "cursor-pointer hover:bg-white/5" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <span className="font-mono text-xs font-bold text-gray-500 w-6">
                            #{stepNum}
                          </span>
                          {getStatusIcon(log.level)}
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold tracking-wider bg-white/5 text-[#5EE0FF] border border-white/10 flex-shrink-0">
                            {log.level === "tool_call" ? "TOOL CALL" : log.level === "success" ? "OBSERVE" : index % 3 === 0 ? "PLAN" : "ADJUST"}
                          </span>
                          <span className="text-xs text-gray-200 font-sans truncate font-medium">
                            {log.message}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                          <span className="font-mono text-[10px] text-gray-500">
                            {log.timestamp}
                          </span>
                          {hasDetails && (
                            <ChevronRight
                              className={`w-4 h-4 text-gray-500 transition-transform ${
                                isExpanded ? "rotate-90 text-[#5EE0FF]" : ""
                              }`}
                            />
                          )}
                        </div>
                      </div>

                      {hasDetails && isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-1 border-t border-white/10 bg-black/60">
                          <div className="flex items-start space-x-2 text-xs text-gray-400 font-mono pt-2">
                            <CornerDownRight className="w-3.5 h-3.5 text-[#5EE0FF] flex-shrink-0 mt-0.5" />
                            <div className="w-full overflow-x-auto">
                              <span className="text-[10px] text-gray-500 block mb-1 uppercase tracking-wider font-semibold">
                                Raw Tool Call Parameters & Output:
                              </span>
                              <pre className="p-2.5 rounded-xl bg-black/80 border border-white/10 text-[11px] text-[#5EE0FF]">
                                {typeof log.payload === "string"
                                  ? log.payload
                                  : JSON.stringify(log.payload, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Right Sidebar (3 Cols on Desktop): Approvals + Action Items */}
          <div className="lg:col-span-3 space-y-4">
            {/* Approvals Card */}
            <div className="p-4 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="font-display font-semibold text-sm text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FFB84D]" />
                  Pending Approvals
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFB84D]/15 text-[#FFB84D] border border-[#FFB84D]/30 font-bold">
                  {currentApprovals.length} Required
                </span>
              </div>

              {currentApprovals.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-2xl bg-white/5 border border-[#FFB84D]/30 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#FFB84D]">
                    <span>AUTHORIZATION NEEDED</span>
                    <span>{app.requestedAt}</span>
                  </div>
                  <p className="text-gray-200 font-sans leading-relaxed">{app.reason}</p>
                  <button
                    onClick={() => alert(`Authorized request ${app.id}`)}
                    className="w-full py-1.5 rounded-xl bg-[#FFB84D] text-black font-display font-bold text-xs hover:bg-[#FFB84D]/90 transition-all cursor-pointer"
                  >
                    Authorize Action
                  </button>
                </div>
              ))}
            </div>

            {/* Action Items List */}
            <div className="p-4 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="font-display font-semibold text-sm text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#5EE0FF]" />
                  Action Items
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                  {currentActionItems.length} Tasks
                </span>
              </div>

              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {currentActionItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs"
                  >
                    <p className="text-gray-200 font-medium leading-snug">{item.description}</p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1 border-t border-white/5">
                      <span className="text-gray-300 flex items-center gap-1">
                        <User className="w-3 h-3 text-[#5EE0FF]" />
                        {item.owner.name}
                      </span>
                      <span>Due {item.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
