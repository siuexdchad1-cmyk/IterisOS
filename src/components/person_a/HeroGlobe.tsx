'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe as GlobeIcon, Sparkles } from 'lucide-react';
import DualInputSwitcher from './DualInputSwitcher';
import { GlobePin } from '@/types';

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

export interface HeroGlobeProps {
  onGoalExecutePlaceholder?: (goal: string) => void;
  onAudioIngestPlaceholder?: (file: File) => void;
}

export const HeroGlobe: React.FC<HeroGlobeProps> = ({
  onGoalExecutePlaceholder,
  onAudioIngestPlaceholder,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedPin, setSelectedPin] = useState<GlobePin | null>(INITIAL_PINS[0]);
  const [hoveredPin, setHoveredPin] = useState<GlobePin | null>(null);

  // Mouse move radial halo tracker
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const el = containerRef.current;
    if (el) el.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (el) el.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // WebGL / Canvas 3D Rotating Sphere
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let rotationAngle = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.42;

      ctx.clearRect(0, 0, w, h);

      // Atmosphere outer radial gradient
      const outerGlow = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.35);
      outerGlow.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
      outerGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.12)');
      outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Sphere base
      const sphereGrad = ctx.createRadialGradient(
        cx - radius * 0.3,
        cy - radius * 0.3,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      sphereGrad.addColorStop(0, '#0f2b23');
      sphereGrad.addColorStop(0.6, '#061310');
      sphereGrad.addColorStop(1, '#020706');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.clip();

      // Latitudes
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.lineWidth = 1;
      for (let i = -6; i <= 6; i++) {
        const y = cy + (i * radius) / 7;
        const rScale = Math.sqrt(Math.max(0, radius * radius - (y - cy) * (y - cy)));
        ctx.beginPath();
        ctx.ellipse(cx, y, rScale, rScale * 0.25, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitudes
      rotationAngle += 0.003;
      const lonCount = 14;
      for (let i = 0; i < lonCount; i++) {
        const angle = rotationAngle + (i * Math.PI) / (lonCount / 2);
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);

        ctx.strokeStyle = cosAngle > 0 ? 'rgba(16, 185, 129, 0.22)' : 'rgba(16, 185, 129, 0.05)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius * Math.abs(cosAngle), radius, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Landmass dots along arcs
        if (cosAngle > -0.2) {
          ctx.fillStyle = cosAngle > 0.3 ? 'rgba(52, 211, 153, 0.7)' : 'rgba(16, 185, 129, 0.3)';
          for (let j = 1; j <= 5; j++) {
            const py = cy + (j - 3) * (radius * 0.25);
            const px = cx + sinAngle * Math.sqrt(Math.max(0, radius * radius - (py - cy) * (py - cy))) * 0.9;
            ctx.beginPath();
            ctx.arc(px, py, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[92vh] bg-black overflow-hidden flex flex-col justify-between pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10"
    >
      {/* Radial Cursor Light Halo */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(700px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.14), rgba(6, 182, 212, 0.05) 50%, transparent 80%)`,
        }}
      />

      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none z-0" />

      {/* Hero Header */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 glass-pill px-4 py-1.5 rounded-full text-xs font-mono text-emerald-400 border border-emerald-500/30"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>PERSON A • FRONT-END ORCHESTRATION ENGINE</span>
        </motion.div>

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

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-base sm:text-lg text-slate-400 font-light"
        >
          Ingest raw meeting transcripts or dispatch direct goals. Iteris OS coordinates multi-agent sub-tasks, detects schedule conflicts, and safely executes across global enterprise endpoints.
        </motion.p>

        {/* Dual Input Switcher Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-4"
        >
          <DualInputSwitcher
            onGoalSubmit={onGoalExecutePlaceholder}
            onFileUpload={onAudioIngestPlaceholder}
          />
        </motion.div>
      </div>

      {/* 3D WebGL Globe & Glowing Hotspots */}
      <div className="relative w-full max-w-5xl mx-auto mt-12 mb-4 flex flex-col items-center justify-center">
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

                {/* Floating Glass Card Popup */}
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
                        <span>Metric:</span>
                        <span className="text-emerald-400 font-bold">{pin.metric}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {selectedPin && (
          <div className="mt-4 glass-panel px-4 py-2 rounded-full border border-white/10 flex items-center space-x-3 text-xs text-slate-300">
            <GlobeIcon className="w-4 h-4 text-emerald-400" />
            <span>
              Active Node: <strong className="text-white">{selectedPin.city}</strong> — {selectedPin.activeAgent} ({selectedPin.taskSummary})
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroGlobe;
