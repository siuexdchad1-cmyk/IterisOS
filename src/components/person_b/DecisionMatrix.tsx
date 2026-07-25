"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, Cpu, ArrowRight, BarChart2, ChevronDown, ChevronUp } from "lucide-react";
import { AutonomousDecisionResult } from "@/lib/decision-engine";

interface DecisionMatrixProps {
  decision?: AutonomousDecisionResult | null;
}

export default function DecisionMatrix({ decision }: DecisionMatrixProps) {
  const [showOptions, setShowOptions] = useState(false);

  if (!decision) {
    return (
      <div className="p-5 rounded-2xl bg-black/40 border border-white/10 text-center space-y-2">
        <Cpu className="w-6 h-6 text-[#5EE0FF] mx-auto animate-pulse" />
        <p className="font-display text-sm font-semibold text-white">Autonomous Decision Engine Ready</p>
        <p className="text-xs text-gray-400 font-sans">
          Submit any goal or meeting transcript to generate trade-off matrix & calculated decisions.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-black/50 border border-[#5EE0FF]/30 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-[#5EE0FF]" />
          <h3 className="font-display font-bold text-base text-white">
            Autonomous Strategic Decision
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#3DDC84]/15 text-[#3DDC84] border border-[#3DDC84]/30 font-bold">
            {Math.round(decision.confidenceScore * 100)}% Confidence
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
            decision.riskLevel === "low"
              ? "bg-[#3DDC84]/15 text-[#3DDC84] border-[#3DDC84]/30"
              : decision.riskLevel === "medium"
              ? "bg-[#5EE0FF]/15 text-[#5EE0FF] border-[#5EE0FF]/30"
              : "bg-[#FF5C5C]/15 text-[#FF5C5C] border-[#FF5C5C]/30"
          }`}>
            Risk: {decision.riskLevel}
          </span>
        </div>
      </div>

      {/* Selected Strategic Decision Banner */}
      <div className="p-4 rounded-xl bg-[#5EE0FF]/10 border border-[#5EE0FF]/30 space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#5EE0FF] font-bold block">
          Selected Autonomous Decision:
        </span>
        <p className="font-display font-bold text-sm text-white leading-snug">
          {decision.selectedOption}
        </p>
        <p className="text-xs text-gray-300 font-sans leading-relaxed pt-1">
          {decision.rationale}
        </p>
      </div>

      {/* Action Execution Plan */}
      {decision.actionSteps && decision.actionSteps.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-xs font-mono text-gray-400 font-semibold block">
            Generated Execution Strategy:
          </span>
          <div className="space-y-1.5">
            {decision.actionSteps.map((step, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-gray-200">
                <span className="text-[#5EE0FF] font-mono font-bold">{idx + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible Evaluated Options Trade-off Matrix */}
      {decision.evaluatedOptions && decision.evaluatedOptions.length > 0 && (
        <div className="border-t border-white/10 pt-3">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center justify-between w-full text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <span className="flex items-center space-x-1.5">
              <BarChart2 className="w-4 h-4 text-[#5EE0FF]" />
              <span>View Evaluated Trade-Off Matrix ({decision.evaluatedOptions.length} Strategies)</span>
            </span>
            {showOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showOptions && (
            <div className="mt-3 space-y-2.5">
              {decision.evaluatedOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs space-y-2 ${
                    opt.option === decision.selectedOption
                      ? "bg-[#5EE0FF]/15 border-[#5EE0FF]/40 text-white"
                      : "bg-white/5 border-white/10 text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between font-display font-semibold">
                    <span>{opt.option}</span>
                    <span className="font-mono text-[#5EE0FF]">{opt.score}/100</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[#3DDC84] font-mono block mb-1">Pros:</span>
                      {opt.pros.map((p, pIdx) => (
                        <div key={pIdx} className="text-gray-300 flex items-center space-x-1">
                          <span>• {p}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <span className="text-[#FF5C5C] font-mono block mb-1">Cons:</span>
                      {opt.cons.map((c, cIdx) => (
                        <div key={cIdx} className="text-gray-400 flex items-center space-x-1">
                          <span>• {c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
