"use client";

import React from "react";
import { Check, Zap, Battery, Cpu, Radio, Volume2, Shield } from "lucide-react";

interface SonyTechSpecsProps {
  onOpenBuyModal: () => void;
}

const specsData = [
  {
    category: "Noise Cancellation",
    specs: [
      { name: "HD Noise Cancelling Processor", xm6: "Dual QN3 Processors", xm5: "Single QN1 Processor" },
      { name: "Microphone Count", xm6: "8 Beamforming Microphones", xm5: "8 Microphones" },
      { name: "Auto-NC Optimizer", xm6: "Real-Time Pressure & Wear Calibration", xm5: "Standard Auto-NC" },
      { name: "Atmospheric Pressure Optimizing", xm6: "Yes (Dedicated Barometric Sensor)", xm5: "Yes" },
    ],
  },
  {
    category: "Audio & Acoustics",
    specs: [
      { name: "Driver Unit", xm6: "Custom 30mm Carbon-Fiber Composite", xm5: "30mm Synthetic Dome" },
      { name: "Frequency Response", xm6: "4 Hz - 40,000 Hz (Active)", xm5: "4 Hz - 40,000 Hz" },
      { name: "High-Res Audio Codecs", xm6: "LDAC, AAC, SBC, LC3 (LE Audio)", xm5: "LDAC, AAC, SBC" },
      { name: "AI Upscaling Engine", xm6: "DSEE Extreme™ with Edge-AI", xm5: "DSEE Extreme™" },
    ],
  },
  {
    category: "Battery & Charging",
    specs: [
      { name: "Battery Life (ANC ON)", xm6: "Up to 40 Hours", xm5: "Up to 30 Hours" },
      { name: "Battery Life (ANC OFF)", xm6: "Up to 50 Hours", xm5: "Up to 40 Hours" },
      { name: "Fast USB-PD Charging", xm6: "3 min charge = 5 hours playback", xm5: "3 min charge = 3 hours" },
      { name: "Charging Interface", xm6: "USB-C Fast Charging", xm5: "USB-C" },
    ],
  },
  {
    category: "Connectivity & Smart Features",
    specs: [
      { name: "Bluetooth Version", xm6: "Bluetooth 5.4 (Ultra-low Latency)", xm5: "Bluetooth 5.2" },
      { name: "Multipoint Connection", xm6: "Simultaneous 2 Devices (Seamless)", xm5: "Simultaneous 2 Devices" },
      { name: "Speak-to-Chat & Wear Detect", xm6: "Instant AI Optical Detection", xm5: "Standard Optical" },
      { name: "Weight", xm6: "248 grams (Ultra-light Ergonomic)", xm5: "250 grams" },
    ],
  },
];

export default function SonyTechSpecs({ onOpenBuyModal }: SonyTechSpecsProps) {
  return (
    <section id="specs" className="py-24 px-4 md:px-8 bg-[#050505] relative">
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-[#00D6FF] uppercase tracking-widest block">
            TECHNICAL SPECIFICATIONS
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight uppercase">
            Built Without <span className="gradient-text-sony">Compromise</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-400 font-sans leading-relaxed">
            Compare the groundbreaking technological leaps built into the flagship WH-1000XM6.
          </p>
        </div>

        {/* Spec Comparison Table Card */}
        <div className="glass-card p-6 md:p-8 border-white/10 space-y-8 overflow-x-auto">
          
          {/* Table Header */}
          <div className="min-w-[600px] grid grid-cols-12 text-xs font-mono pb-4 border-b border-white/15 text-gray-400 uppercase tracking-wider">
            <div className="col-span-5 text-left font-bold text-white">Feature / Specification</div>
            <div className="col-span-4 text-center font-bold text-[#00D6FF] flex items-center justify-center space-x-1">
              <span>WH-1000XM6</span>
              <span className="px-1.5 py-0.5 rounded bg-[#00D6FF]/20 text-[9px]">FLAGSHIP</span>
            </div>
            <div className="col-span-3 text-center text-gray-500">WH-1000XM5</div>
          </div>

          {/* Table Body Groups */}
          <div className="min-w-[600px] space-y-8">
            {specsData.map((group, gIdx) => (
              <div key={gIdx} className="space-y-3">
                <div className="text-xs font-mono font-bold text-[#0050FF] uppercase tracking-widest pt-2">
                  {group.category}
                </div>

                <div className="space-y-2">
                  {group.specs.map((row, rIdx) => (
                    <div
                      key={rIdx}
                      className="grid grid-cols-12 items-center text-xs py-3 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors border border-white/5"
                    >
                      <div className="col-span-5 font-medium text-gray-200">{row.name}</div>
                      <div className="col-span-4 text-center font-bold text-white font-mono flex items-center justify-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-[#3DDC84]" />
                        <span>{row.xm6}</span>
                      </div>
                      <div className="col-span-3 text-center text-gray-500 font-mono">{row.xm5}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Row */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400 font-sans">
              Includes carrying case, USB-C charging cable, and 3.5mm headphone cable.
            </div>

            <button
              onClick={onOpenBuyModal}
              className="sony-btn-primary px-8 py-3 text-xs font-bold cursor-pointer"
            >
              Pre-order WH-1000XM6
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
