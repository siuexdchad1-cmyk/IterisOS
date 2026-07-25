"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Zap, Activity } from "lucide-react";

export default function SonyAudioUpscaler() {
  const [upscaleActive, setUpscaleActive] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Frequency spectrum visualizer animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.04;

      const width = canvas.width;
      const height = canvas.height;
      const bars = 48;
      const barWidth = (width / bars) - 2;

      for (let i = 0; i < bars; i++) {
        const isHighFreq = i > bars * 0.55;
        let barHeight = (Math.sin(i * 0.2 + t) * 0.4 + Math.cos(i * 0.1 - t) * 0.4 + 0.5) * (height * 0.7);

        if (!upscaleActive && isHighFreq) {
          barHeight *= 0.15;
        }

        const x = i * (barWidth + 2);
        const y = height - barHeight;

        const grad = ctx.createLinearGradient(0, height, 0, 0);
        if (upscaleActive) {
          grad.addColorStop(0, "#0050FF");
          grad.addColorStop(1, "#00D6FF");
        } else {
          grad.addColorStop(0, "rgba(255, 255, 255, 0.1)");
          grad.addColorStop(1, "rgba(255, 255, 255, 0.4)");
        }

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [upscaleActive]);

  return (
    <section id="sound-upscaler" className="py-24 px-4 md:px-8 bg-[#0A0A0C] relative border-t border-b border-white/10">
      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#0050FF]/10 text-[#00D6FF] border border-[#0050FF]/30 text-xs font-mono">
            <Sparkles className="w-4 h-4" />
            <span>DSEE EXTREME™ AI AUDIO ENHANCEMENT</span>
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight uppercase">
            Restoring <span className="gradient-text-iteris">Lost Detail</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-400 font-sans leading-relaxed">
            Using Edge-AI trained on thousands of studio recordings, DSEE Extreme dynamically restores high-frequency harmonics stripped away by digital compression.
          </p>
        </div>

        {/* Comparison Console Card */}
        <div className="p-6 md:p-8 glass-card border-[#0050FF]/30 space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl ${upscaleActive ? "bg-[#00D6FF] text-black" : "bg-white/10 text-gray-400"}`}>
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-gray-400 block uppercase">Audio Signal Mode</span>
                <span className="text-sm font-bold text-white">
                  {upscaleActive ? "AI High-Res Upscaling (LDAC 990kbps)" : "Standard Compressed MP3 (128kbps)"}
                </span>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => setUpscaleActive(!upscaleActive)}
              className={`px-6 py-2.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                upscaleActive
                  ? "iteris-btn-primary"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{upscaleActive ? "DSEE Extreme: ON" : "DSEE Extreme: OFF"}</span>
            </button>
          </div>

          {/* Spectrum Analyzer Canvas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-gray-400">
              <span>Frequency Spectrum (20Hz - 40,000Hz)</span>
              <span className={upscaleActive ? "text-[#00D6FF]" : "text-gray-500"}>
                {upscaleActive ? "Full Harmonic Curve Restored" : "High Frequencies Truncated"}
              </span>
            </div>

            <div className="h-32 w-full rounded-2xl bg-black/80 border border-white/10 p-2 overflow-hidden relative">
              <canvas
                ref={canvasRef}
                width={800}
                height={120}
                className="w-full h-full object-cover"
              />
              
              {!upscaleActive && (
                <div className="absolute top-0 bottom-0 left-[55%] w-[2px] bg-red-500/80 border-r border-red-500/40 flex items-center">
                  <span className="text-[9px] font-mono text-red-400 bg-black/80 px-1 py-0.5 rounded -rotate-90 origin-left">
                    Cutoff 14kHz
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Metric comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Bitrate Transfer</span>
              <div className="font-display font-bold text-lg text-white">
                {upscaleActive ? "990 kbps (LDAC)" : "328 kbps (SBC)"}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Sampling Rate</span>
              <div className="font-display font-bold text-lg text-[#00D6FF]">
                {upscaleActive ? "96 kHz / 24-bit" : "44.1 kHz / 16-bit"}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Audio Fidelity</span>
              <div className="font-display font-bold text-lg text-[#3DDC84]">
                {upscaleActive ? "Studio Master Quality" : "Standard Stream"}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
