import { callAgentSafe } from "../../groq";
import { GoalRequest, GoalPlanStep } from "../../../types";

const SYSTEM_PROMPT = `You are a task-decomposition agent.
Given ONE high-level user instruction (e.g. "Plan a Goa trip for next weekend within Rs.15,000"), break it into an ordered list of concrete steps needed to complete the task end-to-end.

Each step should have a short description and indicate which tool it needs (choose from: searchOptions, compareOptions, estimateCost, buildPlan, fetchCloudMetrics, runOptimizationModel, verifyBudgetCap, notifyStakeholders, or a sensible new tool name).

Respond ONLY with JSON:
{
  "steps": [
    { "order": number, "description": string, "suggestedTool": string, "maxRetries": number }
  ]
}`;

interface RawPlanStep {
  order: number;
  description: string;
  suggestedTool: string;
  maxRetries: number;
}

interface PlanResponse {
  steps: RawPlanStep[];
}

export async function planGoal(
  goal: GoalRequest
): Promise<Omit<GoalPlanStep, "id" | "toolCalls" | "status" | "retryCount">[]> {
  const result = await callAgentSafe<PlanResponse>(
    SYSTEM_PROMPT,
    JSON.stringify(goal)
  );

  const steps = result.steps || [];

  return steps.map((step, idx) => ({
    goalId: goal.id,
    order: step.order ?? idx + 1,
    description: step.description,
    suggestedTool: step.suggestedTool,
    maxRetries: typeof step.maxRetries === "number" ? step.maxRetries : 2,
    requiresClarification: false,
  }));
}
