"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, Wrench, RefreshCw, AlertCircle, ChevronDown } from "lucide-react";
import { useIterisStore } from "@/lib/store";
import { TaskStatus } from "@/types";

export default function StepInspector() {
  const { state } = useIterisStore();
  const planSteps = state?.planSteps || [];

  const [selectedStepId, setSelectedStepId] = useState<string | null>(
    planSteps[0]?.id || null
  );

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-[#3DDC84]" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-[#5EE0FF] animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-3 font-mono">
      {/* Plan Steps Tree */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {planSteps.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500">
            No plan steps in active goal execution.
          </div>
        ) : (
          planSteps.map((step) => {
            const isSelected = selectedStepId === step.id;
            const toolCalls = step.toolCalls || [];
            return (
              <div
                key={step.id}
                className={`p-3 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-[#5EE0FF]/10 border-[#5EE0FF]/40 shadow-[0_0_12px_rgba(94,224,255,0.15)]"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <div
                  onClick={() => setSelectedStepId(isSelected ? null : step.id)}
                  className="flex items-start justify-between cursor-pointer"
                >
                  <div className="flex items-start space-x-2.5">
                    <span className="flex-shrink-0 mt-0.5">{getStatusIcon(step.status)}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-white">
                          Step #{step.order}: {step.description}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-[10px] text-gray-400 mt-1">
                        <span className="flex items-center space-x-1">
                          <Wrench className="w-3 h-3 text-[#5EE0FF]" />
                          <span>Tool Calls: {toolCalls.length}</span>
                        </span>
                        <span>|</span>
                        <span className="flex items-center space-x-1">
                          <RefreshCw className="w-3 h-3 text-amber-400" />
                          <span>Retries: {step.retryCount}/{step.maxRetries}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      isSelected ? "rotate-180 text-[#5EE0FF]" : ""
                    }`}
                  />
                </div>

                {/* Expanded Tool Calls Detail */}
                {isSelected && toolCalls.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">
                      Executed Tool Pipeline
                    </span>
                    {toolCalls.map((tc) => (
                      <div
                        key={tc.id}
                        className="p-2 rounded bg-black/60 border border-white/10 text-[11px] space-y-1"
                      >
                        <div className="flex items-center justify-between text-[#5EE0FF]">
                          <span className="font-semibold">{tc.toolName}</span>
                          <span className="text-[10px] text-gray-400">{tc.durationMs}ms</span>
                        </div>
                        {tc.errorMessage && (
                          <div className="flex items-center space-x-1 text-red-400 text-[10px]">
                            <AlertCircle className="w-3 h-3" />
                            <span>{tc.errorMessage}</span>
                          </div>
                        )}
                        {tc.output && (
                          <div className="text-[10px] text-gray-300 font-mono bg-white/5 p-1 rounded">
                            Output: {JSON.stringify(tc.output)}
                          </div>
                        )}
                      </div>
                    ))}
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
