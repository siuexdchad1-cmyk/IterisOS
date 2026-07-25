'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Zap, Upload, Play, CheckCircle2, FileAudio } from 'lucide-react';

export interface DualInputSwitcherProps {
  onGoalSubmit?: (goal: string) => void;
  onFileUpload?: (file: File) => void;
  isLoading?: boolean;
}

export const DualInputSwitcher: React.FC<DualInputSwitcherProps> = ({
  onGoalSubmit,
  onFileUpload,
  isLoading = false,
}) => {
  const [inputMode, setInputMode] = useState<'goal' | 'meeting'>('goal');
  const [goalText, setGoalText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRunGoal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!goalText.trim()) return;

    if (onGoalSubmit) {
      onGoalSubmit(goalText);
    }

    setSuccessMessage(`Goal dispatched: "${goalText}"`);
    setGoalText('');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const processFile = (file: File) => {
    setUploadedFile(file);
    setUploadProgress(0);
    if (onFileUpload) {
      onFileUpload(file);
    }
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Mode Switcher Pill */}
      <div className="flex justify-center">
        <div className="glass-pill p-1.5 rounded-full inline-flex items-center space-x-2 border border-white/10">
          <button
            onClick={() => setInputMode('goal')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              inputMode === 'goal'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>⚡ Direct Goal</span>
          </button>
          <button
            onClick={() => setInputMode('meeting')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              inputMode === 'meeting'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>🎙️ Ingest Meeting</span>
          </button>
        </div>
      </div>

      {/* Form Container */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-emerald-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        <AnimatePresence mode="wait">
          {inputMode === 'goal' ? (
            <motion.form
              key="goal-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleRunGoal}
              className="space-y-4"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  placeholder="Specify your goal (e.g. Audit Q3 SaaS Expenses & Resolve Tokyo Logistics)..."
                  className="w-full bg-black/60 border border-emerald-500/30 rounded-xl px-4 py-3.5 pr-32 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                />
                <button
                  type="submit"
                  disabled={isLoading || !goalText.trim()}
                  className="absolute right-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-lg hover:brightness-110 disabled:opacity-50 transition flex items-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Run Agent</span>
                    </>
                  )}
                </button>
              </div>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 items-center pt-1">
                <span className="font-mono text-emerald-400/80">Quick Prompts:</span>
                {[
                  'Audit Q3 SaaS Expenses',
                  'Optimize Tokyo Air Freight',
                  'Deploy Microservice Patch'
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setGoalText(chip)}
                    className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:text-emerald-300 transition"
                  >
                    + {chip}
                  </button>
                ))}
              </div>

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{successMessage}</span>
                </motion.div>
              )}
            </motion.form>
          ) : (
            <motion.div
              key="meeting-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-white/15 bg-black/40 hover:border-emerald-500/40'
                }`}
              >
                <input
                  type="file"
                  id="meeting-file-person-a"
                  accept=".mp3,.wav,.m4a,.txt,.json,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="meeting-file-person-a" className="cursor-pointer flex flex-col items-center space-y-2">
                  <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Upload className="w-6 h-6 animate-bounce" />
                  </div>
                  <div className="text-xs text-slate-200 font-medium">
                    Drag & drop meeting recording (<span className="text-emerald-400 font-mono">.mp3, .wav</span>) or transcript file
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Iteris OS auto-extracts action items, owners, deadlines & API calls
                  </p>
                </label>
              </div>

              {uploadedFile && (
                <div className="p-3 rounded-xl bg-white/5 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <FileAudio className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-slate-200">{uploadedFile.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • {uploadProgress === 100 ? 'Parsed successfully' : 'Processing audio streams...'}
                      </div>
                    </div>
                  </div>
                  <div>
                    {uploadProgress === 100 ? (
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/40 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Action Plan Ready</span>
                      </span>
                    ) : (
                      <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DualInputSwitcher;
