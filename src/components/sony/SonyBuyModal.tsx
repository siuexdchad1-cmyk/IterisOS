"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ShoppingBag, ShieldCheck, Truck, RotateCcw, ArrowRight } from "lucide-react";

interface SonyBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ColorFinish = "black" | "silver" | "navy";

export default function SonyBuyModal({ isOpen, onClose }: SonyBuyModalProps) {
  const [color, setColor] = useState<ColorFinish>("black");
  const [ordered, setOrdered] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const colors = [
    { id: "black", name: "Matte Black", hex: "#121214", border: "border-gray-600" },
    { id: "silver", name: "Platinum Silver", hex: "#D8D8DC", border: "border-white" },
    { id: "navy", name: "Midnight Navy", hex: "#1A2338", border: "border-blue-900" },
  ];

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrdered(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-xl glass-card border-[#00D6FF]/40 p-6 md:p-8 space-y-6 shadow-[0_0_80px_rgba(0,80,255,0.4)] my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {!ordered ? (
            <>
              {/* Header */}
              <div className="space-y-1 pr-8">
                <span className="text-xs font-mono text-[#00D6FF] uppercase tracking-wider">
                  SONY FLAGSHIP PRE-ORDER
                </span>
                <h3 className="font-display font-black text-2xl md:text-3xl text-white uppercase">
                  WH-1000XM6 Wireless
                </h3>
                <p className="text-xs text-gray-400 font-sans">
                  Includes carrying case, USB-C fast charging cable, audio cable, and 1-year Sony warranty.
                </p>
              </div>

              {/* Color Finish Selection */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-mono text-gray-300 block uppercase">
                  Select Finish: <span className="text-white font-bold">{colors.find((c) => c.id === color)?.name}</span>
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setColor(c.id as ColorFinish)}
                      className={`p-3 rounded-xl border flex flex-col items-center space-y-2 cursor-pointer transition-all ${
                        color === c.id
                          ? "bg-white/10 border-[#00D6FF] shadow-[0_0_15px_rgba(0,214,255,0.2)]"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-full border border-white/20 shadow-inner"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-[11px] font-mono text-gray-200">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Guarantee Callouts */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block uppercase">Retail Price</span>
                  <span className="font-display font-black text-3xl text-white">$399.99</span>
                </div>
                <div className="text-right font-mono text-xs text-[#3DDC84]">
                  <span>Free Express Shipping</span>
                  <span className="block text-[10px] text-gray-400 font-sans">Ships within 24 hours</span>
                </div>
              </div>

              {/* Order Form */}
              <form onSubmit={handleCompleteOrder} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    className="p-3 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00D6FF] font-sans"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    className="p-3 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00D6FF] font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sony-btn-primary py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Reserve Pre-Order — $399.99</span>
                </button>
              </form>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[10px] font-mono text-gray-400 text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-[#00D6FF]" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <RotateCcw className="w-3.5 h-3.5 text-[#00D6FF]" />
                  <span>30-Day Trial</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00D6FF]" />
                  <span>2-Yr Warranty</span>
                </div>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#3DDC84]/20 border border-[#3DDC84] text-[#3DDC84] flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>

              <h3 className="font-display font-black text-2xl text-white uppercase">
                Pre-Order Confirmed!
              </h3>
              <p className="text-xs text-gray-300 max-w-sm mx-auto font-sans leading-relaxed">
                Thank you for reserving the Sony WH-1000XM6 ({colors.find((c) => c.id === color)?.name}). Confirmation and tracking details have been sent to your email.
              </p>

              <button
                onClick={() => {
                  setOrdered(false);
                  onClose();
                }}
                className="sony-btn-secondary px-8 py-3 text-xs font-semibold cursor-pointer"
              >
                Return to Experience
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
