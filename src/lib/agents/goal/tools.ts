export async function executeTool(
  toolName: string,
  input: Record<string, unknown>
): Promise<{
  output?: Record<string, unknown>;
  status: "success" | "error";
  errorMessage?: string;
  durationMs: number;
}> {
  // Simulate realistic tool execution latency (200ms - 900ms)
  const durationMs = Math.floor(Math.random() * 701) + 200;
  await new Promise((resolve) => setTimeout(resolve, durationMs));

  switch (toolName) {
    case "fetchCloudMetrics":
      return {
        status: "success",
        output: {
          cpuAvg: "84.2%",
          p99LatencyMs: 340,
          bottleneckDetected: true,
        },
        durationMs,
      };

    case "runOptimizationModel":
      return {
        status: "success",
        output: {
          recommendedNodes: 12,
          costPerMonth: 2450,
        },
        durationMs,
      };

    case "verifyBudgetCap": {
      const allocated = Number(input.allocated ?? 0);
      const threshold = Number(input.threshold ?? 10000);

      if (allocated > threshold) {
        return {
          status: "error",
          errorMessage:
            "Requires managerial approval for allocations exceeding $" +
            threshold,
          durationMs,
        };
      }

      return {
        status: "success",
        output: {
          verified: true,
          allocated,
          threshold,
        },
        durationMs,
      };
    }

    case "notifyStakeholders":
      return {
        status: "success",
        output: {
          sent: true,
          channel: "slack",
        },
        durationMs,
      };

    case "searchOptions":
      return {
        status: "success",
        output: {
          resultsCount: 3,
          options: [
            {
              id: "opt-1",
              name: `${input.query || input.category || "Option"} Alpha`,
              score: 4.8,
              estimatedCost: 1200,
            },
            {
              id: "opt-2",
              name: `${input.query || input.category || "Option"} Beta`,
              score: 4.5,
              estimatedCost: 1800,
            },
            {
              id: "opt-3",
              name: `${input.query || input.category || "Option"} Gamma`,
              score: 4.2,
              estimatedCost: 950,
            },
          ],
          query: input.query || input.topic || "search",
        },
        durationMs,
      };

    case "compareOptions":
      return {
        status: "success",
        output: {
          recommendedOption: "Option Alpha",
          evaluation: {
            costEfficiency: "High",
            feasibilityScore: 0.94,
            riskLevel: "Low",
          },
          comparedCount: Array.isArray(input.options) ? input.options.length : 3,
        },
        durationMs,
      };

    case "estimateCost":
      return {
        status: "success",
        output: {
          estimatedTotal: typeof input.amount === "number" ? input.amount : 3600,
          currency: "USD",
          breakdown: {
            baseService: 2800,
            contingency: 800,
          },
        },
        durationMs,
      };

    case "buildPlan":
      return {
        status: "success",
        output: {
          planId: "plan-" + Math.floor(Math.random() * 9000 + 1000),
          stepsCount: 4,
          phases: [
            "1. Discovery & Setup",
            "2. Allocation & Configuration",
            "3. Execution & Testing",
            "4. Review & Approval",
          ],
          estimatedDurationDays: 14,
        },
        durationMs,
      };

    default:
      return {
        status: "success",
        output: {
          simulated: true,
          toolName,
          inputReceived: input,
          message: `Executed simulated tool '${toolName}' successfully.`,
        },
        durationMs,
      };
  }
}
