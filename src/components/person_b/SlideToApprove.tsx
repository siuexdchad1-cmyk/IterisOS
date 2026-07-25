"use client";

import React from "react";
import { ShieldAlert, CheckCircle2, XCircle, Lock } from "lucide-react";
import { useIterisStore } from "@/lib/store";

export default function SlideToApprove() {
  const { state, resolveApproval } = useIterisStore();
  const approvals = state?.approvals || [];
  const pendingApprovals = approvals.filter((a) => a.status === "pending");

  if (pendingApprovals.length === 0) {
    return (
      <div className="py-6 px-4 rounded-xl bg-white/5 border border-white/10 text-center font-mono text-xs text-gray-400 space-y-2">
        <div className="flex justify-center">
          <Lock className="w-5 h-5 text-[#3DDC84]" />
        </div>
        <p className="text-gray-300 font-medium">All System Decisions Approved</p>
        <p className="text-[11px] text-gray-500">No high-risk actions pending human authorization.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pendingApprovals.map((appr) => (
        <div
          key={appr.id}
          className="p-4 rounded-xl bg-[#FFB84D]/10 border border-[#FFB84D]/30 space-y-3 relative overflow-hidden"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-[#FFB84D]/20 text-[#FFB84D]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-white">
                  Human Approval Required
                </span>
                <span className="text-[10px] font-mono text-[#FFB84D]">
                  ID: {appr.id}
                </span>
              </div>
              <p className="text-xs text-gray-200 leading-snug">
                {appr.reason}
              </p>
            </div>
          </div>

          {/* Action Buttons & Slide to Approve */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#FFB84D]/20">
            <button
              onClick={() => resolveApproval(appr.id, false)}
              className="flex-1 py-1.5 px-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 font-mono text-xs font-medium transition-all flex items-center justify-center space-x-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>

            <button
              onClick={() => resolveApproval(appr.id, true)}
              className="flex-1 py-1.5 px-3 rounded-lg bg-[#3DDC84]/20 text-[#3DDC84] hover:bg-[#3DDC84]/30 border border-[#3DDC84]/40 font-mono text-xs font-medium transition-all flex items-center justify-center space-x-1 shadow-[0_0_10px_rgba(61,220,132,0.2)]"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Authorize Allocation</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
