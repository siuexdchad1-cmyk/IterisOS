import { executeTool } from "./tools";
import {
  GoalPlanStep,
  ToolCall,
  ApprovalRequest,
  TerminalLogEntry,
} from "../../../types";

function createLog(
  level: TerminalLogEntry["level"],
  message: string,
  goalId: string,
  stepId?: string,
  payload?: Record<string, unknown>
): TerminalLogEntry {
  return {
    id: `log-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date().toISOString(),
    level,
    message,
    relatedTaskId: goalId,
    relatedStepId: stepId,
    payload,
  };
}

function deriveInputForStep(
  step: GoalPlanStep,
  goalId: string
): Record<string, unknown> {
  const toolName = step.suggestedTool || "";
  const desc = step.description.toLowerCase();

  const baseInput: Record<string, unknown> = {
    description: step.description,
    goalId,
    stepOrder: step.order,
  };

  if (
    toolName === "verifyBudgetCap" ||
    desc.includes("budget") ||
    desc.includes("approval") ||
    desc.includes("cap")
  ) {
    return {
      ...baseInput,
      allocated: 12500,
      threshold: 10000,
    };
  }

  if (
    toolName === "fetchCloudMetrics" ||
    desc.includes("metrics") ||
    desc.includes("infra")
  ) {
    return {
      ...baseInput,
      region: "us-east-1",
      metricPeriod: "24h",
    };
  }

  if (toolName === "runOptimizationModel") {
    return {
      ...baseInput,
      targetCpu: "70%",
      maxCostPerMonth: 3000,
    };
  }

  if (toolName === "notifyStakeholders") {
    return {
      ...baseInput,
      channel: "slack",
      message: `Goal ${goalId} step ${step.order} execution completed.`,
    };
  }

  if (toolName === "searchOptions") {
    return {
      ...baseInput,
      query: step.description,
    };
  }

  return baseInput;
}

export async function executeStep(
  step: GoalPlanStep,
  goalId: string
): Promise<{
  step: GoalPlanStep;
  approvalNeeded?: ApprovalRequest;
  logs: TerminalLogEntry[];
}> {
  const logs: TerminalLogEntry[] = [];
  const updatedStep: GoalPlanStep = {
    ...step,
    status: "in_progress",
    startedAt: new Date().toISOString(),
    toolCalls: Array.isArray(step.toolCalls) ? [...step.toolCalls] : [],
  };

  logs.push(
    createLog(
      "info",
      `Step ${updatedStep.order} in progress: ${updatedStep.description}`,
      goalId,
      updatedStep.id
    )
  );

  const toolName = updatedStep.suggestedTool || "genericTool";
  const toolInput = deriveInputForStep(updatedStep, goalId);

  let toolResult = await executeTool(toolName, toolInput);

  const toolCall: ToolCall = {
    id: `tc-${Math.random().toString(36).substring(2, 9)}`,
    stepId: updatedStep.id,
    toolName,
    input: toolInput,
    output: toolResult.output,
    status: toolResult.status,
    errorMessage: toolResult.errorMessage,
    durationMs: toolResult.durationMs,
    timestamp: new Date().toISOString(),
  };

  updatedStep.toolCalls.push(toolCall);
  logs.push(
    createLog(
      "tool_call",
      `Tool '${toolName}' executed with status '${toolResult.status}' in ${toolResult.durationMs}ms`,
      goalId,
      updatedStep.id,
      {
        input: toolInput,
        output: toolResult.output,
        errorMessage: toolResult.errorMessage,
      }
    )
  );

  // Check if the tool call errors with a budget/approval-style message
  const isApprovalError =
    toolResult.status === "error" &&
    (toolResult.errorMessage?.toLowerCase().includes("approval") ||
      toolResult.errorMessage?.toLowerCase().includes("budget") ||
      toolResult.errorMessage?.toLowerCase().includes("exceeding"));

  if (isApprovalError) {
    updatedStep.status = "awaiting_approval";
    const approvalNeeded: ApprovalRequest = {
      id: `appr-${Math.random().toString(36).substring(2, 9)}`,
      taskId: goalId,
      reason:
        toolResult.errorMessage ||
        "Managerial approval required for execution",
      requestedAt: new Date().toISOString(),
      status: "pending",
    };

    logs.push(
      createLog(
        "warning",
        `Step ${updatedStep.order} paused for approval: ${approvalNeeded.reason}`,
        goalId,
        updatedStep.id
      )
    );

    return { step: updatedStep, approvalNeeded, logs };
  }

  // Handle retries for other types of errors
  while (
    toolResult.status === "error" &&
    updatedStep.retryCount < updatedStep.maxRetries
  ) {
    updatedStep.retryCount += 1;
    logs.push(
      createLog(
        "warning",
        `Retrying step ${updatedStep.order} (attempt ${updatedStep.retryCount}/${updatedStep.maxRetries}). Error: ${toolResult.errorMessage}`,
        goalId,
        updatedStep.id
      )
    );

    toolResult = await executeTool(toolName, toolInput);

    const retryToolCall: ToolCall = {
      id: `tc-${Math.random().toString(36).substring(2, 9)}`,
      stepId: updatedStep.id,
      toolName,
      input: toolInput,
      output: toolResult.output,
      status: toolResult.status,
      errorMessage: toolResult.errorMessage,
      durationMs: toolResult.durationMs,
      timestamp: new Date().toISOString(),
    };

    updatedStep.toolCalls.push(retryToolCall);
    logs.push(
      createLog(
        "tool_call",
        `Retry tool '${toolName}' executed with status '${toolResult.status}' in ${toolResult.durationMs}ms`,
        goalId,
        updatedStep.id,
        {
          input: toolInput,
          output: toolResult.output,
          errorMessage: toolResult.errorMessage,
        }
      )
    );
  }

  if (toolResult.status === "error") {
    updatedStep.status = "failed";
    logs.push(
      createLog(
        "error",
        `Step ${updatedStep.order} failed after ${updatedStep.retryCount} retries: ${toolResult.errorMessage}`,
        goalId,
        updatedStep.id
      )
    );
    return { step: updatedStep, logs };
  }

  // On success
  updatedStep.status = "completed";
  updatedStep.completedAt = new Date().toISOString();
  logs.push(
    createLog(
      "success",
      `Step ${updatedStep.order} completed successfully.`,
      goalId,
      updatedStep.id
    )
  );

  return { step: updatedStep, logs };
}

export async function runGoalPlan(
  steps: GoalPlanStep[],
  goalId: string
): Promise<{
  steps: GoalPlanStep[];
  approvals: ApprovalRequest[];
  logs: TerminalLogEntry[];
}> {
  const updatedSteps: GoalPlanStep[] = [...steps];
  const approvals: ApprovalRequest[] = [];
  const logs: TerminalLogEntry[] = [];

  for (let i = 0; i < updatedSteps.length; i++) {
    const stepResult = await executeStep(updatedSteps[i], goalId);
    updatedSteps[i] = stepResult.step;
    logs.push(...stepResult.logs);

    if (stepResult.approvalNeeded) {
      approvals.push(stepResult.approvalNeeded);
    }

    if (
      stepResult.step.status === "awaiting_approval" ||
      stepResult.step.status === "failed"
    ) {
      break;
    }
  }

  return { steps: updatedSteps, approvals, logs };
}
