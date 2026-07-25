'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import HeroGlobe from '@/components/person_a/HeroGlobe';
import TaskMatrix from '@/components/TaskMatrix';
import LiveTerminal from '@/components/LiveTerminal';
import { GitBranch } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* 1. Shared Pinned Navigation Bar */}
      <Navbar />

      {/* 2. Person A: Front-End Lead Scope (3D WebGL Globe & Dual-Input Hero) */}
      <HeroGlobe
        onGoalExecutePlaceholder={(goal) => {
          console.log('[Person A - Placeholder Hook] Goal Executed:', goal);
        }}
        onAudioIngestPlaceholder={(file) => {
          console.log('[Person A - Placeholder Hook] Meeting Audio File Ingested:', file.name);
        }}
      />

      {/* 3. Main Dashboard Assembly Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 w-full flex-grow">
        
        {/* Layout: TaskMatrix (col-span 2) + LiveTerminal (col-span 1) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Task Matrix (Person B Component) */}
          <div className="lg:col-span-2">
            <TaskMatrix />
          </div>

          {/* Live Command Terminal (Person C Component) */}
          <div className="lg:col-span-1 sticky top-24">
            <LiveTerminal />
          </div>

        </div>

        {/* Integrations Section */}
        <section id="integrations" className="pt-12 border-t border-white/10 space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center space-x-2 glass-pill px-3 py-1 rounded-full text-xs font-mono text-emerald-400 border border-emerald-500/30">
              <GitBranch className="w-3.5 h-3.5" />
              <span>ENTERPRISE CONNECTORS</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Seamless Ecosystem Integration</h3>
            <p className="text-xs text-slate-400">
              Iteris OS plugs directly into existing tools, databases, and GDS platforms.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: 'Google Workspace', status: 'Connected', icon: '🗓️' },
              { name: 'AWS Cloud', status: 'Active Sync', icon: '☁️' },
              { name: 'Skyscanner API', status: '14ms Latency', icon: '✈️' },
              { name: 'GitHub Enterprise', status: 'Webhook Ready', icon: '🐙' },
              { name: 'Slack Bot Core', status: 'Listening', icon: '💬' },
              { name: 'K8s Cluster', status: 'Zero-Downtime', icon: '⚙️' },
            ].map((item) => (
              <div
                key={item.name}
                className="glass-panel p-4 rounded-xl text-center border border-white/10 hover:border-emerald-500/40 transition group cursor-pointer"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">{item.name}</div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1">{item.status}</div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
            <span className="font-extrabold tracking-wider text-lg text-white">ITERIS OS</span>
            <span className="text-xs text-slate-500 font-mono">| Person A Front-End Scope</span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400 font-mono">
            <span className="hover:text-emerald-400 cursor-pointer transition">Docs & API Specs</span>
            <span className="hover:text-emerald-400 cursor-pointer transition">Guardrail Audits</span>
            <span className="hover:text-emerald-400 cursor-pointer transition">Status Page</span>
            <span className="hover:text-emerald-400 cursor-pointer transition">Contact Enterprise</span>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            © 2026 Iteris OS Inc. Built with Next.js, Framer Motion & Tailwind.
          </div>
        </div>
      </footer>

    </div>
  );
}
