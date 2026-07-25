'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Zap, Upload, Play, CheckCircle2, Globe as GlobeIcon, MapPin, ArrowRight, FileAudio, FileText, Sparkles } from 'lucide-react';
import { GlobePin } from '../types';

const INITIAL_PINS: GlobePin[] = [
  {
    id: 'london-1',
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    xPercent: 48,
    yPercent: 32,
    activeAgent: 'Lyzr Booking Core',
    taskSummary: 'Checking hotel APIs ($350 savings found)',
    metric: '99.4% Match',
    status: 'Active'
  },
  {
    id: 'tokyo-2',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    xPercent: 82,
    yPercent: 41,
    activeAgent: 'Logistics Orchestrator',
    taskSummary: 'Re-routing air freight to avoid typhoons',
    metric: '-4.2 hrs delay',
    status: 'Processing'
  },
  {
    id: 'nyc-3',
    city: 'New York',
    country: 'United States',
    lat: 40.7128,
    lng: -74.0060,
    xPercent: 28,
    yPercent: 38,
    activeAgent: 'FinOps Audit Agent',
    taskSummary: 'Reconciling AWS reserved instances',
    metric: '$12.4k Saved',
    status: 'Active'
  },
  {
    id: 'singapore-4',
    city: 'Singapore',
    country: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    xPercent: 76,
    yPercent: 58,
    activeAgent: 'Data Privacy Guard',
    taskSummary: 'Scanning cross-border compliance payload',
    metric: '100% Compliant',
    status: 'Synced'
  },
  {
    id: 'dubai-5',
    city: 'Dubai',
    country: 'UAE',
    lat: 25.2048,
    lng: 55.2708,
    xPercent: 61,
    yPercent: 46,
    activeAgent: 'Vendor Negotiator',
    taskSummary: 'Automating enterprise contract renewals',
    metric: 'Pending Counter',
    status: 'Processing'
  },
  {
    id: 'sf-6',
    city: 'San Francisco',
    country: 'United States',
    lat: 37.7749,
    lng: -122.4194,
    xPercent: 16,
    yPercent: 40,
    activeAgent: 'DevOps Orchestrator',
    taskSummary: 'Triggering multi-region failover dry-run',
    metric: '0 Loss',
    status: 'Active'
  }
];

export const HeroGlobe = () => {
  // Cursor Light Halo State
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Dual-Input Mode Toggle State ('meeting' | 'goal')
  const [inputMode, setInputMode] = useState<'meeting' | 'goal'>('goal');

  // Input fields state
  const [goalText, setGoalText] = useState('');
  const [isProcessingGoal, setIsProcessingGoal] = useState(false);
  const [goalSuccessMessage, setGoalSuccessMessage] = useState('');

  // Meeting Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Active Pin Hover / Selection State
  const [selectedPin, setSelectedPin] = useState<GlobePin | null>(INITIAL_PINS[0]);
  const [hoveredPin, setHoveredPin] = useState<GlobePin | null>(null);

  // Canvas Globe Rotation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (containerEl) {
        containerEl.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Canvas 3D Rotating Sphere Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotationAngle = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.42;

      ctx.clearRect(0, 0, width, height);

      // Outer atmospheric glow
      const outerGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.35);
      outerGlow.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
      outerGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.12)');
      outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Base Globe sphere gradient
      const sphereGradient = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      sphereGradient.addColorStop(0, '#0f2b23');
      sphereGradient.addColorStop(0.6, '#061310');
      sphereGradient.addColorStop(1, '#020706');

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.clip();

      // Latitude lines
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.lineWidth = 1;
      for (let i = -6; i <= 6; i++) {
        const y = centerY + (i * radius) / 7;
        const rScale = Math.sqrt(Math.max(0, radius * radius - (y - centerY) * (y - centerY)));
        ctx.beginPath();
        ctx.ellipse(centerX, y, rScale, rScale * 0.25, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitude lines (rotating)
      rotationAngle += 0.003;
      const lonCount = 14;
      for (let i = 0; i < lonCount; i++) {
        const angle = rotationAngle + (i * Math.PI) / (lonCount / 2);
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);

        ctx.strokeStyle = cosAngle > 0 ? 'rgba(16, 185, 129, 0.22)' : 'rgba(16, 185, 129, 0.05)';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius * Math.abs(cosAngle), radius, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Render dot landmasses simulation along longitude arcs
        if (cosAngle > -0.2) {
          ctx.fillStyle = cosAngle > 0.3 ? 'rgba(52, 211, 153, 0.7)' : 'rgba(16, 185, 129, 0.3)';
          for (let j = 1; j <= 5; j++) {
            const py = centerY + (j - 3) * (radius * 0.25);
            const px = centerX + sinAngle * Math.sqrt(Math.max(0, radius * radius - (py - centerY) * (py - centerY))) * 0.9;
            ctx.beginPath();
            ctx.arc(px, py, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Goal submission handler
  const handleRunAgent = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!goalText.trim()) return;

    setIsProcessingGoal(true);
    setGoalSuccessMessage('');

    setTimeout(() => {
      setIsProcessingGoal(false);
      setGoalSuccessMessage(`Agent dispatched for: "${goalText}" — 3 sub-tasks spawned.`);
      setGoalText('');
      setTimeout(() => setGoalSuccessMessage(''), 5000);
    }, 1200);
  };

  // Drag & drop file handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadedFile(file);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[92vh] bg-black overflow-hidden flex flex-col justify-between pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10"
    >
      {/* Interactive Cursor Radial Halo Light Effect */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(700px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.14), rgba(6, 182, 212, 0.05) 50%, transparent 80%)`,
        }}
      />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none z-0" />

      {/* Hero Header Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
        
        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 glass-pill px-4 py-1.5 rounded-full text-xs font-mono text-emerald-400 border border-emerald-500/30"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>AUTONOMOUS WORKFLOW ENGINE v2.4</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none"
        >
          ITERIS OS —{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-glow-emerald">
            Autonomous Task Orchestration
          </span>{' '}
          Across Your Global Workflows.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-base sm:text-lg text-slate-400 font-light"
        >
          Ingest raw meeting transcripts or dispatch direct goals. Iteris OS coordinates multi-agent sub-tasks, detects schedule conflicts, and safely executes across global enterprise endpoints.
        </motion.p>

        {/* Dual-Input Mode Toggle & Form Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto pt-4"
        >
          {/* Glassmorphism Pill Switch */}
          <div className="glass-pill p-1.5 rounded-full inline-flex items-center space-x-2 mb-6 border border-white/10">
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

          {/* Mode Form Container */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-emerald-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative">
            <AnimatePresence mode="wait">
              {inputMode === 'goal' ? (
                <motion.form
                  key="goal-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleRunAgent}
                  className="space-y-4"
                >
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={goalText}
                      onChange={(e) => setGoalText(e.target.value)}
                      placeholder="Specify your goal (e.g. Audit SaaS expenses & resolve calendar conflicts for Tokyo team)..."
                      className="w-full bg-black/60 border border-emerald-500/30 rounded-xl px-4 py-3.5 pr-32 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                    />
                    <button
                      type="submit"
                      disabled={isProcessingGoal || !goalText.trim()}
                      className="absolute right-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-lg hover:brightness-110 disabled:opacity-50 transition flex items-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    >
                      {isProcessingGoal ? (
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
                    <span className="font-mono text-emerald-400/80">Suggestions:</span>
                    {[
                      'Audit Q3 SaaS Expenses',
                      'Optimize Tokyo Logistics',
                      'Deploy Auth Microservice to Staging'
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

                  {goalSuccessMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{goalSuccessMessage}</span>
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
                      id="meeting-file"
                      accept=".mp3,.wav,.m4a,.txt,.json,.docx"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          processFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    <label htmlFor="meeting-file" className="cursor-pointer flex flex-col items-center space-y-2">
                      <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <Upload className="w-6 h-6 animate-bounce" />
                      </div>
                      <div className="text-xs text-slate-200 font-medium">
                        Drag & drop meeting recording (<span className="text-emerald-400 font-mono">.mp3, .wav</span>) or transcript file
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Iteris OS auto-extracts action items, owners, deadlines, & API calls
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
                      <div className="flex items-center space-x-2">
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
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Interactive 3D Globe & Hotspot Pins Section */}
      <div className="relative w-full max-w-5xl mx-auto mt-12 mb-4 flex flex-col items-center justify-center">
        
        {/* Globe Container */}
        <div className="relative w-[340px] sm:w-[480px] h-[340px] sm:h-[420px] flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            className="w-full h-full max-w-full max-h-full object-contain pointer-events-none"
          />

          {/* Hotspot Pins Overlay */}
          {INITIAL_PINS.map((pin) => {
            const isSelected = selectedPin?.id === pin.id;
            const isHovered = hoveredPin?.id === pin.id;

            return (
              <div
                key={pin.id}
                style={{ top: `${pin.yPercent}%`, left: `${pin.xPercent}%` }}
                className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                onMouseEnter={() => setHoveredPin(pin)}
                onMouseLeave={() => setHoveredPin(null)}
                onClick={() => setSelectedPin(pin)}
              >
                {/* Glowing Pulse Dot Pin */}
                <div className="relative flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-emerald-400/40 animate-ping absolute"></div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border border-white transition-transform duration-300 ${
                      isSelected || isHovered
                        ? 'bg-emerald-400 scale-125 shadow-[0_0_20px_rgba(16,185,129,1)]'
                        : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]'
                    }`}
                  />
                  <span className="ml-2 px-1.5 py-0.5 rounded bg-black/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 hidden sm:inline-block">
                    {pin.city}
                  </span>
                </div>

                {/* Floating Glass Card Popup on Hover or Selection */}
                {(isHovered || isSelected) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-64 glass-panel p-3 rounded-xl border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.25)] z-30 pointer-events-auto"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-bold text-white">{pin.city}, {pin.country}</span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                        {pin.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <div className="text-[11px] font-semibold text-emerald-300">
                        {pin.activeAgent}
                      </div>
                      <p className="text-[10px] text-slate-300 leading-tight">
                        {pin.taskSummary}
                      </p>
                      <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Optimization Metric:</span>
                        <span className="text-emerald-400 font-bold">{pin.metric}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Pin Quick Banner */}
        {selectedPin && (
          <div className="mt-4 glass-panel px-4 py-2 rounded-full border border-white/10 flex items-center space-x-3 text-xs text-slate-300">
            <GlobeIcon className="w-4 h-4 text-emerald-400" />
            <span>
              Active Node Selected: <strong className="text-white">{selectedPin.city}</strong> — {selectedPin.activeAgent} ({selectedPin.taskSummary})
            </span>
          </div>
        )}
      </div>

    </section>
  );
};

export default HeroGlobe;
