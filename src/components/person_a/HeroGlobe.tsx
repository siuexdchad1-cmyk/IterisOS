"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
  Layers,
  BrainCircuit,
} from "lucide-react";
import { useIterisStore } from "@/lib/store";

// Animated pulse dot
function PulseDot({ color }: { color: string }) {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

// One metric tile
function StatTile({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors min-w-0">
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent }} />
        <span className="text-[11px] font-mono text-gray-400 truncate">{label}</span>
      </div>
      <span className="font-display font-bold text-xl text-white leading-none">{value}</span>
      {sub && <span className="text-[10px] font-mono text-gray-500 truncate">{sub}</span>}
    </div>
  );
}

export default function SystemStatusBanner() {
  const { state } = useIterisStore();

  // Derive counts from store
  const goals = state?.goals ?? [];
  const meetingActions = state?.actionItems ?? [];
  const logs = state?.logs ?? [];

  const completedGoals = goals.filter((g) => g.status === "completed").length;
  const pendingActions = meetingActions.filter((a) => a.status === "pending").length;
  const completedActions = meetingActions.filter((a) => a.status === "completed").length;
  const errorCount = logs.filter((l) => l.level === "error").length;

  const agentStatus = state?.agentStatus ?? "idle";
  const statusColor =
    agentStatus === "executing"
      ? "#5EE0FF"
      : agentStatus === "thinking"
      ? "#FFB84D"
      : agentStatus === "error"
      ? "#FF5C5C"
      : "#3DDC84";

  const statusLabel =
    agentStatus === "executing"
      ? "Executing"
      : agentStatus === "thinking"
      ? "Processing"
      : agentStatus === "error"
      ? "Error — Fallback Applied"
      : "Ready";

  return (
    <div className="relative w-full rounded-2xl glass-panel p-4 md:px-6 md:py-4 overflow-hidden border border-white/10 my-4">
      {/* Ambient glow */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#5EE0FF]/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#3DDC84]/6 blur-3xl pointer-events-none" />

      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#5EE0FF]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-base text-white tracking-tight">
              System Status
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              Live metrics — Lyzr Agent Pipeline
            </p>
          </div>
        </div>

        {/* Agent status pill */}
        <motion.div
          key={agentStatus}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border"
          style={{
            color: statusColor,
            borderColor: `${statusColor}40`,
            backgroundColor: `${statusColor}10`,
          }}
        >
          <PulseDot color={statusColor} />
          <span>Agent: {statusLabel}</span>
        </motion.div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile
          label="Goals Processed"
          value={goals.length}
          sub={`${completedGoals} completed`}
          icon={BrainCircuit}
          accent="#5EE0FF"
        />
        <StatTile
          label="Pending Actions"
          value={pendingActions}
          sub="from meeting agent"
          icon={Clock}
          accent="#FFB84D"
        />
        <StatTile
          label="Actions Done"
          value={completedActions}
          sub={`${meetingActions.length} total extracted`}
          icon={CheckCircle2}
          accent="#3DDC84"
        />
        <StatTile
          label="Agent Events"
          value={logs.length}
          sub={errorCount > 0 ? `${errorCount} error(s) logged` : "No errors"}
          icon={errorCount > 0 ? AlertCircle : Zap}
          accent={errorCount > 0 ? "#FF5C5C" : "#5EE0FF"}
        />
      </div>

      {/* Last log line */}
      {logs.length > 0 && (
        <div className="mt-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-black/30 border border-white/8">
          <Layers className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="font-mono text-[11px] text-gray-400 truncate">
            {logs[logs.length - 1].message}
          </span>
        </div>
      )}
    </div>
  );
}
