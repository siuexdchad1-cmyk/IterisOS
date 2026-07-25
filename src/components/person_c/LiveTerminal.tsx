"use client";

import React, { useState } from "react";
import { Filter, ChevronRight, CornerDownRight, CheckCircle2, Zap, AlertTriangle, AlertCircle, Wrench } from "lucide-react";
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
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 border-b border-white/10 text-xs font-mono">
        <Filter className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
        {(
          ["all", "info", "tool_call", "success", "error"] as const
        ).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilter(lvl)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium tracking-wide transition-all whitespace-nowrap cursor-pointer ${
              filter === lvl
                ? "bg-[#5EE0FF]/15 text-[#5EE0FF] border border-[#5EE0FF]/30 font-semibold"
                : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
            }`}
          >
            {lvl === "all" ? "All Logs" : lvl === "tool_call" ? "Tool Calls" : lvl}
          </button>
        ))}
      </div>

      {/* Step-by-Step Timeline Container */}
      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-xs font-mono">
            No reasoning logs available yet.
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const stepNum = String(index + 1).padStart(2, "0");
            const isExpanded = expandedLogId === log.id;
            const hasDetails = Boolean(log.payload);

            return (
              <div
                key={log.id}
                className="rounded-xl bg-black/40 border border-white/10 transition-all overflow-hidden"
              >
                {/* Timeline Entry Header */}
                <div
                  onClick={() => hasDetails && setExpandedLogId(isExpanded ? null : log.id)}
                  className={`flex items-center justify-between p-3 transition-colors ${
                    hasDetails ? "cursor-pointer hover:bg-white/5" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="font-mono text-xs font-bold text-gray-500 w-6">
                      #{stepNum}
                    </span>
                    {getStatusIcon(log.level)}
                    <span className="text-xs text-gray-200 font-sans truncate font-medium">
                      {log.message}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0 ml-2">
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

                {/* Collapsible Raw Output & Details */}
                {hasDetails && isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-white/10 bg-black/60">
                    <div className="flex items-start space-x-2 text-xs text-gray-400 font-mono pt-2">
                      <CornerDownRight className="w-3.5 h-3.5 text-[#5EE0FF] flex-shrink-0 mt-0.5" />
                      <div className="w-full overflow-x-auto">
                        <span className="text-[10px] text-gray-500 block mb-1 uppercase tracking-wider font-semibold">
                          Raw Parameters & Output:
                        </span>
                        <pre className="p-2.5 rounded-lg bg-black/80 border border-white/10 text-[11px] text-[#5EE0FF]">
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
          })
        )}
      </div>
    </div>
  );
}
