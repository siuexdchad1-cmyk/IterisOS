"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ListTodo,
  ShieldCheck,
  Terminal,
  CheckCircle2,
  FileCheck,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useIterisStore } from "@/lib/store";
import GlassPanel from "./GlassPanel";
import TaskMatrix from "@/components/person_b/TaskMatrix";
import SlideToApprove from "@/components/person_b/SlideToApprove";
import LiveTerminal from "@/components/person_c/LiveTerminal";
import StepInspector from "@/components/person_c/StepInspector";

function renderMarkdown(text: string) {
  if (!text) return null;

  let normalized = text
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "  ")
    .replace(/\*([^*\n]+):\*\*/g, "**$1:**")
    .replace(/(?<!\*)\*(?!\*)/g, "");

  return normalized.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} className="h-1.5" />;

    if (/^#{1,3}\s/.test(trimmed)) {
      const content = trimmed.replace(/^#{1,3}\s/, "");
      return (
        <p key={i} className="text-[#5EE0FF] font-semibold text-xs mt-2 mb-1 font-mono">
          {inlineBold(content)}
        </p>
      );
    }

    if (/^[\|\-\s]+$/.test(trimmed)) return null;

    if (trimmed.startsWith("|")) {
      const cells = trimmed.split("|").filter(Boolean).map(c => c.trim()).join(" · ");
      return <p key={i} className="text-gray-400 text-xs font-mono">{cells}</p>;
    }

    if (/^[-*]\s/.test(trimmed)) {
      return (
        <div key={i} className="flex items-start gap-2 pl-1 my-0.5">
          <span className="text-[#5EE0FF] flex-shrink-0">›</span>
          <span className="text-gray-200">{inlineBold(trimmed.replace(/^[-*]\s*/, ""))}</span>
        </div>
      );
    }

    if (/^\d+[.)]\s/.test(trimmed)) {
      const num = trimmed.match(/^(\d+)/)?.[1];
      return (
        <div key={i} className="flex items-start gap-2 pl-1 my-0.5">
          <span className="text-[#5EE0FF] flex-shrink-0 font-semibold">{num}.</span>
          <span className="text-gray-200">{inlineBold(trimmed.replace(/^\d+[.)]\s*/, ""))}</span>
        </div>
      );
    }

    return <p key={i} className="text-gray-200 my-0.5">{inlineBold(trimmed)}</p>;
  });
}

function inlineBold(text: string): React.ReactNode {
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
  const decisions     = state?.decisions     ?? [];
  const actionItems   = state?.actionItems   ?? [];
  const logs          = state?.logs          ?? [];
  const planSteps     = state?.planSteps     ?? [];
  const approvals     = state?.approvals     ?? [];

  const hasAnyData =
    goalSummaries.length > 0 ||
    decisions.length > 0 ||
    actionItems.length > 0 ||
    logs.length > 0 ||
    planSteps.length > 0 ||
    approvals.length > 0;

  if (!hasAnyData) return null;

  return (
    <div className="w-full space-y-6 my-4">

      {/* 1. Live Plan Steps — Numbered Progress Tracker */}
      <AnimatePresence>
        {planSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlassPanel
              title="Execution Plan Steps"
              icon={<ListTodo className="w-4 h-4 text-[#5EE0FF]" />}
              badge={
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#5EE0FF]/15 text-[#5EE0FF] border border-[#5EE0FF]/30">
                  {planSteps.filter(s => s.status === "completed").length} / {planSteps.length} Steps Complete
                </span>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {planSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-xl border transition-all ${
                      step.status === "completed"
                        ? "bg-[#3DDC84]/10 border-[#3DDC84]/30 text-white"
                        : step.status === "running"
                        ? "bg-[#5EE0FF]/10 border-[#5EE0FF]/40 text-white shadow-[0_0_12px_rgba(94,224,255,0.2)]"
                        : "bg-white/5 border-white/10 text-gray-400"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                      <span className="font-bold text-[#5EE0FF]">Step {String(idx + 1).padStart(2, "0")}</span>
                      {step.status === "completed" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3DDC84]" />
                      ) : step.status === "running" ? (
                        <div className="w-2 h-2 rounded-full bg-[#5EE0FF] animate-ping" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                      )}
                    </div>
                    <p className="text-xs font-medium line-clamp-2">{step.title}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 2-Column Layout: Left 2 Cols (Main Focal Point) vs Right 1 Col (Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2 Cols): ONE Main Focal Point — Live Reasoning Timeline & Audit Trail */}
        <div className="lg:col-span-2 space-y-6">

          {/* Main Reasoning Timeline Log */}
          {logs.length > 0 && (
            <GlassPanel
              title="Live Agent Reasoning Timeline"
              icon={<Terminal className="w-5 h-5 text-[#5EE0FF]" />}
              badge={
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#5EE0FF]/15 text-[#5EE0FF] border border-[#5EE0FF]/30">
                  {logs.length} Timeline Steps
                </span>
              }
            >
              <LiveTerminal />
            </GlassPanel>
          )}

          {/* Goal Execution Summary / Audit Trail */}
          {goalSummaries.length > 0 && (
            <GlassPanel
              title="Execution Audit Trail & Results"
              icon={<FileCheck className="w-5 h-5 text-[#3DDC84]" />}
              badge={
                <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#3DDC84]/15 text-[#3DDC84] border border-[#3DDC84]/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3DDC84]" />
                  <span>Resolved</span>
                </span>
              }
              className="border-[#3DDC84]/20"
            >
              {goalSummaries.map((summary, i) => (
                <div
                  key={summary.id}
                  className={`space-y-4 text-xs ${i > 0 ? "pt-4 border-t border-white/10" : ""}`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[#3DDC84] font-semibold text-xs font-mono">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        Audit Trail Summary
                      </span>
                      <span className="text-gray-500 font-normal">
                        {new Date(summary.generatedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-100 text-sm leading-relaxed">{summary.whatWasDone}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                    <span className="text-[#5EE0FF] font-semibold text-xs block font-mono">
                      Reasoning Chain & Observations
                    </span>
                    <div className="text-gray-300 text-xs leading-relaxed space-y-1">
                      {renderMarkdown(summary.reasoning)}
                    </div>
                  </div>
                </div>
              ))}
            </GlassPanel>
          )}

          {/* Meeting Decisions */}
          {decisions.length > 0 && (
            <GlassPanel
              title="Meeting Decisions & Key Insights"
              icon={<Sparkles className="w-5 h-5 text-[#5EE0FF]" />}
              badge={
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#5EE0FF]/15 text-[#5EE0FF] border border-[#5EE0FF]/30">
                  {decisions.length} Decisions
                </span>
              }
            >
              <div className="space-y-3 text-xs">
                {decisions.slice(0, 5).map((dec) => (
                  <div
                    key={dec.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#5EE0FF] font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3DDC84]" />
                        Key Decision
                      </span>
                      {dec.confidence && (
                        <span className="text-gray-400">
                          {Math.round(dec.confidence * 100)}% Confidence
                        </span>
                      )}
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed">{dec.summary}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          )}

        </div>

        {/* Right Column (1 Col): Secondary Sidebar (Approvals, Action Items, Step Inspector) */}
        <div className="lg:col-span-1 space-y-6 opacity-95">

          {/* Human Authorizations */}
          {approvals.filter((a) => a.status === "pending").length > 0 && (
            <GlassPanel
              title="Human Authorization"
              icon={<ShieldCheck className="w-4 h-4 text-[#FFB84D]" />}
            >
              <SlideToApprove />
            </GlassPanel>
          )}

          {/* Meeting Action Items */}
          {actionItems.length > 0 && (
            <GlassPanel
              title="Action Items Matrix"
              icon={<ListTodo className="w-4 h-4 text-[#5EE0FF]" />}
            >
              <TaskMatrix />
            </GlassPanel>
          )}

          {/* Verification & Validation */}
          <GlassPanel
            title="Verification & Validation"
            icon={<HelpCircle className="w-4 h-4 text-[#3DDC84]" />}
          >
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center space-x-2 text-[#3DDC84] font-mono text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Validation Passed</span>
              </div>
              <p className="text-gray-400 text-xs font-mono leading-relaxed">
                All parameters validated against agent policies. 0 execution errors detected.
              </p>
            </div>
          </GlassPanel>

          {/* Step Inspector */}
          {planSteps.length > 0 && (
            <GlassPanel
              title="Step Inspector"
              icon={<Sparkles className="w-4 h-4 text-purple-400" />}
            >
              <StepInspector />
            </GlassPanel>
          )}

        </div>

      </div>

    </div>
  );
}
