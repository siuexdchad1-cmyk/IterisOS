"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  IterisOSState,
  AgentStatus,
  GoalRequest,
  GoalPlanStep,
  GoalSummary,
  MeetingIngest,
  MeetingDecision,
  MeetingActionItem,
  AgentTask,
  TerminalLogEntry,
  ApprovalRequest,
  IngestSourceType,
  LogLevel,
} from "@/types";
import { initialMockState } from "@/data/mock";

interface IterisStoreContextType {
  state: IterisOSState;
  submitGoal: (prompt: string, budget?: number, city?: string) => void;
  submitTranscript: (
    fileName: string,
    sourceType: IngestSourceType,
    rawExcerpt: string
  ) => void;
  addMeetingResult: (
    decisions: MeetingDecision[],
    actionItems: MeetingActionItem[],
    fileName?: string,
    rawExcerpt?: string
  ) => void;
  addGoalResult: (
    summary: GoalSummary,
    steps?: GoalPlanStep[],
    prompt?: string,
    budget?: number,
    city?: string
  ) => void;
  appendLog: (
    level: LogLevel,
    message: string,
    payload?: Record<string, unknown>,
    relatedTaskId?: string,
    relatedStepId?: string
  ) => void;
  resolveApproval: (approvalId: string, approved: boolean) => void;
  setAgentStatus: (status: AgentStatus) => void;
}

const defaultValue: IterisStoreContextType = {
  state: initialMockState,
  submitGoal: () => {},
  submitTranscript: () => {},
  addMeetingResult: () => {},
  addGoalResult: () => {},
  appendLog: () => {},
  resolveApproval: () => {},
  setAgentStatus: () => {},
};

const IterisContext = createContext<IterisStoreContextType>(defaultValue);

export function IterisProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<IterisOSState>(initialMockState);

  const setAgentStatus = (status: AgentStatus) => {
    setState((prev) => ({ ...prev, agentStatus: status }));
  };

  const appendLog = (
    level: LogLevel,
    message: string,
    payload?: Record<string, unknown>,
    relatedTaskId?: string,
    relatedStepId?: string
  ) => {
    const newLog: TerminalLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString().substring(11, 19),
      level,
      message,
      payload,
      relatedTaskId,
      relatedStepId,
    };
    setState((prev) => ({
      ...prev,
      logs: [newLog, ...(prev.logs || [])],
    }));
  };

  const addMeetingResult = (
    decisions: MeetingDecision[],
    actionItems: MeetingActionItem[],
    fileName?: string,
    rawExcerpt?: string
  ) => {
    const meetingId = decisions[0]?.meetingId || `mtg-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const newMeeting: MeetingIngest = {
      id: meetingId,
      fileName: fileName || "lyzr_transcript_ingest.vtt",
      sourceType: "vtt",
      uploadedAt: now,
      status: "parsed",
      durationSeconds: 1800,
      participantCount: 4,
      rawTranscriptExcerpt: rawExcerpt || "Ingested via Lyzr Meeting Extraction Agent...",
    };

    const newTasks: AgentTask[] = actionItems.map((item) => ({
      id: item.taskId || `task-m-${Date.now().toString().slice(-4)}`,
      source: "meeting",
      title: item.description.length > 50 ? `${item.description.slice(0, 47)}...` : item.description,
      description: item.description,
      status: item.status || "pending",
      priority: "high",
      owner: item.owner || { id: "usr-01", name: "Marcus Vance", email: "marcus@iteris.ai" },
      linkedMeetingId: meetingId,
      createdAt: now,
      updatedAt: now,
    }));

    setState((prev) => ({
      ...prev,
      agentStatus: "idle",
      meetings: [newMeeting, ...(prev.meetings || [])],
      decisions: [...decisions, ...(prev.decisions || [])],
      actionItems: [...actionItems, ...(prev.actionItems || [])],
      tasks: [...newTasks, ...(prev.tasks || [])],
    }));
  };

  const addGoalResult = (
    summary: GoalSummary,
    steps?: GoalPlanStep[],
    prompt?: string,
    budget?: number,
    city?: string
  ) => {
    const goalId = summary.goalId || `goal-${Date.now().toString().slice(-4)}`;
    const taskId = `task-g-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const newGoal: GoalRequest = {
      id: goalId,
      prompt: prompt || summary.whatWasDone,
      submittedAt: now,
      status: "completed",
      budget,
      currency: "USD",
      city: city || "New York",
    };

    const newTask: AgentTask = {
      id: taskId,
      source: "goal",
      title: (prompt || summary.whatWasDone).slice(0, 47) + "...",
      description: prompt || summary.whatWasDone,
      status: "completed",
      priority: budget && budget > 10000 ? "urgent" : "high",
      owner: { id: "usr-03", name: "Elena Rostova", email: "elena@iteris.ai" },
      city: city || "New York",
      linkedGoalId: goalId,
      createdAt: now,
      updatedAt: now,
    };

    setState((prev) => ({
      ...prev,
      agentStatus: "idle",
      goals: [newGoal, ...(prev.goals || [])],
      // Keep only the 3 most recent summaries — old test results don't pile up
      goalSummaries: [summary, ...(prev.goalSummaries || [])].slice(0, 3),
      planSteps: [...(steps || []), ...(prev.planSteps || [])],
      tasks: [newTask, ...(prev.tasks || [])],
    }));
  };

  const submitGoal = (prompt: string, budget?: number, city?: string) => {
    const goalId = `goal-${Date.now().toString().slice(-4)}`;
    const taskId = `task-g-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const newGoal: GoalRequest = {
      id: goalId,
      prompt,
      submittedAt: now,
      status: "in_progress",
      budget,
      currency: "USD",
      city: city || "New York",
    };

    const newSteps: GoalPlanStep[] = [
      {
        id: `step-${goalId}-1`,
        goalId,
        order: 1,
        description: `Analyze objective: "${prompt.slice(0, 45)}..."`,
        status: "in_progress",
        retryCount: 0,
        maxRetries: 3,
        requiresClarification: false,
        startedAt: now,
        toolCalls: [
          {
            id: `tc-${Date.now()}-1`,
            stepId: `step-${goalId}-1`,
            toolName: "parseHighLevelGoal",
            input: { prompt, targetCity: city || "New York", budget },
            output: { status: "decomposed", stepsCount: 3 },
            status: "success",
            durationMs: 340,
            timestamp: now,
          },
        ],
      },
      {
        id: `step-${goalId}-2`,
        goalId,
        order: 2,
        description: "Execute agentic tool pipeline & resource allocation",
        status: "pending",
        retryCount: 0,
        maxRetries: 3,
        requiresClarification: false,
        toolCalls: [],
      },
    ];

    const newTask: AgentTask = {
      id: taskId,
      source: "goal",
      title: prompt.length > 50 ? `${prompt.slice(0, 47)}...` : prompt,
      description: prompt,
      status: "in_progress",
      priority: budget && budget > 10000 ? "urgent" : "high",
      owner: { id: "usr-03", name: "Elena Rostova", email: "elena@iteris.ai" },
      city: city || "New York",
      linkedGoalId: goalId,
      createdAt: now,
      updatedAt: now,
    };

    setState((prev) => ({
      ...prev,
      agentStatus: "executing",
      goals: [newGoal, ...(prev.goals || [])],
      planSteps: [...newSteps, ...(prev.planSteps || [])],
      tasks: [newTask, ...(prev.tasks || [])],
    }));

    appendLog("info", `[Direct Goal] Registered: "${prompt}"`, { goalId, budget, city }, taskId);
    appendLog(
      "tool_call",
      `Tool Executed: parseHighLevelGoal({ prompt: "${prompt.slice(0, 30)}..." })`,
      { durationMs: 340 },
      taskId,
      `step-${goalId}-1`
    );
    appendLog(
      "reflection",
      `Decomposed prompt into 2 steps. Initiated automated tool pipeline.`,
      undefined,
      taskId,
      `step-${goalId}-1`
    );
  };

  const submitTranscript = (
    fileName: string,
    sourceType: IngestSourceType,
    rawExcerpt: string
  ) => {
    const meetingId = `mtg-${Date.now().toString().slice(-4)}`;
    const taskId = `task-m-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const newMeeting: MeetingIngest = {
      id: meetingId,
      fileName: fileName || "uploaded_transcript.txt",
      sourceType,
      uploadedAt: now,
      status: "parsed",
      durationSeconds: 1800,
      participantCount: 4,
      rawTranscriptExcerpt: rawExcerpt || "Automated transcript upload...",
    };

    const newDecision: MeetingDecision = {
      id: `dec-${Date.now().toString().slice(-4)}`,
      meetingId,
      summary: `Extracted strategic decision from ${fileName || "meeting transcript"}.`,
      confidence: 0.94,
      timestampInMeeting: "04:12",
    };

    const newActionItem: MeetingActionItem = {
      id: `act-${Date.now().toString().slice(-4)}`,
      meetingId,
      taskId,
      description: `Follow up on action item extracted from ${fileName || "transcript"}.`,
      owner: {
        id: "usr-01",
        name: "Marcus Vance",
        email: "marcus@iteris.ai",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      },
      deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
      status: "pending",
      remindersSent: 0,
      followUpChannel: "slack",
    };

    const isBinaryExcerpt =
      /^[\s\S]{0,60}(ftyp|ID3|\x00|\uFFFD)/.test(rawExcerpt) ||
      /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/.test(rawExcerpt.slice(0, 200));

    const cleanExcerpt = isBinaryExcerpt
      ? `Action item from ${fileName || "meeting recording"}`
      : rawExcerpt.replace(/[\x00-\x1F\x7F-\x9F]/g, "").slice(0, 80).trim() || "Action item extracted from transcript.";

    const newTask: AgentTask = {
      id: taskId,
      source: "meeting",
      title: `Action: ${fileName || "Transcript Processing"}`,
      description: cleanExcerpt,
      status: "pending",
      priority: "high",
      owner: { id: "usr-01", name: "Marcus Vance", email: "marcus@iteris.ai" },
      linkedMeetingId: meetingId,
      createdAt: now,
      updatedAt: now,
    };

    setState((prev) => ({
      ...prev,
      agentStatus: "thinking",
      meetings: [newMeeting, ...(prev.meetings || [])],
      decisions: [newDecision, ...(prev.decisions || [])],
      actionItems: [newActionItem, ...(prev.actionItems || [])],
      tasks: [newTask, ...(prev.tasks || [])],
    }));

    appendLog(
      "info",
      `[Meeting Agent] Ingested file: ${fileName || "transcript"} (${sourceType})`,
      { meetingId }
    );
    appendLog(
      "success",
      `Parsed transcript successfully. 1 Action Item & 1 Decision registered.`,
      { taskId }
    );
  };

  const resolveApproval = (approvalId: string, approved: boolean) => {
    const now = new Date().toISOString();
    setState((prev) => {
      const targetApproval = (prev.approvals || []).find((a) => a.id === approvalId);
      if (!targetApproval) return prev;

      const updatedApprovals = (prev.approvals || []).map((a) =>
        a.id === approvalId
          ? {
              ...a,
              status: (approved ? "approved" : "rejected") as ApprovalRequest["status"],
              resolvedAt: now,
              resolvedBy: { id: "usr-admin", name: "System Admin" },
            }
          : a
      );

      const updatedTasks = (prev.tasks || []).map((t) =>
        t.id === targetApproval.taskId
          ? {
              ...t,
              status: (approved ? "in_progress" : "cancelled") as AgentTask["status"],
              updatedAt: now,
            }
          : t
      );

      return {
        ...prev,
        agentStatus: approved ? "executing" : "idle",
        approvals: updatedApprovals,
        tasks: updatedTasks,
      };
    });

    appendLog(
      approved ? "success" : "warning",
      `Approval Request ${approvalId} ${approved ? "APPROVED" : "REJECTED"} by Admin.`,
      { approvalId }
    );
  };

  return (
    <IterisContext.Provider
      value={{
        state,
        submitGoal,
        submitTranscript,
        addMeetingResult,
        addGoalResult,
        appendLog,
        resolveApproval,
        setAgentStatus,
      }}
    >
      {children}
    </IterisContext.Provider>
  );
}

export function useIterisStore() {
  const context = useContext(IterisContext);
  return context || defaultValue;
}
