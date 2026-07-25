"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Volume2, ShieldCheck, Cpu, ArrowRight } from "lucide-react";

interface SonyHeroScrollytellingProps {
  onOpenBuyModal: () => void;
}

const TOTAL_FRAMES = 300;

export default function SonyHeroScrollytelling({ onOpenBuyModal }: SonyHeroScrollytellingProps) {
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
        // Fallback progress if frame load completes
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

  // Draw specific frame onto HTML5 Canvas
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Set canvas dimensions to parent display size
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with background color #050505 to guarantee 100% seamless floating effect
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, width, height);

    // Calculate aspect ratio fit (contain)
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

    // Draw image centered
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Handle Canvas Resize
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

  // Handle Scroll Progress & Frame Synchronization
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollableHeight = rect.height - window.innerHeight;
      if (totalScrollableHeight <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, currentScroll / totalScrollableHeight));
      
      setScrollProgress(rawProgress);

      // Map progress 0..1 to 0..TOTAL_FRAMES-1
      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(rawProgress * (TOTAL_FRAMES - 1))
      );

      setCurrentFrameIndex(frameIdx);
      drawFrame(frameIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [drawFrame]);

  // Initial draw once loaded
  useEffect(() => {
    if (imagesLoaded) {
      drawFrame(0);
    }
  }, [imagesLoaded, drawFrame]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="scrollytelling" ref={containerRef} className="relative w-full h-[450vh] bg-[#050505]">
      {/* Sticky Fullscreen Canvas Container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#050505]">
        
        {/* Soft Ambient Radial Glow Behind Product */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,80,255,0.12)_0%,rgba(0,214,255,0.03)_40%,transparent_70%)] pointer-events-none" />

        {/* HTML5 Canvas for Image Sequence Playback */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain relative z-10"
        />

        {/* Preloader Overlay until images load */}
        {!imagesLoaded && (
          <div className="absolute inset-0 z-40 bg-[#050505] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-[#00D6FF]/20 border-t-[#00D6FF] animate-spin" />
            <div className="text-center font-mono text-xs text-gray-400 space-y-1">
              <p className="text-white font-semibold tracking-widest uppercase">SONY WH-1000XM6</p>
              <p className="text-gray-500">Loading 3D Scrollytelling Sequence... {loadProgress}%</p>
            </div>
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0050FF] to-[#00D6FF] transition-all duration-200"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* ── NARRATIVE BEAT OVERLAYS (Synchronized to Scroll Progress) ── */}

        {/* BEAT 1: 0% – 18% (Hero Assembly) */}
        <AnimatePresence>
          {scrollProgress >= 0 && scrollProgress < 0.18 && (
            <motion.div
              key="beat-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-between py-24 px-4 text-center pointer-events-none"
            >
              {/* Top pill */}
              <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono text-[#00D6FF] flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Flagship Wireless Noise Cancelling</span>
              </div>

              {/* Central hero headline */}
              <div className="space-y-4 max-w-3xl">
                <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase">
                  SONY <span className="gradient-text-sony">WH-1000XM6</span>
                </h1>
                <p className="font-display text-xl md:text-3xl text-gray-300 font-light tracking-wide">
                  Silence, perfected.
                </p>
                <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto font-sans leading-relaxed">
                  Re-engineered for a world that never stops. Experience absolute acoustic isolation powered by dual HD processors.
                </p>
              </div>

              {/* Scroll prompt */}
              <div className="flex flex-col items-center space-y-2 text-xs font-mono text-gray-400">
                <span>SCROLL TO EXPLODE & DISASSEMBLE</span>
                <ChevronDown className="w-4 h-4 animate-bounce text-[#00D6FF]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BEAT 2: 18% – 42% (Engineering Reveal - Left Aligned) */}
        <AnimatePresence>
          {scrollProgress >= 0.18 && scrollProgress < 0.42 && (
            <motion.div
              key="beat-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-20 flex items-center justify-start px-6 md:px-16 pointer-events-none"
            >
              <div className="max-w-md space-y-4 p-8 glass-card border-[#0050FF]/30 pointer-events-auto">
                <div className="flex items-center space-x-2 text-xs font-mono text-[#00D6FF]">
                  <Cpu className="w-4 h-4" />
                  <span>ACOUSTIC ARCHITECTURE</span>
                </div>
                <h2 className="font-display font-bold text-2xl md:text-4xl text-white tracking-tight leading-tight">
                  Precision-engineered for silence.
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed font-sans">
                  Custom 30mm precision drivers, sealed acoustic chambers, and optimized airflow channels deliver studio-grade clarity across every frequency.
                </p>
                <p className="text-xs text-gray-400 leading-relaxed font-sans border-t border-white/10 pt-3">
                  Every structural component is calibrated for ideal weight distribution and hours of continuous listening.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BEAT 3: 42% – 68% (Noise Cancelling & Microphones - Right Aligned) */}
        <AnimatePresence>
          {scrollProgress >= 0.42 && scrollProgress < 0.68 && (
            <motion.div
              key="beat-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-20 flex items-center justify-end px-6 md:px-16 pointer-events-none"
            >
              <div className="max-w-md space-y-5 p-8 glass-card border-[#00D6FF]/30 pointer-events-auto">
                <div className="flex items-center space-x-2 text-xs font-mono text-[#00D6FF]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>HD NOISE CANCELLING PROCESSOR QN3</span>
                </div>
                <h2 className="font-display font-bold text-2xl md:text-4xl text-white tracking-tight leading-tight">
                  Adaptive noise cancelling, redefined.
                </h2>
                <ul className="space-y-2.5 text-xs text-gray-300 font-sans">
                  <li className="flex items-start space-x-2">
                    <span className="text-[#00D6FF] font-bold">›</span>
                    <span>Multi-microphone array listens in every direction in real time.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#00D6FF] font-bold">›</span>
                    <span>Auto-NC Optimizer adjusts cancellation to ambient air pressure & fit.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#00D6FF] font-bold">›</span>
                    <span>Planes, trains, and chaotic crowds fade into total silence.</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BEAT 4: 68% – 88% (Sound & AI Upscaling - Left Aligned) */}
        <AnimatePresence>
          {scrollProgress >= 0.68 && scrollProgress < 0.88 && (
            <motion.div
              key="beat-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-20 flex items-center justify-start px-6 md:px-16 pointer-events-none"
            >
              <div className="max-w-md space-y-4 p-8 glass-card border-[#0050FF]/30 pointer-events-auto">
                <div className="flex items-center space-x-2 text-xs font-mono text-[#00D6FF]">
                  <Volume2 className="w-4 h-4" />
                  <span>HIGH-RES AUDIO & DSEE EXTREME</span>
                </div>
                <h2 className="font-display font-bold text-2xl md:text-4xl text-white tracking-tight leading-tight">
                  Immersive, lifelike sound.
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed font-sans">
                  High-performance carbon-composite drivers unlock deep texture and uncompressed soundstage detail in every track.
                </p>
                <p className="text-xs text-gray-400 leading-relaxed font-sans border-t border-white/10 pt-3">
                  AI Edge-Audio upscaling restores compressed digital files, delivering studio master quality on the go.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BEAT 5: 88% – 100% (Reassembly & Final Hero CTAs - Centered) */}
        <AnimatePresence>
          {scrollProgress >= 0.88 && (
            <motion.div
              key="beat-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center pointer-events-none"
            >
              <div className="max-w-xl space-y-6 p-8 md:p-10 glass-card border-[#00D6FF]/40 backdrop-blur-3xl pointer-events-auto shadow-[0_0_80px_rgba(0,80,255,0.3)]">
                <div className="inline-block px-3 py-1 rounded-full bg-[#00D6FF]/10 text-[#00D6FF] border border-[#00D6FF]/30 text-xs font-mono">
                  FINAL REASSEMBLY COMPLETE
                </div>
                <h2 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight uppercase leading-tight">
                  Hear everything. <br />
                  <span className="gradient-text-sony">Feel nothing else.</span>
                </h2>
                <p className="text-xs md:text-sm text-gray-300 max-w-md mx-auto font-sans leading-relaxed">
                  WH-1000XM6. Designed for focus, crafted for comfort. Engineered for airports, offices, and everywhere in between.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <button
                    onClick={onOpenBuyModal}
                    className="sony-btn-primary px-8 py-3.5 text-xs font-bold flex items-center space-x-2 cursor-pointer w-full sm:w-auto justify-center"
                  >
                    <span>Experience WH-1000XM6</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => scrollToSection("specs")}
                    className="sony-btn-secondary px-6 py-3.5 text-xs font-semibold cursor-pointer w-full sm:w-auto"
                  >
                    See full specs
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicator bar at bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 font-mono text-[10px] text-gray-500">
          <span>0%</span>
          <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00D6FF] transition-all duration-75"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
