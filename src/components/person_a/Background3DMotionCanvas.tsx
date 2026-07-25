"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

const TOTAL_FRAMES = 300;

export default function Background3DMotionCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  const [currentFrame, setCurrentFrame] = useState(0);
  const [loaded, setLoaded] = useState(false);

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
        if (loadedCount === TOTAL_FRAMES) setLoaded(true);
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) setLoaded(true);
      };

      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;
  }, []);

  // Draw frame on full-screen background canvas
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with background #0A0D14
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

  // Handle Canvas Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
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
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const currentScroll = window.scrollY;
      const ratio = Math.max(0, Math.min(1, currentScroll / scrollHeight));

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
  }, [drawFrame]);

  // Initial draw when loaded
  useEffect(() => {
    if (loaded) {
      drawFrame(0);
    }
  }, [loaded, drawFrame]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
