"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Mic, Volume2, Feather, CheckCircle2, ArrowRight } from "lucide-react";

const componentsData = [
  {
    id: "qn3",
    icon: Cpu,
    title: "Dual HD Noise Cancelling Processor QN3",
    badge: "AI ENGINE",
    summary: "Dedicated dual-processor architecture processing 48,000 acoustic samples per second.",
    details: [
      "Processes multi-mic inputs with zero phase lag",
      "Auto-adjusts cancellation curve to ear anatomy",
      "Integrated DAC + 32-bit audio signal path",
    ],
    metric: "48kHz",
    metricLabel: "Sampling Frequency",
  },
  {
    id: "driver",
    icon: Volume2,
    title: "Custom 30mm Carbon-Fiber Driver Unit",
    badge: "ACOUSTICS",
    summary: "High-rigidity dome with soft TPU edge for deep bass and extended high frequencies.",
    details: [
      "Carbon-composite dome reduces harmonic distortion",
      "Neodymium magnet with 1.5 Tesla flux density",
      "Supports native High-Resolution Audio Wireless",
    ],
    metric: "4Hz-40kHz",
    metricLabel: "Frequency Range",
  },
  {
    id: "mics",
    icon: Mic,
    title: "8-Microphone Array + Bone Conduction",
    badge: "VOICE PICKUP",
    summary: "Precision beamforming mics coupled with vibration sensors for windproof voice clarity.",
    details: [
      "4 microphones per ear cup analyzing ambient noise",
      "AI Deep Neural Network (DNN) voice isolation",
      "Bone conduction pickup for loud environment calls",
    ],
    metric: "8 Mics",
    metricLabel: "Beamforming Array",
  },
  {
    id: "comfort",
    icon: Feather,
    title: "Soft-Fit Synthetic Leather & Stepless Slider",
    badge: "ERGONOMICS",
    summary: "Luxurious noise-isolating ear cushions engineered to relieve pressure points.",
    details: [
      "Silent stepless headband slider mechanism",
      "Ergonomic swivel-and-fold collapsible joints",
      "Ultra-light 248g total weight for all-day listening",
    ],
    metric: "248g",
    metricLabel: "Total Weight",
  },
];

export default function SonyComponentMatrix() {
  const [selectedId, setSelectedId] = useState<string>("qn3");

  const activeComp = componentsData.find((c) => c.id === selectedId) || componentsData[0];

  return (
    <section id="technology" className="py-24 px-4 md:px-8 bg-[#050505] relative">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-[#00D6FF] uppercase tracking-widest block">
            INTERACTIVE ENGINEERING SHOWCASE
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight uppercase">
            Disassembled <span className="gradient-text-sony">Genius</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-400 font-sans leading-relaxed">
            Click any component to inspect the internal audio engineering breakthroughs powering the WH-1000XM6.
          </p>
        </div>

        {/* Grid + Inspector Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* 4 Cards Selector Grid (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            {componentsData.map((item) => {
              const Icon = item.icon;
              const isSelected = item.id === selectedId;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-6 glass-card cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "border-[#00D6FF] bg-[#00D6FF]/10 shadow-[0_0_30px_rgba(0,214,255,0.2)]"
                      : "hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${isSelected ? "bg-[#00D6FF] text-black" : "bg-white/10 text-[#00D6FF]"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-white mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-sans">
                    {item.summary}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Detailed Inspector View (5 Cols) */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeComp.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="p-8 glass-card border-[#0050FF]/40 space-y-6 relative overflow-hidden"
              >
                {/* Accent glow behind active inspector */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle_at_top_right,rgba(0,214,255,0.15),transparent_70%)] pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs font-mono text-[#00D6FF] tracking-wider uppercase">
                    COMPONENT METRICS
                  </span>
                  <div className="text-right">
                    <span className="font-display font-black text-2xl text-white block">
                      {activeComp.metric}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      {activeComp.metricLabel}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display font-bold text-xl text-white">
                    {activeComp.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {activeComp.summary}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-mono text-gray-400 block uppercase">
                    Key Specifications & Features
                  </span>
                  <ul className="space-y-2 text-xs text-gray-300">
                    {activeComp.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00D6FF] flex-shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
