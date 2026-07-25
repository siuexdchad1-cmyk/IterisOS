"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, MapPin, CheckCircle2, AlertCircle, Clock, X, Zap } from "lucide-react";
import { useIterisStore } from "@/lib/store";
import { HotspotTask } from "@/types";

// Dynamic import for R3F Canvas to prevent SSR hydration errors
const GlobeCanvas = dynamic(() => import("./GlobeCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-12 h-12 rounded-full border-2 border-[#5EE0FF]/30 border-t-[#5EE0FF] animate-spin" />
        <span className="font-mono text-xs text-gray-400">Initializing 3D Telemetry Canvas...</span>
      </div>
    </div>
  ),
});

export default function HeroGlobe() {
  const { state } = useIterisStore();
  const hotspots = state?.hotspots || [];

  const [selectedHotspot, setSelectedHotspot] = useState<HotspotTask | null>(
    hotspots[0] || null
  );

  const getStatusBadge = (status: HotspotTask["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#3DDC84]/15 text-[#3DDC84] border border-[#3DDC84]/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case "awaiting_approval":
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#FFB84D]/15 text-[#FFB84D] border border-[#FFB84D]/30">
            <AlertCircle className="w-3 h-3" />
            <span>Awaiting Approval</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#5EE0FF]/15 text-[#5EE0FF] border border-[#5EE0FF]/30">
            <Clock className="w-3 h-3 animate-spin" />
            <span>In Execution</span>
          </span>
        );
    }
  };

  return (
    <div className="relative w-full rounded-2xl glass-panel p-4 md:p-6 overflow-hidden border border-white/10 my-4">
      {/* Background ambient lighting */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#5EE0FF]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-[#3DDC84]/5 blur-3xl pointer-events-none" />

      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#5EE0FF]">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-white tracking-tight flex items-center space-x-2">
              <span>Global Agentic Mesh</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5EE0FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5EE0FF]" />
              </span>
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              Live Edge Execution Hotspots & Regional Task Routing
            </p>
          </div>
        </div>

        {/* Hotspot Quick Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {hotspots.map((hs) => {
            const isSelected = selectedHotspot?.taskId === hs.taskId;
            return (
              <button
                key={hs.taskId}
                onClick={() => setSelectedHotspot(hs)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  isSelected
                    ? "bg-[#5EE0FF]/20 text-[#5EE0FF] border border-[#5EE0FF]/40 shadow-[0_0_10px_rgba(94,224,255,0.2)]"
                    : "bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:bg-white/10"
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>{hs.city}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Globe & Interactive Popup Container */}
      <div className="relative h-[320px] md:h-[380px] w-full flex items-center justify-center">
        {/* 3D R3F Canvas */}
        <GlobeCanvas
          hotspots={hotspots}
          activeHotspot={selectedHotspot}
          onSelectHotspot={(hs) => setSelectedHotspot(hs)}
        />

        {/* Overlay Popup Card (Framer Motion AnimatePresence) */}
        <AnimatePresence>
          {selectedHotspot && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 glass-panel p-4 rounded-xl border border-white/20 shadow-2xl backdrop-blur-2xl z-20"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-[#5EE0FF]/15 text-[#5EE0FF]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-sm text-white">
                      {selectedHotspot.city} Node
                    </h4>
                    <span className="font-mono text-[10px] text-gray-400">
                      Task ID: {selectedHotspot.taskId}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                <p className="text-xs text-gray-200 font-medium leading-snug">
                  {selectedHotspot.label}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-gray-400">
                    Execution State:
                  </span>
                  {getStatusBadge(selectedHotspot.status)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
