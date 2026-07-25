"use client";

import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, Radio, Plane, Train, Building2, Wind } from "lucide-react";

type AncMode = "anc" | "ambient" | "off";
type Environment = "airport" | "subway" | "office" | "street";

export default function SonyAncSimulator() {
  const [mode, setMode] = useState<AncMode>("anc");
  const [environment, setEnvironment] = useState<Environment>("airport");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated Waveform Canvas for ANC Cancellation Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      phase += 0.05;

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw Ambient Noise Wave (Reddish / Amber)
      ctx.beginPath();
      ctx.strokeStyle = mode === "anc" ? "rgba(255, 92, 92, 0.25)" : "rgba(255, 184, 77, 0.8)";
      ctx.lineWidth = 2;

      for (let x = 0; x < width; x++) {
        const freq1 = environment === "airport" ? 0.02 : 0.04;
        const freq2 = environment === "subway" ? 0.05 : 0.01;
        const amp = mode === "anc" ? 8 : mode === "ambient" ? 22 : 35;
        
        const y = centerY + Math.sin(x * freq1 + phase) * amp + Math.cos(x * freq2 - phase) * (amp * 0.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw Anti-Noise Inverted Wave (Cyan / Blue) when ANC is ON
      if (mode === "anc") {
        ctx.beginPath();
        ctx.strokeStyle = "#00D6FF";
        ctx.lineWidth = 2;

        for (let x = 0; x < width; x++) {
          const freq1 = environment === "airport" ? 0.02 : 0.04;
          const freq2 = environment === "subway" ? 0.05 : 0.01;
          const amp = 8;
          
          const y = centerY - (Math.sin(x * freq1 + phase) * amp + Math.cos(x * freq2 - phase) * (amp * 0.5));
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw Resultant Pure Audio Signal (Flat Clean Cyan Line)
        ctx.beginPath();
        ctx.strokeStyle = "#3DDC84";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#3DDC84";
        ctx.shadowBlur = 10;
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [mode, environment]);

  return (
    <section id="anc-simulator" className="py-24 px-4 md:px-8 bg-[#0A0A0C] relative border-t border-b border-white/10">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[radial-gradient(circle_at_center,rgba(0,80,255,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#00D6FF]/10 text-[#00D6FF] border border-[#00D6FF]/30 text-xs font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>INTERACTIVE ANC SIMULATOR</span>
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight uppercase">
            Experience <span className="gradient-text-iteris">Absolute Quiet</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-400 font-sans leading-relaxed">
            Select an environment and toggle active noise cancellation to simulate how Iteris OS eliminates ambient frequencies in real time.
          </p>
        </div>

        {/* Interactive Simulator Control Console */}
        <div className="p-6 md:p-8 glass-card border-[#00D6FF]/20 space-y-8">
          
          {/* Top Controls: Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-1">
              <span className="text-xs font-mono text-gray-400 block uppercase tracking-wider">Acoustic Mode</span>
              <span className="text-sm font-semibold text-white">
                {mode === "anc" && "100% Active Noise Cancellation"}
                {mode === "ambient" && "Ambient Sound Mode (Level 20)"}
                {mode === "off" && "Passive Isolation"}
              </span>
            </div>

            <div className="flex p-1 rounded-full bg-black/60 border border-white/15">
              <button
                onClick={() => setMode("anc")}
                className={`px-5 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                  mode === "anc"
                    ? "bg-[#00D6FF] text-black shadow-[0_0_15px_rgba(0,214,255,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                ANC Active
              </button>
              <button
                onClick={() => setMode("ambient")}
                className={`px-5 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                  mode === "ambient"
                    ? "bg-[#0050FF] text-white shadow-[0_0_15px_rgba(0,80,255,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Ambient Sound
              </button>
              <button
                onClick={() => setMode("off")}
                className={`px-5 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                  mode === "off"
                    ? "bg-white/20 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Normal
              </button>
            </div>
          </div>

          {/* Canvas Waveform Visualizer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-gray-400">
              <span className="flex items-center space-x-2">
                <Radio className="w-3.5 h-3.5 text-[#00D6FF]" />
                <span>Real-Time Acoustic Phase Interference</span>
              </span>
              <span className="text-[#3DDC84]">
                {mode === "anc" ? "–42dB Ambient Reduction" : "0dB Passive Filter"}
              </span>
            </div>

            <div className="h-36 w-full rounded-2xl bg-black/80 border border-white/10 overflow-hidden relative p-2">
              <canvas
                ref={canvasRef}
                width={800}
                height={120}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-4 text-[10px] font-mono text-gray-500 flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span>Ambient Noise</span>
                </span>
                {mode === "anc" && (
                  <>
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-[#00D6FF]" />
                      <span>Anti-Noise Wave</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-[#3DDC84]" />
                      <span>Pure Audio Output</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Environment Selector Grid */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block">
              Simulated Ambient Environment
            </span>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: "airport", label: "Airport Cabin", icon: Plane, desc: "Jet engine rumble" },
                { id: "subway", label: "Subway Train", icon: Train, desc: "Track screech & crowd" },
                { id: "office", label: "Open Office", icon: Building2, desc: "Keyboard & murmur" },
                { id: "street", label: "City Street", icon: Wind, desc: "Traffic & wind noise" },
              ].map((env) => {
                const Icon = env.icon;
                const active = environment === env.id;
                return (
                  <button
                    key={env.id}
                    onClick={() => setEnvironment(env.id as Environment)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? "bg-[#00D6FF]/10 border-[#00D6FF] shadow-[0_0_20px_rgba(0,214,255,0.15)]"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${active ? "text-[#00D6FF]" : "text-gray-400"}`} />
                    <div className="font-mono text-xs font-bold text-white">{env.label}</div>
                    <div className="text-[11px] text-gray-400 font-sans">{env.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
