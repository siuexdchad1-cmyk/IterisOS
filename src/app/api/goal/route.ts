import { NextResponse } from "next/server";
import { planGoal } from "../../../lib/agents/goal/planner";
import { runGoalPlan } from "../../../lib/agents/goal/executor";
import { summarizeGoal } from "../../../lib/agents/goal/summarizer";
import { GoalRequest, GoalPlanStep, GoalSummary } from "../../../types";

export async function POST(request: Request) {
  try {
    const goal: GoalRequest = await request.json();

    if (!goal || !goal.prompt) {
      return NextResponse.json(
        { error: "Invalid GoalRequest: prompt is required." },
        { status: 400 }
      );
    }

    const goalId = goal.id || `goal-${Math.random().toString(36).substring(2, 9)}`;
    const normalizedGoal: GoalRequest = {
      ...goal,
      id: goalId,
      submittedAt: goal.submittedAt || new Date().toISOString(),
      status: goal.status || "planning",
    };

    // 1. Generate plan steps
    const rawSteps = await planGoal(normalizedGoal);

    // 2. Initialize step objects with IDs, status, toolCalls, and retries
    const initialSteps: GoalPlanStep[] = rawSteps.map((step, idx) => ({
      ...step,
      id: `step-${goalId}-${idx + 1}-${Math.random().toString(36).substring(2, 7)}`,
      goalId,
      toolCalls: [],
      status: "pending",
      retryCount: 0,
      maxRetries: step.maxRetries ?? 2,
      requiresClarification: step.requiresClarification ?? false,
    }));

    // 3. Execute the goal plan
    const { steps: executedSteps, approvals, logs } = await runGoalPlan(
      initialSteps,
      goalId
    );

    // 4. Generate goal summary
    const summaryOmit = await summarizeGoal(normalizedGoal, executedSteps);
    const summary: GoalSummary = {
      ...summaryOmit,
      id: `summary-${Math.random().toString(36).substring(2, 9)}`,
      generatedAt: new Date().toISOString(),
    };

    // 5. Return JSON response
    return NextResponse.json({
      steps: executedSteps,
      logs,
      approvals,
      summary,
    });
  } catch (error) {
    console.error("Error processing goal agent route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while executing the goal.",
      },
      { status: 500 }
    );
  }
}
