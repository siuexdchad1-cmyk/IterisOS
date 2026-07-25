"use client";

import React from "react";
import { Leaf, ArrowUpRight } from "lucide-react";

export default function SonyFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-12 px-4 md:px-8 text-gray-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Footer Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 border-b border-white/10">
          <div className="space-y-2">
            <span className="font-display font-black text-3xl text-white tracking-tight uppercase">
              ITERIS<span className="text-[#00D6FF]">.OS</span>
            </span>
            <p className="text-xs text-gray-400 max-w-md">
              Iteris OS · Flagship Audio Division. All rights reserved.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="iteris-btn-secondary px-5 py-2.5 text-xs font-mono flex items-center space-x-2 cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Environmental Commitment Card */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#3DDC84]/10 text-[#3DDC84]">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-white block">Road to Zero Environmental Plan</span>
              <span className="text-[11px] text-gray-400">
                100% plastic-free packaging made from recycled bamboo & sugar cane fiber.
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-[#3DDC84]">Zero Footprint</span>
        </div>

        {/* Footer Legal & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 text-gray-500 font-mono text-[11px]">
          <div>© 2026 Iteris OS. All rights reserved.</div>
          <div className="flex items-center space-x-6">
            <span className="hover:text-gray-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-300 transition-colors cursor-pointer">Terms of Use</span>
            <span className="hover:text-gray-300 transition-colors cursor-pointer">Sales & Refunds</span>
            <span className="hover:text-gray-300 transition-colors cursor-pointer">Legal</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
