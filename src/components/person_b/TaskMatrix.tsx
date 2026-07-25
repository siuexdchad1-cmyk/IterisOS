"use client";

import React, { useState } from "react";
import {
  ListTodo,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  User,
  MessageSquare,
  Mail,
} from "lucide-react";
import { useIterisStore } from "@/lib/store";
import { TaskStatus } from "@/types";

export default function TaskMatrix() {
  const { state } = useIterisStore();
  const actionItems = state?.actionItems || [];
  const tasks = state?.tasks || [];

  const [tab, setTab] = useState<"pending" | "completed">("pending");

  const filteredActionItems = actionItems.filter((item) => {
    if (tab === "completed") {
      return item.status === "completed";
    }
    return item.status !== "completed";
  });

  const pendingCount = actionItems.filter((i) => i.status !== "completed").length;
  const completedCount = actionItems.filter((i) => i.status === "completed").length;

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#3DDC84]/15 text-[#3DDC84] border border-[#3DDC84]/30">
            Completed
          </span>
        );
      case "awaiting_approval":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#FFB84D]/15 text-[#FFB84D] border border-[#FFB84D]/30">
            Approval Needed
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#5EE0FF]/15 text-[#5EE0FF] border border-[#5EE0FF]/30">
            Pending Action
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Tabs: Pending vs Completed (Explicit Brief Requirement) */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setTab("pending")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center space-x-1.5 ${
              tab === "pending"
                ? "bg-[#5EE0FF]/20 text-[#5EE0FF] border border-[#5EE0FF]/30"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Matrix ({pendingCount})</span>
          </button>

          <button
            onClick={() => setTab("completed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center space-x-1.5 ${
              tab === "completed"
                ? "bg-[#3DDC84]/20 text-[#3DDC84] border border-[#3DDC84]/30"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed ({completedCount})</span>
          </button>
        </div>

      </div>

      {/* Action Items List */}
      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        {filteredActionItems.length === 0 ? (
          <div className="py-8 text-center font-mono text-xs text-gray-500">
            No {tab} action items in matrix.
          </div>
        ) : (
          filteredActionItems.map((item) => {
            const linkedTask = tasks.find((t) => t.id === item.taskId);
            return (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-semibold text-white">
                        {item.description}
                      </span>
                    </div>
                    {linkedTask?.hasDeadlineConflict && (
                      <div className="flex items-center space-x-1 text-[10px] font-mono text-[#FFB84D]">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Deadline Conflict Detected with US-East Release</span>
                      </div>
                    )}
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-gray-400">
                  {/* Owner Info */}
                  <div className="flex items-center space-x-2">
                    {item.owner?.avatarUrl ? (
                      <img
                        src={item.owner.avatarUrl}
                        alt={item.owner.name}
                        className="w-5 h-5 rounded-full object-cover border border-white/20"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="w-3 h-3 text-gray-300" />
                      </div>
                    )}
                    <span className="text-gray-300">{item.owner?.name || "Unassigned"}</span>
                  </div>

                  {/* Deadline & Reminder Info */}
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1 text-gray-400">
                      {item.followUpChannel === "slack" ? (
                        <MessageSquare className="w-3 h-3 text-[#5EE0FF]" />
                      ) : (
                        <Mail className="w-3 h-3 text-[#5EE0FF]" />
                      )}
                      <span>Reminders: {item.remindersSent}</span>
                    </span>
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-400">
                      {new Date(item.deadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
