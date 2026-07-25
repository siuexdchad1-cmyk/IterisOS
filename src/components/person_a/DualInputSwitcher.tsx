"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Zap,
  Upload,
  FileText,
  DollarSign,
  MapPin,
  Send,
  Sparkles,
  CheckCircle,
  Loader2,
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

  // Direct Goal Form state
  const [goalPrompt, setGoalPrompt] = useState("");
  const [goalBudget, setGoalBudget] = useState("15000");
  const [goalCity, setGoalCity] = useState("New York");
  const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);

  // Ingest Meeting Form state
  const [meetingFileName, setMeetingFileName] = useState("");
  const [sourceType, setSourceType] = useState<IngestSourceType>("transcript_text");
  const [rawTranscript, setRawTranscript] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isSubmittingMeeting, setIsSubmittingMeeting] = useState(false);

  // Success Feedback Toast
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const promptText = goalPrompt.trim();
    if (!promptText || isSubmittingGoal) return;

    setIsSubmittingGoal(true);
    setAgentStatus("executing");

    // Terminal log entry on API start per brief
    appendLog("info", `Calling Lyzr Goal Agent for instruction: "${promptText.slice(0, 45)}..."`);

    try {
      const res = await fetch("/api/goals/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}`);
      }

      const data = await res.json();

      // On response, update store state
      addGoalResult(
        data.summary,
        data.steps,
        promptText,
        goalBudget ? parseFloat(goalBudget) : undefined,
        goalCity
      );

      appendLog(
        "success",
        `Lyzr Goal Agent execution complete. ${data.steps?.length || 1} Reasoning Steps generated.`,
        { goalId: data.summary?.goalId }
      );

      setSubmittedMessage(`Goal processed via Lyzr Agent: "${promptText.slice(0, 35)}..."`);
      setGoalPrompt("");
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : "Network error";
      console.warn("Lyzr Goal Agent call failed, applying fallback:", errMessage);

      appendLog(
        "error",
        `Lyzr Goal Agent API call failed (${errMessage}). Applied standalone fallback.`,
        { prompt: promptText }
      );

      // Graceful fallback without breaking UI
      submitGoal(
        promptText,
        goalBudget ? parseFloat(goalBudget) : undefined,
        goalCity
      );
      setSubmittedMessage(`Goal processed (Agent fallback): "${promptText.slice(0, 35)}..."`);
    } finally {
      setIsSubmittingGoal(false);
      setTimeout(() => setSubmittedMessage(null), 4000);
    }
  };

  const handleMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingMeeting) return;

    const fname = meetingFileName.trim() || "uploaded_transcript.vtt";
    const text = rawTranscript.trim() || "Elena: We need the Tokyo node live by Friday...";

    setIsSubmittingMeeting(true);
    setAgentStatus("thinking");

    // Terminal log entry on API start per brief
    appendLog("info", `Calling Lyzr Meeting Extraction Agent for file: ${fname}...`);

    try {
      const res = await fetch("/api/meetings/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });

      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}`);
      }

      const data = await res.json();

      // On response, update store state with decisions and action items
      addMeetingResult(data.decisions, data.actionItems, fname, text);

      appendLog(
        "success",
        `Parsed transcript via Lyzr Agent. ${data.decisions?.length || 0} Decisions & ${data.actionItems?.length || 0} Action Items extracted.`,
        { decisionsCount: data.decisions?.length, actionItemsCount: data.actionItems?.length }
      );

      setSubmittedMessage(`Transcript ingested via Lyzr Agent: ${fname}`);
      setMeetingFileName("");
      setRawTranscript("");
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : "Network error";
      console.warn("Lyzr Meeting Agent call failed, applying fallback:", errMessage);

      appendLog(
        "error",
        `Lyzr Meeting Agent API call failed (${errMessage}). Applied standalone fallback.`,
        { fileName: fname }
      );

      // Graceful fallback without breaking UI
      submitTranscript(fname, sourceType, text);
      setSubmittedMessage(`Transcript ingested (Agent fallback): ${fname}`);
    } finally {
      setIsSubmittingMeeting(false);
      setTimeout(() => setSubmittedMessage(null), 4000);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setMeetingFileName(file.name);
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "vtt") setSourceType("vtt");
      else if (ext === "mp3" || ext === "wav") setSourceType("audio");
      else setSourceType("transcript_text");

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setRawTranscript(event.target.result.toString().slice(0, 400));
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full glass-panel p-5 md:p-6 rounded-2xl border border-white/10 my-4 relative overflow-hidden">
      {/* Top Controls: Animated Mode Switcher Pill */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4 mb-5">
        <div>
          <h3 className="font-display font-semibold text-white text-base flex items-center space-x-2">
            <span>Lyzr Agent Orchestration Bar</span>
            <Sparkles className="w-4 h-4 text-[#5EE0FF]" />
          </h3>
          <p className="text-xs text-gray-400 font-mono">
            Directly invocation interface connected to deployed Lyzr Studio Agents
          </p>
        </div>

        {/* Pill Selector */}
        <div className="relative flex p-1 rounded-xl bg-black/40 border border-white/10 w-full sm:w-auto">
          <button
            onClick={() => setMode("goal")}
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
            <span className="relative z-10">⚡ Direct Goal Agent</span>
          </button>

          <button
            onClick={() => setMode("meeting")}
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
            <span className="relative z-10">🎙️ Meeting Agent</span>
          </button>
        </div>
      </div>

      {/* Submitted Feedback Toast */}
      <AnimatePresence>
        {submittedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 rounded-xl bg-[#3DDC84]/10 border border-[#3DDC84]/30 text-[#3DDC84] font-mono text-xs flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{submittedMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Content Forms */}
      <AnimatePresence mode="wait">
        {mode === "goal" ? (
          /* Goal Agent Input Form */
          <motion.form
            key="goal-form"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleGoalSubmit}
            className="space-y-4"
          >
            {/* Terminal Command Input Bar */}
            <div className="relative flex items-center rounded-xl bg-black/60 border border-white/15 p-2 focus-within:border-[#5EE0FF] focus-within:ring-1 focus-within:ring-[#5EE0FF] transition-all">
              <span className="pl-3 font-mono text-sm text-[#5EE0FF] font-bold">$</span>
              <input
                type="text"
                value={goalPrompt}
                onChange={(e) => setGoalPrompt(e.target.value)}
                placeholder="Instruction for Lyzr Goal Agent (e.g. Deconstruct bottleneck and re-allocate compute budget)..."
                disabled={isSubmittingGoal}
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-gray-500 font-mono focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!goalPrompt.trim() || isSubmittingGoal}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#5EE0FF] text-black font-display font-semibold text-xs hover:bg-[#5EE0FF]/90 disabled:opacity-40 disabled:hover:bg-[#5EE0FF] transition-all shadow-[0_0_15px_rgba(94,224,255,0.4)] whitespace-nowrap"
              >
                {isSubmittingGoal ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Lyzr Running...</span>
                  </>
                ) : (
                  <>
                    <span>Dispatch Goal</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Additional Goal Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <DollarSign className="w-4 h-4 text-[#5EE0FF]" />
                <span className="text-xs font-mono text-gray-400">Budget ($):</span>
                <input
                  type="number"
                  value={goalBudget}
                  onChange={(e) => setGoalBudget(e.target.value)}
                  placeholder="15000"
                  disabled={isSubmittingGoal}
                  className="bg-transparent text-xs font-mono text-white focus:outline-none w-full disabled:opacity-50"
                />
              </div>

              <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <MapPin className="w-4 h-4 text-[#5EE0FF]" />
                <span className="text-xs font-mono text-gray-400">Target Node:</span>
                <select
                  value={goalCity}
                  onChange={(e) => setGoalCity(e.target.value)}
                  disabled={isSubmittingGoal}
                  className="bg-[#0A0D14] text-xs font-mono text-white focus:outline-none w-full cursor-pointer border-none disabled:opacity-50"
                >
                  <option value="New York">New York (US-East)</option>
                  <option value="London">London (EU-West)</option>
                  <option value="Tokyo">Tokyo (APAC)</option>
                </select>
              </div>
            </div>
          </motion.form>
        ) : (
          /* Meeting Agent Ingest Form */
          <motion.form
            key="meeting-form"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleMeetingSubmit}
            className="space-y-4"
          >
            {/* Drag & Drop File Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
                dragActive
                  ? "border-[#5EE0FF] bg-[#5EE0FF]/10"
                  : "border-white/15 bg-white/5 hover:border-white/30"
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="w-6 h-6 text-[#5EE0FF]" />
                <div className="text-xs font-mono text-gray-300">
                  <span className="font-semibold text-white">Drag & drop recording or transcript</span> (.mp3, .wav, .txt, .vtt)
                </div>
                <span className="text-[10px] text-gray-500 font-mono">
                  {meetingFileName ? `Selected: ${meetingFileName}` : "or paste transcript excerpt below"}
                </span>
              </div>
            </div>

            {/* Source Type & Transcript Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span>Transcript Excerpt</span>
                <div className="flex items-center space-x-2">
                  <span>Source:</span>
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value as IngestSourceType)}
                    disabled={isSubmittingMeeting}
                    className="bg-[#0A0D14] text-[11px] text-[#5EE0FF] border border-white/10 rounded px-1.5 py-0.5 focus:outline-none disabled:opacity-50"
                  >
                    <option value="transcript_text">Raw Text</option>
                    <option value="vtt">WebVTT (.vtt)</option>
                    <option value="audio">Audio (.mp3/.wav)</option>
                    <option value="recording_url">Recording URL</option>
                  </select>
                </div>
              </div>

              <textarea
                rows={2}
                value={rawTranscript}
                onChange={(e) => setRawTranscript(e.target.value)}
                disabled={isSubmittingMeeting}
                placeholder="Elena: We need the Tokyo node live by Friday. Marcus owns the GDPR compliance audit..."
                className="w-full rounded-xl bg-black/60 border border-white/15 p-3 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-[#5EE0FF] disabled:opacity-50"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingMeeting}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-[#5EE0FF] text-black font-display font-semibold text-xs hover:bg-[#5EE0FF]/90 transition-all shadow-[0_0_15px_rgba(94,224,255,0.4)] disabled:opacity-50"
              >
                {isSubmittingMeeting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Parsing via Lyzr...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Extract Matrix via Lyzr</span>
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
