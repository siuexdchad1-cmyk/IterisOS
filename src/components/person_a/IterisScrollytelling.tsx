"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import DualInputSwitcher from "./DualInputSwitcher";
import DashboardShell from "./DashboardShell";
import { Sparkles, ChevronDown } from "lucide-react";

const TOTAL_FRAMES = 300;

export default function IterisScrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Preload all 300 frames
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, "0");
      img.src = `/3dmotion/ezgif-frame-${frameNum}.jpg`;

      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          setImagesLoaded(true);
        }
      };

      img.onerror = () => {
        loadedCount++;
        setLoadProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          setImagesLoaded(true);
        }
      };

      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;
  }, []);

  // Draw frame on full-screen sticky canvas
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background fill #0A0D14
    ctx.fillStyle = "#0A0D14";
    ctx.fillRect(0, 0, width, height);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = height;
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    } else {
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        drawFrame(currentFrameIndex);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentFrameIndex, drawFrame]);

  // Precise scroll tracking across the 350vh container
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableHeight = rect.height - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const currentScroll = -rect.top;
      const ratio = Math.max(0, Math.min(1, currentScroll / scrollableHeight));
      
      setScrollProgress(ratio);

      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(ratio * (TOTAL_FRAMES - 1))
      );

      setCurrentFrameIndex(frameIdx);
      drawFrame(frameIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [drawFrame]);

  useEffect(() => {
    if (imagesLoaded) {
      drawFrame(0);
    }
  }, [imagesLoaded, drawFrame]);

  return (
    <div ref={containerRef} className="relative w-full h-[350vh] bg-[#0A0D14]">
      {/* Sticky Fullscreen Container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between pt-20 pb-6 px-4 md:px-8">
        
        {/* Soft Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(94,224,255,0.18)_0%,transparent_70%)] pointer-events-none" />

        {/* 3D Motion Canvas Layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-screen pointer-events-none"
        />

        {/* Preloader if images are loading */}
        {!imagesLoaded && (
          <div className="absolute inset-0 z-40 bg-[#0A0D14] flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#5EE0FF]/20 border-t-[#5EE0FF] animate-spin" />
            <p className="text-xs font-mono text-gray-400">Loading 3D Motion Sequence... {loadProgress}%</p>
          </div>
        )}

        {/* Foreground Content (Title + Dual Input Switcher + Dashboard Output) */}
        <div className="relative z-10 max-w-5xl mx-auto w-full space-y-4 my-auto">
          {/* Hero Header */}
          <div className="text-center space-y-2 py-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#5EE0FF]/10 text-[#5EE0FF] border border-[#5EE0FF]/30 text-xs font-mono mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Motion Scrollytelling Active</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl md:text-5xl text-white tracking-tight leading-tight">
              Iteris OS — <span className="text-[#5EE0FF]">Autonomous Execution Engine</span>
            </h1>
            <p className="text-xs md:text-sm text-gray-400 max-w-2xl mx-auto font-sans leading-relaxed">
              Deploy autonomous workflows in seconds. Input high-level objectives or upload meeting audio to auto-extract and execute action items.
            </p>
          </div>

          {/* Interactive Input Area */}
          <DualInputSwitcher />

          {/* Execution Dashboard */}
          <DashboardShell />
        </div>

        {/* Bottom Scroll Sync Progress Bar */}
        <div className="relative z-20 max-w-md mx-auto w-full flex items-center justify-between font-mono text-[10px] text-gray-500 pt-2 pointer-events-none">
          <span>Frame {currentFrameIndex + 1} / 300</span>
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5EE0FF] transition-all duration-75"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
          <span>{Math.round(scrollProgress * 100)}% Scrolled</span>
        </div>

      </div>
    </div>
  );
}
