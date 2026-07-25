"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ListTodo,
  ShieldCheck,
  Terminal,
  Cpu,
  CheckCircle2,
  FileCheck,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useIterisStore } from "@/lib/store";
import GlassPanel from "./GlassPanel";
import TaskMatrix from "@/components/person_b/TaskMatrix";
import SlideToApprove from "@/components/person_b/SlideToApprove";
import LiveTerminal from "@/components/person_c/LiveTerminal";
import StepInspector from "@/components/person_c/StepInspector";

export default function DashboardShell() {
  const { state } = useIterisStore();
  const goalSummaries = state?.goalSummaries || [];

  return (
    <div className="w-full space-y-6 my-6">
      {/* Reserved Goal Summary Card Slot (Displayed when GoalSummary exists) */}
      {goalSummaries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <GlassPanel
            title="End-to-End Goal Execution Summary"
            icon={<FileCheck className="w-5 h-5 text-[#3DDC84]" />}
            badge={
              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#3DDC84]/15 text-[#3DDC84] border border-[#3DDC84]/30 shadow-[0_0_10px_rgba(61,220,132,0.2)]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Goal Resolved</span>
              </span>
            }
            className="border-[#3DDC84]/30 bg-gradient-to-br from-white/5 to-[#3DDC84]/5"
          >
            {goalSummaries.map((summary) => (
              <div key={summary.id} className="space-y-4 font-mono text-xs">
                {/* Section 1: What was done */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[#3DDC84] font-semibold text-xs mb-1">
                    <span className="flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>What Was Accomplished</span>
                    </span>
                    <span className="text-[10px] text-gray-400 font-normal">
                      Generated: {new Date(summary.generatedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-200 leading-relaxed font-sans text-sm">
                    {summary.whatWasDone}
                  </p>
                </div>

                {/* Section 2: Agent Reasoning & Failure Log if any */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <span className="text-[#5EE0FF] font-semibold text-[11px] block">
                      Transparent Reasoning Log
                    </span>
                    <p className="text-gray-300 text-xs leading-normal">
                      {summary.reasoning}
                    </p>
                  </div>

                  {summary.whatFailed ? (
                    <div className="p-3 rounded-xl bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 space-y-1">
                      <span className="text-[#FF5C5C] font-semibold text-[11px] flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Execution Exceptions</span>
                      </span>
                      <p className="text-gray-300 text-xs">
                        {summary.whatFailed}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                      <span className="text-gray-400 font-semibold text-[11px] flex items-center space-x-1">
                        <HelpCircle className="w-3.5 h-3.5 text-[#3DDC84]" />
                        <span>System Verification</span>
                      </span>
                      <p className="text-gray-400 text-xs">
                        Zero unhandled execution failures. All sub-task assertions passed.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </GlassPanel>
        </motion.div>
      )}

      {/* Main Responsive Grid Container (3-col desktop → 2-col tablet → 1-col mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Person B: Meeting Task Matrix */}
        <div className="lg:col-span-2">
          <GlassPanel
            title="Meeting Action Items Matrix"
            icon={<ListTodo className="w-4 h-4 text-[#5EE0FF]" />}
            badge={
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#5EE0FF]/10 text-[#5EE0FF] border border-[#5EE0FF]/20">
                Person B Stub
              </span>
            }
          >
            <TaskMatrix />
          </GlassPanel>
        </div>

        {/* Person B: Slide To Approve */}
        <div className="lg:col-span-1">
          <GlassPanel
            title="Human Authorization"
            icon={<ShieldCheck className="w-4 h-4 text-[#FFB84D]" />}
            badge={
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFB84D]/10 text-[#FFB84D] border border-[#FFB84D]/20">
                Person B Stub
              </span>
            }
          >
            <SlideToApprove />
          </GlassPanel>
        </div>

        {/* Person C: Live Execution Terminal */}
        <div className="lg:col-span-2">
          <GlassPanel
            title="Live Agent Reasoning Terminal"
            icon={<Terminal className="w-4 h-4 text-[#5EE0FF]" />}
            badge={
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#5EE0FF]/10 text-[#5EE0FF] border border-[#5EE0FF]/20">
                Person C Stub
              </span>
            }
          >
            <LiveTerminal />
          </GlassPanel>
        </div>

        {/* Person C: Step & Tool Inspector */}
        <div className="lg:col-span-1">
          <GlassPanel
            title="Goal Step Inspector"
            icon={<Cpu className="w-4 h-4 text-purple-400" />}
            badge={
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Person C Stub
              </span>
            }
          >
            <StepInspector />
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
