'use client';

import React, { useState } from 'react';
import { Cpu, Terminal, Layers, ShieldCheck, Zap, Activity, ChevronRight, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);

  const navItems = [
    { label: 'Overview', href: '#hero' },
    { label: 'Task Matrix', href: '#task-matrix' },
    { label: 'Agent Stream', href: '#agent-stream' },
    { label: 'Integrations', href: '#integrations' },
  ];

  const handleNavClick = (label: string, href: string) => {
    setActiveTab(label);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/40 border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Logo + Glowing Pulse Dot */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute inset-0 opacity-75"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)]"></div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-wider text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-emerald-400">
                ITERIS OS
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                v2.4 ACTIVE
              </span>
            </div>
          </div>

          {/* Center: Nav links */}
          <nav className="hidden md:flex items-center space-x-1 glass-pill px-3 py-1.5 rounded-full">
            {navItems.map((item) => {
              const isActive = activeTab === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.label, item.href)}
                  className={`relative px-4 py-1.5 text-xs font-medium transition-colors duration-200 rounded-full ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-emerald-500/20 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Glowing Gradient CTA */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsInitModalOpen(true)}
              className="relative group overflow-hidden rounded-full p-[1px] font-medium text-xs focus:outline-none"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-full animate-pulse opacity-80 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative px-5 py-2 rounded-full bg-black/90 text-white flex items-center space-x-2 group-hover:bg-black/75 transition-colors">
                <Zap className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
                <span className="font-semibold text-emerald-300 group-hover:text-white transition-colors">Initialize OS</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* OS Status / Initialization Modal */}
      <AnimatePresence>
        {isInitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel max-w-md w-full rounded-2xl p-6 relative border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
            >
              <button
                onClick={() => setIsInitModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Sparkles className="w-6 h-6 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Iteris OS Cluster Initialized</h3>
                  <p className="text-xs text-emerald-400 font-mono">Status: 100% Operational • 6 Nodes Online</p>
                </div>
              </div>

              <div className="space-y-3 my-4">
                <div className="glass-panel p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span>Neural Compute Core</span>
                  </span>
                  <span className="font-mono text-emerald-300 font-semibold">128 TFLOPS (12% Load)</span>
                </div>
                <div className="glass-panel p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>Agent Telemetry Stream</span>
                  </span>
                  <span className="font-mono text-cyan-300 font-semibold">14ms Latency</span>
                </div>
                <div className="glass-panel p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Human-in-Loop Gate</span>
                  </span>
                  <span className="font-mono text-emerald-300 font-semibold">Strict Guardrails Active</span>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setIsInitModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold shadow-lg hover:brightness-110 transition"
                >
                  Enter Control Workspace
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
