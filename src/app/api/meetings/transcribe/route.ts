import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No audio file uploaded" },
        { status: 400 }
      );
    }

    const fileName = file.name || "recording.m4a";
    console.log(`[meetings/transcribe] Processing audio file: ${fileName} (${file.size} bytes, type: ${file.type})`);

    // Check for API keys for Whisper transcription services
    const openaiKey = process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    const hfKey = process.env.HUGGINGFACE_API_KEY;

    // 1. OpenAI Whisper API
    if (openaiKey) {
      try {
        const apiFormData = new FormData();
        apiFormData.append("file", file);
        apiFormData.append("model", "whisper-1");

        const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: { Authorization: `Bearer ${openaiKey}` },
          body: apiFormData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.text) {
            console.log(`[meetings/transcribe] OpenAI Whisper success (${data.text.length} chars)`);
            return NextResponse.json({ text: data.text, source: "openai-whisper" });
          }
        }
      } catch (e) {
        console.warn("[meetings/transcribe] OpenAI Whisper failed:", e);
      }
    }

    // 2. Groq Whisper API
    if (groqKey) {
      try {
        const apiFormData = new FormData();
        apiFormData.append("file", file);
        apiFormData.append("model", "whisper-large-v3-turbo");

        const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
          method: "POST",
          headers: { Authorization: `Bearer ${groqKey}` },
          body: apiFormData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.text) {
            console.log(`[meetings/transcribe] Groq Whisper success (${data.text.length} chars)`);
            return NextResponse.json({ text: data.text, source: "groq-whisper" });
          }
        }
      } catch (e) {
        console.warn("[meetings/transcribe] Groq Whisper failed:", e);
      }
    }

    // 3. Hugging Face Inference API
    if (hfKey) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const res = await fetch(
          "https://api-inference.huggingface.co/models/openai/whisper-large-v3-turbo",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${hfKey}`,
              "Content-Type": file.type || "audio/m4a",
            },
            body: arrayBuffer,
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data.text) {
            console.log(`[meetings/transcribe] HuggingFace Whisper success (${data.text.length} chars)`);
            return NextResponse.json({ text: data.text, source: "huggingface-whisper" });
          }
        }
      } catch (e) {
        console.warn("[meetings/transcribe] HuggingFace Whisper failed:", e);
      }
    }

    // If no Whisper API keys are configured, return clear status without fake scripts
    return NextResponse.json(
      {
        error: "Server-side Whisper API key (OPENAI_API_KEY or GROQ_API_KEY) is missing in .env.local. Please paste the written transcript text below or configure a Whisper API key.",
        source: "none",
      },
      { status: 422 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Transcription error";
    console.error("[meetings/transcribe] Server Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
