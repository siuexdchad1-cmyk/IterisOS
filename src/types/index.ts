// src/types/index.ts — shared across all three branches, do not fork

export type TaskStatus =
  | "pending" | "planning" | "in_progress" | "blocked"
  | "awaiting_approval" | "completed" | "failed" | "cancelled";

export type TaskSource = "goal" | "meeting";
export type Priority = "low" | "medium" | "high" | "urgent";
export type AgentStatus = "idle" | "thinking" | "executing" | "awaiting_approval" | "error";

export interface Person {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

// --- Problem Statement 1: Goal Agent ---
export interface GoalRequest {
  id: string;
  prompt: string;
  submittedAt: string;
  status: TaskStatus;
  budget?: number;
  currency?: string;
  city?: string;
}

export interface GoalPlanStep {
  id: string;
  goalId: string;
  order: number;
  description: string;
  status: TaskStatus;
  toolCalls: ToolCall[];
  retryCount: number;
  maxRetries: number;
  requiresClarification: boolean;
  clarificationQuestion?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface ToolCall {
  id: string;
  stepId: string;
  toolName: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  status: "pending" | "success" | "error";
  errorMessage?: string;
  durationMs?: number;
  timestamp: string;
}

// Final end-to-end summary the goal agent produces once all steps resolve
export interface GoalSummary {
  id: string;
  goalId: string;
  whatWasDone: string;
  whatFailed?: string;
  reasoning: string;
  generatedAt: string;
}

export interface AgentTask {
  id: string;
  source: TaskSource;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  owner?: Person;
  deadline?: string;
  hasDeadlineConflict?: boolean;
  city?: string;
  linkedGoalId?: string;
  linkedMeetingId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HotspotTask {
  city: string;
  taskId: string;
  label: string;
  status: TaskStatus;
  lat?: number;
  lng?: number;
}

// --- Problem Statement 2: Meeting Agent ---
export type IngestSourceType = "audio" | "transcript_text" | "vtt" | "recording_url";

export interface MeetingIngest {
  id: string;
  fileName?: string;
  sourceType: IngestSourceType;
  uploadedAt: string;
  status: "queued" | "parsing" | "parsed" | "failed";
  durationSeconds?: number;
  participantCount?: number;
  rawTranscriptExcerpt?: string;
}

export interface MeetingDecision {
  id: string;
  meetingId: string;
  summary: string;
  confidence: number;
  timestampInMeeting?: string;
}

export interface MeetingActionItem {
  id: string;
  meetingId: string;
  taskId: string;
  description: string;
  owner: Person;
  deadline: string;
  status: TaskStatus;
  remindersSent: number;
  lastReminderAt?: string;
  followUpChannel: "slack" | "email" | "none";
}

// --- Shared: terminal, approval ---
export type LogLevel = "info" | "success" | "warning" | "error" | "tool_call" | "reflection";

export interface TerminalLogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  relatedTaskId?: string;
  relatedStepId?: string;
  payload?: Record<string, unknown>;
}

export interface ApprovalRequest {
  id: string;
  taskId: string;
  reason: string;
  requestedAt: string;
  expiresAt?: string;
  status: "pending" | "approved" | "rejected" | "expired";
  resolvedAt?: string;
  resolvedBy?: Person;
}

export interface IterisOSState {
  agentStatus: AgentStatus;
  goals: GoalRequest[];
  planSteps: GoalPlanStep[];
  goalSummaries: GoalSummary[];
  meetings: MeetingIngest[];
  decisions: MeetingDecision[];
  actionItems: MeetingActionItem[];
  tasks: AgentTask[];
  logs: TerminalLogEntry[];
  approvals: ApprovalRequest[];
  hotspots: HotspotTask[];
}

declare module "next/types.js";

