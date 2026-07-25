import { IterisOSState } from "@/types";

// Clean initial state — no hardcoded demo data.
// Every section shows its empty state until the user submits a real goal or meeting transcript.
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
