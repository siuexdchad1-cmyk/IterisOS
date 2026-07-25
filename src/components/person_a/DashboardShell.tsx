"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// Lightweight markdown → JSX renderer (headings, bold, bullets, numbered, newlines)
function renderMarkdown(text: string) {
  if (!text) return null;

  // Normalise escaped newlines from JSON strings
  let normalized = text
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "  ")
    // Normalise Lyzr's inconsistent *text:** and **text:** bold patterns → **text:**
    .replace(/\*([^*\n]+):\*\*/g, "**$1:**")
    // Remove leftover solo asterisks that aren't part of ** pairs
    .replace(/(?<!\*)\*(?!\*)/g, "");

  return normalized.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} className="h-1.5" />;

    // Heading: # ## ### (with optional emoji)
    if (/^#{1,3}\s/.test(trimmed)) {
      const content = trimmed.replace(/^#{1,3}\s/, "");
      return (
        <p key={i} className="text-[#5EE0FF] font-semibold text-[11px] mt-2 mb-0.5 font-mono">
          {inlineBold(content)}
        </p>
      );
    }

    // Table separator — skip
    if (/^[\|\-\s]+$/.test(trimmed)) return null;

    // Table row — render as plain text
    if (trimmed.startsWith("|")) {
      const cells = trimmed.split("|").filter(Boolean).map(c => c.trim()).join(" · ");
      return <p key={i} className="text-gray-400 text-[10px]">{cells}</p>;
    }

    // Bullet: - or *
    if (/^[-*]\s/.test(trimmed)) {
      return (
        <div key={i} className="flex items-start gap-1.5 pl-1">
          <span className="text-[#5EE0FF] mt-0.5 flex-shrink-0">›</span>
          <span>{inlineBold(trimmed.replace(/^[-*]\s*/, ""))}</span>
        </div>
      );
    }

    // Numbered list
    if (/^\d+[.)]\s/.test(trimmed)) {
      const num = trimmed.match(/^(\d+)/)?.[1];
      return (
        <div key={i} className="flex items-start gap-1.5 pl-1">
          <span className="text-[#5EE0FF] flex-shrink-0 font-semibold">{num}.</span>
          <span>{inlineBold(trimmed.replace(/^\d+[.)]\s*/, ""))}</span>
        </div>
      );
    }

    return <p key={i}>{inlineBold(trimmed)}</p>;
  });
}

function inlineBold(text: string): React.ReactNode {
  // Strip remaining stray ** or * that aren't forming valid bold pairs
  const cleaned = text.replace(/\*{3,}/g, "").replace(/(?<!\*)\*\*(?!\*)/g, "");
  const parts = cleaned.split(/\*\*(.*?)\*\*/g);
  if (parts.length === 1) return cleaned;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-white font-semibold">
        {part}
      </strong>
    ) : (
      part
    )
  );
}


export default function DashboardShell() {
  const { state } = useIterisStore();
  const goalSummaries = state?.goalSummaries ?? [];
  const actionItems   = state?.actionItems   ?? [];
  const logs          = state?.logs          ?? [];
  const planSteps     = state?.planSteps     ?? [];
  const approvals     = state?.approvals     ?? [];

  // Only show the dashboard once the user has submitted at least one thing
  const hasAnyData =
    goalSummaries.length > 0 ||
    actionItems.length > 0 ||
    logs.length > 0 ||
    planSteps.length > 0 ||
    approvals.length > 0;

  if (!hasAnyData) return null;

  return (
    <div className="w-full space-y-5 my-2">
      {/* Goal Execution Summary — only when goals have been run */}
      <AnimatePresence>
        {goalSummaries.length > 0 && (
          <motion.div
            key="goal-summary"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <GlassPanel
              title="Goal Execution Summary"
              icon={<FileCheck className="w-5 h-5 text-[#3DDC84]" />}
              badge={
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-mono bg-[#3DDC84]/15 text-[#3DDC84] border border-[#3DDC84]/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolved</span>
                </span>
              }
              className="border-[#3DDC84]/20"
            >
              {goalSummaries.map((summary, i) => (
                <div
                  key={summary.id}
                  className={`space-y-3 text-xs ${i > 0 ? "pt-4 border-t border-white/10" : ""}`}
                >
                  {/* What was done */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[#3DDC84] font-semibold text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        What was done
                      </span>
                      <span className="text-gray-500 font-normal font-mono">
                        {new Date(summary.generatedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed">{summary.whatWasDone}</p>
                  </div>

                  {/* Reasoning + verification */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 overflow-auto max-h-48">
                      <span className="text-[#5EE0FF] font-semibold text-[11px] block font-mono">
                        Agent Reasoning
                      </span>
                      <div className="text-gray-300 text-xs leading-relaxed space-y-1">
                        {renderMarkdown(summary.reasoning)}
                      </div>
                    </div>

                    {summary.whatFailed ? (
                      <div className="p-3 rounded-xl bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 space-y-1">
                        <span className="text-[#FF5C5C] font-semibold text-[11px] flex items-center gap-1 font-mono">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Errors
                        </span>
                        <p className="text-gray-300 text-xs">{summary.whatFailed}</p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                        <span className="text-gray-400 font-semibold text-[11px] flex items-center gap-1 font-mono">
                          <HelpCircle className="w-3.5 h-3.5 text-[#3DDC84]" />
                          Verification
                        </span>
                        <p className="text-gray-500 text-xs">
                          No execution failures detected.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main grid — Terminal spans full width when there are no action items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Meeting Action Items — only when meeting data exists */}
        {actionItems.length > 0 && (
          <div className="lg:col-span-2">
            <GlassPanel
              title="Meeting Action Items"
              icon={<ListTodo className="w-4 h-4 text-[#5EE0FF]" />}
            >
              <TaskMatrix />
            </GlassPanel>
          </div>
        )}

        {/* Human Authorization — only when approvals are pending */}
        {approvals.filter((a) => a.status === "pending").length > 0 && (
          <div className={actionItems.length > 0 ? "lg:col-span-1" : "lg:col-span-3"}>
            <GlassPanel
              title="Human Authorization"
              icon={<ShieldCheck className="w-4 h-4 text-[#FFB84D]" />}
            >
              <SlideToApprove />
            </GlassPanel>
          </div>
        )}

        {/* Live Terminal — always shown once there are logs */}
        {logs.length > 0 && (
          <div className={
            actionItems.length > 0 ? "lg:col-span-2" : "lg:col-span-3"
          }>
            <GlassPanel
              title="Agent Reasoning Terminal"
              icon={<Terminal className="w-4 h-4 text-[#5EE0FF]" />}
            >
              <LiveTerminal />
            </GlassPanel>
          </div>
        )}

        {/* Step Inspector — only when goal steps exist */}
        {planSteps.length > 0 && (
          <div className="lg:col-span-1">
            <GlassPanel
              title="Goal Step Inspector"
              icon={<Cpu className="w-4 h-4 text-purple-400" />}
            >
              <StepInspector />
            </GlassPanel>
          </div>
        )}
      </div>
    </div>
  );
}
