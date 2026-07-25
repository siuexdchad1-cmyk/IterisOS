import { callAgentSafe } from "../../groq";
import { GoalSummary, GoalPlanStep, GoalRequest } from "../../../types";

const SYSTEM_PROMPT = `You are a summarization agent.
Given the original goal request and the list of completed, failed, or awaiting-approval plan steps with their corresponding tool outputs:

1. Write "whatWasDone" (2-3 sentences summarizing what was accomplished).
2. Write "whatFailed" (an empty string if nothing failed, or a concise description of any failed/blocked steps).
3. Write "reasoning" (explaining why the agent made the choices it did, in plain language, referencing specific tool outputs).

Respond ONLY with JSON matching this structure:
{
  "whatWasDone": string,
  "whatFailed": string,
  "reasoning": string
}`;

interface SummaryResponse {
  whatWasDone: string;
  whatFailed: string;
  reasoning: string;
}

export async function summarizeGoal(
  goal: GoalRequest,
  completedSteps: GoalPlanStep[]
): Promise<Omit<GoalSummary, "id" | "generatedAt">> {
  const payload = {
    goal,
    steps: completedSteps.map((step) => ({
      order: step.order,
      description: step.description,
      status: step.status,
      toolCalls: step.toolCalls.map((tc) => ({
        toolName: tc.toolName,
        status: tc.status,
        output: tc.output,
        errorMessage: tc.errorMessage,
      })),
    })),
  };

  const result = await callAgentSafe<SummaryResponse>(
    SYSTEM_PROMPT,
    JSON.stringify(payload)
  );

  return {
    goalId: goal.id,
    whatWasDone: result.whatWasDone || "",
    whatFailed: result.whatFailed || "",
    reasoning: result.reasoning || "",
  };
}
