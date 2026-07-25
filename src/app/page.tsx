"use client";

import React, { useState } from "react";
import SonyNavbar from "@/components/sony/SonyNavbar";
import SonyHeroScrollytelling from "@/components/sony/SonyHeroScrollytelling";
import SonyAncSimulator from "@/components/sony/SonyAncSimulator";
import SonyComponentMatrix from "@/components/sony/SonyComponentMatrix";
import SonyAudioUpscaler from "@/components/sony/SonyAudioUpscaler";
import SonyTechSpecs from "@/components/sony/SonyTechSpecs";
import SonyFooter from "@/components/sony/SonyFooter";
import SonyBuyModal from "@/components/sony/SonyBuyModal";

export default function Home() {
  const [buyModalOpen, setBuyModalOpen] = useState(false);

  const handleOpenBuyModal = () => {
    setBuyModalOpen(true);
  };

  const handleCloseBuyModal = () => {
    setBuyModalOpen(false);
  };

  return (
    <main id="hero" className="min-h-screen bg-[#050505] text-gray-100 selection:bg-[#00D6FF]/30 selection:text-[#00D6FF]">
      {/* Apple-style Glassmorphism Navigation Bar */}
      <SonyNavbar onOpenBuyModal={handleOpenBuyModal} />

      {/* Core Scrollytelling Section (450vh canvas image sequence) */}
      <SonyHeroScrollytelling onOpenBuyModal={handleOpenBuyModal} />

      {/* Interactive Active Noise Cancellation Simulator */}
      <SonyAncSimulator />

      {/* Disassembled Component Inspector Showcase Grid */}
      <SonyComponentMatrix />

      {/* AI DSEE Extreme Audio Upscaler & Frequency Spectrum Analyzer */}
      <SonyAudioUpscaler />

      {/* Tech Specifications Comparison Table */}
      <SonyTechSpecs onOpenBuyModal={handleOpenBuyModal} />

      {/* Editorial Luxury Tech Footer */}
      <SonyFooter />

      {/* Pre-Order / Buy Modal */}
      <SonyBuyModal isOpen={buyModalOpen} onClose={handleCloseBuyModal} />
    </main>
  );
}
