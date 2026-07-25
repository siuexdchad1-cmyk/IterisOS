import {
  GoalPlanStep,
  TerminalLogEntry,
  ApprovalRequest,
  MeetingActionItem,
  IterisOSState,
} from "@/types";

export const mockGoalSteps: GoalPlanStep[] = [
  {
    id: "step-1",
    goalId: "goal-1",
    order: 1,
    description: "Analyze Q2 compliance documentation & policy frameworks",
    status: "completed",
    toolCalls: [],
    retryCount: 0,
    maxRetries: 3,
    requiresClarification: false,
    startedAt: "09:30:00",
    completedAt: "09:31:12",
  },
  {
    id: "step-2",
    goalId: "goal-1",
    order: 2,
    description: "Map risk levels & flag non-compliant data access vectors",
    status: "completed",
    toolCalls: [],
    retryCount: 0,
    maxRetries: 3,
    requiresClarification: false,
    startedAt: "09:31:15",
    completedAt: "09:32:45",
  },
  {
    id: "step-3",
    goalId: "goal-1",
    order: 3,
    description: "Generate automated remediation plan & patch schedule",
    status: "in_progress",
    toolCalls: [],
    retryCount: 0,
    maxRetries: 3,
    requiresClarification: false,
    startedAt: "09:32:50",
  },
  {
    id: "step-4",
    goalId: "goal-1",
    order: 4,
    description: "Submit patch plan for human authorization & deployment",
    status: "awaiting_approval",
    toolCalls: [],
    retryCount: 0,
    maxRetries: 3,
    requiresClarification: false,
  },
];

export const mockGoalLogs: TerminalLogEntry[] = [
  {
    id: "log-1",
    timestamp: "09:30:05",
    level: "info",
    message: "Goal Agent initialized → Task: Analyze Q2 compliance gaps & map risk levels",
    payload: { agent: "Goal Agent", mode: "Autonomous", priority: "High" },
  },
  {
    id: "log-2",
    timestamp: "09:31:10",
    level: "tool_call",
    message: "Tool Executed: query_compliance_repo(quarter='Q2', depth='full')",
    payload: { tool: "query_compliance_repo", params: { quarter: "Q2", depth: "full" }, status: "success" },
  },
  {
    id: "log-3",
    timestamp: "09:32:40",
    level: "reflection",
    message: "Observation: 3 high-risk vectors identified in US-East data pipelines. Adjusting remediation strategy.",
    payload: { highRiskCount: 3, region: "US-East", strategy: "Immediate Patch" },
  },
  {
    id: "log-4",
    timestamp: "09:33:00",
    level: "success",
    message: "Remediation plan generated with 0 execution policy errors.",
    payload: { status: "success", errors: 0, confidenceScore: 0.98 },
  },
];

export const mockGoalApprovals: ApprovalRequest[] = [
  {
    id: "app-1",
    taskId: "task-101",
    reason: "Deploying automated patch to US-East production database requires human sign-off.",
    requestedAt: "09:33:15",
    status: "pending",
  },
];

export const mockGoalActionItems: MeetingActionItem[] = [
  {
    id: "act-1",
    meetingId: "m-1",
    taskId: "task-101",
    description: "Apply compliance patch to US-East access policy repository",
    owner: { id: "p1", name: "Arya Tare", email: "aryatare38@gmail.com" },
    deadline: "2026-07-27",
    status: "awaiting_approval",
    remindersSent: 1,
    followUpChannel: "slack",
  },
  {
    id: "act-2",
    meetingId: "m-1",
    taskId: "task-102",
    description: "Audit secondary API keys and update expiration tokens",
    owner: { id: "p2", name: "Dev Security Team" },
    deadline: "2026-07-28",
    status: "in_progress",
    remindersSent: 0,
    followUpChannel: "email",
  },
];

// --- Meeting Agent Mock Data ---
export const mockMeetingSteps: GoalPlanStep[] = [
  {
    id: "mstep-1",
    goalId: "meeting-1",
    order: 1,
    description: "Ingest meeting audio recording & extract speaker diarization",
    status: "completed",
    toolCalls: [],
    retryCount: 0,
    maxRetries: 3,
    requiresClarification: false,
    startedAt: "10:00:00",
    completedAt: "10:01:05",
  },
  {
    id: "mstep-2",
    goalId: "meeting-1",
    order: 2,
    description: "Extract key meeting decisions & consensus items",
    status: "completed",
    toolCalls: [],
    retryCount: 0,
    maxRetries: 3,
    requiresClarification: false,
    startedAt: "10:01:10",
    completedAt: "10:02:30",
  },
  {
    id: "mstep-3",
    goalId: "meeting-1",
    order: 3,
    description: "Auto-assign action items & sync with task matrix",
    status: "completed",
    toolCalls: [],
    retryCount: 0,
    maxRetries: 3,
    requiresClarification: false,
    startedAt: "10:02:35",
    completedAt: "10:03:15",
  },
];

export const mockMeetingLogs: TerminalLogEntry[] = [
  {
    id: "mlog-1",
    timestamp: "10:00:05",
    level: "info",
    message: "Meeting Agent initialized → Ingested Recording.m4a (14m 20s)",
    payload: { fileName: "Recording.m4a", format: "m4a", duration: "14:20" },
  },
  {
    id: "mlog-2",
    timestamp: "10:01:20",
    level: "tool_call",
    message: "Tool Executed: extract_decisions(transcript_length=4200)",
    payload: { tool: "extract_decisions", extractedCount: 4, confidence: 0.96 },
  },
  {
    id: "mlog-3",
    timestamp: "10:03:00",
    level: "success",
    message: "4 action items assigned to engineering leads with Slack notification triggers.",
    payload: { actionItemsCreated: 4, notificationsSent: true },
  },
];

export const mockMeetingApprovals: ApprovalRequest[] = [
  {
    id: "mapp-1",
    taskId: "task-201",
    reason: "Confirm budget allocation ($15,000) agreed upon during strategy sync.",
    requestedAt: "10:03:20",
    status: "pending",
  },
];

export const mockMeetingActionItems: MeetingActionItem[] = [
  {
    id: "mact-1",
    meetingId: "m-2",
    taskId: "task-201",
    description: "Finalize architecture design document for v2 agent pipeline",
    owner: { id: "p1", name: "Arya Tare", email: "aryatare38@gmail.com" },
    deadline: "2026-07-29",
    status: "pending",
    remindersSent: 2,
    followUpChannel: "slack",
  },
  {
    id: "mact-2",
    meetingId: "m-2",
    taskId: "task-202",
    description: "Schedule vendor review meeting for model fine-tuning dataset",
    owner: { id: "p3", name: "Product Ops" },
    deadline: "2026-07-30",
    status: "pending",
    remindersSent: 0,
    followUpChannel: "email",
  },
];

export const initialMockState: IterisOSState = {
  agentStatus: "idle",
  hotspots: [],
  goals: [],
  planSteps: [],
  goalSummaries: [],
  meetings: [],
  decisions: [],
  actionItems: [],
  tasks: [],
  logs: [],
  approvals: [],
};
