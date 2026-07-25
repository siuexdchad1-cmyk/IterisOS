"use client";

import React, { useState } from "react";
import { Filter, ChevronRight, CornerDownRight } from "lucide-react";
import { useIterisStore } from "@/lib/store";
import { LogLevel } from "@/types";

export default function LiveTerminal() {
  const { state } = useIterisStore();
  const logs = state?.logs || [];
  const [filter, setFilter] = useState<LogLevel | "all">("all");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = logs.filter(
    (log) => filter === "all" || log.level === filter
  );

  const getLevelBadge = (level: LogLevel) => {
    switch (level) {
      case "info":
        return "text-[#5EE0FF] bg-[#5EE0FF]/10 border-[#5EE0FF]/20";
      case "tool_call":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "reflection":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "success":
        return "text-[#3DDC84] bg-[#3DDC84]/10 border-[#3DDC84]/20";
      case "warning":
        return "text-[#FFB84D] bg-[#FFB84D]/10 border-[#FFB84D]/20";
      case "error":
        return "text-[#FF5C5C] bg-[#FF5C5C]/10 border-[#FF5C5C]/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-3 font-mono">
      {/* Top Log Level Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 border-b border-white/10 text-[10px]">
        <Filter className="w-3 h-3 text-gray-400 flex-shrink-0" />
        {(
          ["all", "info", "tool_call", "reflection", "success", "warning", "error"] as const
        ).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilter(lvl)}
            className={`px-2 py-0.5 rounded uppercase font-mono tracking-wider transition-all whitespace-nowrap ${
              filter === lvl
                ? "bg-[#5EE0FF]/20 text-[#5EE0FF] border border-[#5EE0FF]/40"
                : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Terminal Output Window */}
      <div className="bg-[#05070A] rounded-xl p-3 border border-white/10 max-h-[320px] overflow-y-auto space-y-2 text-xs">
        {filteredLogs.length === 0 ? (
          <div className="py-6 text-center text-gray-500 text-xs">
            No logs matched filter "{filter}".
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="group space-y-1">
              <div
                onClick={() =>
                  log.payload && setExpandedLogId(expandedLogId === log.id ? null : log.id)
                }
                className={`flex items-start space-x-2 py-1 px-1.5 rounded transition-colors ${
                  log.payload ? "cursor-pointer hover:bg-white/5" : ""
                }`}
              >
                <span className="text-gray-500 text-[10px] select-none">
                  [{log.timestamp}]
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded border text-[9px] uppercase font-bold tracking-wider ${getLevelBadge(
                    log.level
                  )}`}
                >
                  {log.level}
                </span>
                <span className="text-gray-200 flex-1 leading-snug break-words">
                  {log.message}
                </span>
                {log.payload && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform ${
                      expandedLogId === log.id ? "rotate-90 text-[#5EE0FF]" : ""
                    }`}
                  />
                )}
              </div>

              {/* Expanded JSON Payload Drawer */}
              {log.payload && expandedLogId === log.id && (
                <div className="ml-14 p-2 rounded bg-black/80 border border-white/10 text-[11px] text-[#5EE0FF] overflow-x-auto flex items-start space-x-2">
                  <CornerDownRight className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <pre className="font-mono text-[10px] text-gray-300">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
