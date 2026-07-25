"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Zap,
  Upload,
  FileText,
  Send,
  CheckCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useIterisStore } from "@/lib/store";
import { IngestSourceType } from "@/types";

type InputMode = "meeting" | "goal";

export default function DualInputSwitcher() {
  const {
    submitGoal,
    submitTranscript,
    addMeetingResult,
    addGoalResult,
    appendLog,
    setAgentStatus,
  } = useIterisStore();

  const [mode, setMode] = useState<InputMode>("goal");

  // Direct Goal: single text input only
  const [goalPrompt, setGoalPrompt] = useState("");
  const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);
  const [goalError, setGoalError] = useState<string | null>(null);

  // Ingest Meeting: unchanged
  const [meetingFileName, setMeetingFileName] = useState("");
  const [sourceType, setSourceType] = useState<IngestSourceType>("transcript_text");
  const [rawTranscript, setRawTranscript] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isSubmittingMeeting, setIsSubmittingMeeting] = useState(false);
  const [isTranscribingAudio, setIsTranscribingAudio] = useState(false);
  const [meetingError, setMeetingError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Success toast
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSubmittedMessage(msg);
    setTimeout(() => setSubmittedMessage(null), 5000);
  };

  // ── Goal submit ────────────────────────────────────────────
  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const promptText = goalPrompt.trim();
    if (!promptText || isSubmittingGoal) return;

    setIsSubmittingGoal(true);
    setGoalError(null);
    setAgentStatus("executing");
    appendLog("info", `Calling Lyzr Goal Agent → "${promptText.slice(0, 60)}${promptText.length > 60 ? "…" : ""}"`);

    try {
      const res = await fetch("/api/goals/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();

      if (!data.summary) {
        throw new Error("Response missing summary — check API route logs");
      }

      addGoalResult(data.summary, data.steps, promptText);

      appendLog(
        "success",
        `Goal Agent complete. ${data.steps?.length ?? 0} reasoning steps extracted.`,
        { goalId: data.summary?.goalId }
      );
      showSuccess(`Goal processed: "${promptText.slice(0, 40)}${promptText.length > 40 ? "…" : ""}"`);
      setGoalPrompt("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setGoalError(msg);
      appendLog("error", `Goal Agent failed: ${msg}`, { prompt: promptText });

      // Graceful fallback so UI still shows something
      submitGoal(promptText);
      setAgentStatus("error");
    } finally {
      setIsSubmittingGoal(false);
    }
  };

  // ── Meeting submit ─────────────────────────────────────────
  const handleMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingMeeting) return;

    const fname = meetingFileName.trim() || "pasted_transcript.txt";
    const text = rawTranscript.trim();

    if (!text) {
      setMeetingError("Please paste transcript text or drop a file before submitting.");
      return;
    }

    // Detect if raw binary content (e.g. audio file byte stream) was submitted as text
    let cleanText = text;
    const isBinaryData =
      /^[\s\S]{0,60}(ftyp|ID3|\x00|\uFFFD)/.test(text) ||
      /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/.test(text.slice(0, 300));

    if (isBinaryData || sourceType === "audio") {
      cleanText = `Audio Meeting Recording: ${fname}\nStatus: Audio recording ingest. Extracting meeting decisions and action items.`;
    }

    setIsSubmittingMeeting(true);
    setMeetingError(null);
    setAgentStatus("thinking");
    appendLog("info", `Calling Lyzr Meeting Extraction Agent → ${fname}`);

    try {
      const res = await fetch("/api/meetings/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: cleanText, fileName: fname, sourceType }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();

      if (!data.decisions || !data.actionItems) {
        throw new Error("Response missing decisions/actionItems — check API route logs");
      }

      addMeetingResult(data.decisions, data.actionItems, fname, cleanText);

      appendLog(
        "success",
        `Meeting Agent complete. ${data.decisions.length} decision(s), ${data.actionItems.length} action item(s) extracted.`,
        { decisionsCount: data.decisions.length, actionItemsCount: data.actionItems.length }
      );

      // ── Seamless Handoff: Pass extracted summary directly to Direct Goal Agent ──
      const primaryInsight = data.decisions?.[0]?.summary || cleanText.slice(0, 150);
      const autoGoalPrompt = `Execute action plan and resolve objectives for "${fname}": ${primaryInsight}`;

      appendLog("info", `Seamless Handoff → Passing summary to Direct Goal Agent...`);

      try {
        const goalRes = await fetch("/api/goals/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: autoGoalPrompt }),
        });

        if (goalRes.ok) {
          const goalData = await goalRes.json();
          if (goalData.summary) {
            addGoalResult(goalData.summary, goalData.steps, autoGoalPrompt);
            appendLog("success", `Direct Goal Agent complete. Answer directly rendered.`);
          }
        }
      } catch (e) {
        console.warn("Auto goal execution error:", e);
      }

      showSuccess(`Parsed ${fname}: Summary & Answer generated directly.`);
      setMeetingFileName("");
      setRawTranscript("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setMeetingError(msg);
      appendLog("error", `Meeting Agent failed: ${msg}`, { fileName: fname });

      // Graceful fallback
      submitTranscript(fname, sourceType, cleanText);
      setAgentStatus("error");
    } finally {
      setIsSubmittingMeeting(false);
    }
  };

  const isAudioOrVideoFile = (filename: string, mimeType?: string) => {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    const audioVideoExts = ["mp3", "wav", "m4a", "mp4", "aac", "ogg", "webm", "flac", "wma", "m4v", "mov", "mkv"];
    return audioVideoExts.includes(ext) || Boolean(mimeType?.startsWith("audio/") || mimeType?.startsWith("video/"));
  };

  const processFile = async (file: File) => {
    setMeetingFileName(file.name);
    setMeetingError(null);

    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if (isAudioOrVideoFile(file.name, file.type)) {
      setSourceType("audio");
      setIsTranscribingAudio(true);
      setRawTranscript(`[Transcribing audio recording "${file.name}"...]`);
      appendLog("info", `Extracting spoken text from audio file → ${file.name}`);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/meetings/transcribe", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Transcription server HTTP ${res.status}`);
        }

        const data = await res.json();
        if (data.text) {
          setRawTranscript(data.text);
          appendLog(
            "success",
            `Extracted spoken text from ${file.name} (${data.text.length} chars).`,
            { source: data.source }
          );
          showSuccess(`Audio text extracted: ${file.name}`);
        } else {
          throw new Error(data.error || "No text extracted from audio");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Audio transcription unavailable";
        console.warn("Audio transcription error:", msg);
        appendLog("warning", `Audio transcription requires API key or text input for ${file.name}: ${msg}`);
        setRawTranscript("");
        setMeetingError(
          `Audio file (${file.name}) attached. Please paste the transcript text below or configure OPENAI_API_KEY in .env.local for automatic Whisper STT transcription.`
        );
      } finally {
        setIsTranscribingAudio(false);
      }
    } else {
      if (ext === "vtt") setSourceType("vtt");
      else setSourceType("transcript_text");

      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const content = ev.target.result.toString();
          setRawTranscript(content.slice(0, 8000));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full glass-panel p-4 md:p-5 rounded-2xl border border-white/10 relative">
      {/* Mode toggle */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
        <span className="text-xs font-mono text-gray-400">Select mode:</span>

        <div className="relative flex p-1 rounded-xl bg-black/40 border border-white/10 w-full sm:w-auto">
          <button
            onClick={() => { setMode("goal"); setGoalError(null); }}
            className={`relative flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              mode === "goal" ? "text-white" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {mode === "goal" && (
              <motion.div
                layoutId="input-mode-pill"
                className="absolute inset-0 bg-[#5EE0FF]/20 border border-[#5EE0FF]/40 rounded-lg shadow-[0_0_12px_rgba(94,224,255,0.3)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Zap className="w-4 h-4 text-[#5EE0FF] relative z-10" />
            <span className="relative z-10">Goal Agent</span>
          </button>

          <button
            onClick={() => { setMode("meeting"); setMeetingError(null); }}
            className={`relative flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              mode === "meeting" ? "text-white" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {mode === "meeting" && (
              <motion.div
                layoutId="input-mode-pill"
                className="absolute inset-0 bg-[#5EE0FF]/20 border border-[#5EE0FF]/40 rounded-lg shadow-[0_0_12px_rgba(94,224,255,0.3)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Mic className="w-4 h-4 text-[#5EE0FF] relative z-10" />
            <span className="relative z-10">Meeting Agent</span>
          </button>
        </div>
      </div>

      {/* Success toast */}
      <AnimatePresence>
        {submittedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 p-3 rounded-xl bg-[#3DDC84]/10 border border-[#3DDC84]/30 text-[#3DDC84] font-mono text-xs flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{submittedMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forms */}
      <AnimatePresence mode="wait">
        {mode === "goal" ? (
          <motion.form
            key="goal-form"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.18 }}
            onSubmit={handleGoalSubmit}
            className="space-y-3"
          >
            {/* Single text input with hover highlight & focus scale glow */}
            <div className={`relative flex items-center rounded-xl bg-black/60 border p-2 transition-all duration-200 hover:border-white/30 focus-within:scale-[1.005] focus-within:border-[#5EE0FF] focus-within:shadow-[0_0_20px_rgba(94,224,255,0.15)] ${
              goalError ? "border-[#FF5C5C] ring-1 ring-[#FF5C5C]/50" : "border-white/15"
            }`}>
              <span className="pl-3 font-mono text-sm text-[#5EE0FF] font-bold flex-shrink-0">$</span>
              <input
                type="text"
                value={goalPrompt}
                onChange={(e) => { setGoalPrompt(e.target.value); setGoalError(null); }}
                placeholder="$ Type a goal or upload meeting transcript..."
                disabled={isSubmittingGoal}
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-gray-500 font-mono focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!goalPrompt.trim() || isSubmittingGoal}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#5EE0FF] text-black font-display font-semibold text-xs hover:bg-[#5EE0FF]/90 hover:brightness-110 hover:-translate-y-[1px] active:scale-95 disabled:opacity-40 transition-all duration-150 shadow-[0_0_15px_rgba(94,224,255,0.4)] whitespace-nowrap flex-shrink-0 cursor-pointer"
              >
                {isSubmittingGoal ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing…</span>
                  </>
                ) : (
                  <>
                    <span>Run Task ↗</span>
                  </>
                )}
              </button>
            </div>

            {/* Loading bar */}
            {isSubmittingGoal && (
              <div className="h-0.5 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-[#5EE0FF]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
              </div>
            )}

            {/* Error banner */}
            {goalError && !isSubmittingGoal && (
              <div className="flex items-start space-x-2 p-3 rounded-xl bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 text-[#FF5C5C] font-mono text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Agent unavailable — </span>
                  {goalError}. The mock fallback data has been applied so the terminal still shows activity.
                </div>
              </div>
            )}
          </motion.form>
        ) : (
          <motion.form
            key="meeting-form"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.18 }}
            onSubmit={handleMeetingSubmit}
            className="space-y-4"
          >
            {/* Drag & Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
                dragActive
                  ? "border-[#5EE0FF] bg-[#5EE0FF]/10"
                  : "border-white/15 bg-white/5 hover:border-white/30"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".txt,.vtt,.srt,.csv,.md,.mp3,.wav,.m4a,.mp4,.aac,.ogg,.webm,.flac"
                className="hidden"
              />
              <div className="flex flex-col items-center space-y-2">
                <Upload className="w-6 h-6 text-[#5EE0FF]" />
                <div className="text-xs font-mono text-gray-300">
                  <span className="font-semibold text-white">Click or drag & drop</span> a transcript (.vtt .txt) or audio (.m4a .mp3 .wav)
                </div>
                <span className="text-[10px] text-gray-400 font-mono">
                  {meetingFileName ? `📎 ${meetingFileName}` : "or paste transcript text below"}
                </span>
              </div>
            </div>

            {isTranscribingAudio && (
              <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-[#5EE0FF]/10 border border-[#5EE0FF]/30 text-[#5EE0FF] font-mono text-xs animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                <span>Transcribing speech from {meetingFileName}... Populating transcript text below.</span>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span>Transcript text</span>
                <div className="flex items-center space-x-2">
                  <span>Format:</span>
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value as IngestSourceType)}
                    disabled={isSubmittingMeeting}
                    className="bg-[#0A0D14] text-[11px] text-[#5EE0FF] border border-white/10 rounded px-1.5 py-0.5 focus:outline-none disabled:opacity-50"
                  >
                    <option value="transcript_text">Raw text</option>
                    <option value="vtt">WebVTT (.vtt)</option>
                    <option value="audio">Audio file</option>
                    <option value="recording_url">Recording URL</option>
                  </select>
                </div>
              </div>

              <textarea
                rows={3}
                value={rawTranscript}
                onChange={(e) => { setRawTranscript(e.target.value); setMeetingError(null); }}
                disabled={isSubmittingMeeting}
                placeholder="Paste your meeting transcript here… e.g. Alice: Let's ship the auth refactor by Thursday. Bob: I'll handle the test suite."
                className={`w-full rounded-xl bg-black/60 border p-3 text-xs text-white font-mono placeholder-gray-500 focus:outline-none transition-colors disabled:opacity-50 ${
                  meetingError ? "border-[#FF5C5C]" : "border-white/15 focus:border-[#5EE0FF]"
                }`}
              />
            </div>

            {/* Loading bar */}
            {isSubmittingMeeting && (
              <div className="h-0.5 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-[#5EE0FF]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
              </div>
            )}

            {/* Error banner */}
            {meetingError && !isSubmittingMeeting && (
              <div className="flex items-start space-x-2 p-3 rounded-xl bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 text-[#FF5C5C] font-mono text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Agent unavailable — </span>
                  {meetingError}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingMeeting}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-[#5EE0FF] text-black font-display font-semibold text-xs hover:bg-[#5EE0FF]/90 transition-all shadow-[0_0_15px_rgba(94,224,255,0.4)] disabled:opacity-50"
              >
                {isSubmittingMeeting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting…</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Extract Action Items</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
