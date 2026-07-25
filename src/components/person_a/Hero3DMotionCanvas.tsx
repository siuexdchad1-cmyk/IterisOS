"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

const TOTAL_FRAMES = 300;

export default function Hero3DMotionCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  const [currentFrame, setCurrentFrame] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isInteractive, setIsInteractive] = useState(false);

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
        setProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          setLoaded(true);
        }
      };

      img.onerror = () => {
        loadedCount++;
        setProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          setLoaded(true);
        }
      };

      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;
  }, []);

  // Draw frame on canvas
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with deep background color
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
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
        drawFrame(currentFrame);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentFrame, drawFrame]);

  // Scroll-linked frame update
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isInteractive) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate viewport visibility ratio
      const elementTop = rect.top;
      const totalDist = windowHeight + rect.height;
      const scrollPos = windowHeight - elementTop;
      const ratio = Math.max(0, Math.min(1, scrollPos / totalDist));

      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(ratio * (TOTAL_FRAMES - 1))
      );

      setCurrentFrame(frameIdx);
      drawFrame(frameIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [drawFrame, isInteractive]);

  // Initial render when images load
  useEffect(() => {
    if (loaded) {
      drawFrame(0);
    }
  }, [loaded, drawFrame]);

  // Handle interactive mouse scrub
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !loaded) return;
    setIsInteractive(true);
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.floor(ratio * (TOTAL_FRAMES - 1)));
    setCurrentFrame(frameIdx);
    drawFrame(frameIdx);
  };

  const handleMouseLeave = () => {
    setIsInteractive(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[320px] md:h-[400px] rounded-2xl border border-white/10 overflow-hidden bg-[#0A0D14] shadow-[0_0_50px_rgba(94,224,255,0.08)] group cursor-ew-resize my-4"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(94,224,255,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* HTML5 Canvas */}
      <canvas ref={canvasRef} className="w-full h-full object-contain relative z-10" />

      {/* Preloader state */}
      {!loaded && (
        <div className="absolute inset-0 z-30 bg-[#0A0D14] flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#5EE0FF]/20 border-t-[#5EE0FF] animate-spin" />
          <p className="text-xs font-mono text-gray-400">Loading 3D Motion Sequence... {progress}%</p>
        </div>
      )}

      {/* Badge & Scrubbing Controls Bar */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-[11px] font-mono text-[#5EE0FF] flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>3D Motion Showcase</span>
        </div>

        <div className="px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-[10px] font-mono text-gray-400 flex items-center space-x-2">
          <span>Frame {currentFrame + 1} / 300</span>
          <span className="text-[#5EE0FF] font-semibold hidden sm:inline">• Hover to Scrub</span>
        </div>
      </div>
    </div>
  );
}
