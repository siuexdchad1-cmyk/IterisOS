import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_key_for_build",
});

export async function callAgent(
  systemPrompt: string,
  userInput: string,
  jsonMode = true
): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userInput },
    ],
    temperature: 0.4,
    ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
  });

  return completion.choices[0]?.message?.content || "";
}

export async function callAgentSafe<T = any>(
  systemPrompt: string,
  input: string,
  retries = 2
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const resultText = await callAgent(systemPrompt, input, true);
      return JSON.parse(resultText) as T;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        const backoffMs = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }
  }

  throw new Error(
    `callAgentSafe failed after ${retries + 1} attempts: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}
