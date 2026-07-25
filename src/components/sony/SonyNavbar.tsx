"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Cpu } from "lucide-react";

interface SonyNavbarProps {
  onOpenBuyModal: () => void;
}

export default function SonyNavbar({ onOpenBuyModal }: SonyNavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-nav py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Left: Brand logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00D6FF]/10 border border-[#00D6FF]/30 text-[#00D6FF]">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="font-display font-black text-xl md:text-2xl tracking-tight text-white uppercase">
            ITERIS<span className="text-[#00D6FF]">.OS</span>
          </span>
          <span className="h-4 w-[1px] bg-white/20 hidden sm:inline-block" />
          <span className="font-mono text-xs font-semibold tracking-wider text-gray-300 hidden sm:inline-block">
            Flagship Audio
          </span>
        </div>

        {/* Center: Apple-style nav links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-medium tracking-wide text-gray-300">
          <button
            onClick={() => scrollToSection("hero")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Overview
          </button>
          <button
            onClick={() => scrollToSection("scrollytelling")}
            className="hover:text-[#00D6FF] transition-colors cursor-pointer"
          >
            Engineering Reveal
          </button>
          <button
            onClick={() => scrollToSection("anc-simulator")}
            className="hover:text-[#00D6FF] transition-colors cursor-pointer"
          >
            Noise Cancelling
          </button>
          <button
            onClick={() => scrollToSection("sound-upscaler")}
            className="hover:text-[#00D6FF] transition-colors cursor-pointer"
          >
            HD Audio
          </button>
          <button
            onClick={() => scrollToSection("specs")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Specs
          </button>
        </nav>

        {/* Right: Primary CTA */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenBuyModal}
            className="iteris-btn-primary px-5 py-2 text-xs font-semibold flex items-center space-x-2 cursor-pointer"
          >
            <span>Experience Iteris OS</span>
            <ChevronRight className="w-3.5 h-3.5 text-white/80" />
          </button>
        </div>
      </div>
    </header>
  );
}
