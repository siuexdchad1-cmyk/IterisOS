"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, ChevronDown, Activity, LogOut, User as UserIcon } from "lucide-react";
import { useIterisStore } from "@/lib/store";
import { AgentStatus } from "@/types";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import PillNav from "@/components/PillNav/PillNav";

const statusConfig: Record<
  AgentStatus,
  { label: string; dotColor: string; pingColor: string; badgeBg: string }
> = {
  idle: {
    label: "Idle / Ready",
    dotColor: "bg-slate-400",
    pingColor: "bg-slate-400/40",
    badgeBg: "border-slate-500/30 text-slate-300",
  },
  thinking: {
    label: "Thinking...",
    dotColor: "bg-[#5EE0FF]",
    pingColor: "bg-[#5EE0FF]",
    badgeBg: "border-[#5EE0FF]/40 text-[#5EE0FF]",
  },
  executing: {
    label: "Executing Plan",
    dotColor: "bg-[#3DDC84]",
    pingColor: "bg-[#3DDC84]",
    badgeBg: "border-[#3DDC84]/40 text-[#3DDC84]",
  },
  awaiting_approval: {
    label: "Awaiting Approval",
    dotColor: "bg-[#FFB84D]",
    pingColor: "bg-[#FFB84D]",
    badgeBg: "border-[#FFB84D]/40 text-[#FFB84D]",
  },
  error: {
    label: "Execution Error",
    dotColor: "bg-[#FF5C5C]",
    pingColor: "bg-[#FF5C5C]",
    badgeBg: "border-[#FF5C5C]/40 text-[#FF5C5C]",
  },
};

export default function Navbar() {
  const router = useRouter();
  const { state, setAgentStatus } = useIterisStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Check active session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  const currentConfig = statusConfig[state.agentStatus];

  const handleSelectStatus = (status: AgentStatus) => {
    setAgentStatus(status);
    setDropdownOpen(false);
  };

  const pillNavItems = [
    { id: "dash", label: "Dashboard", href: "/" },
    { id: "studio", label: "Agent Studio", href: "#studio" },
    { id: "logs", label: "Trace & Logs", href: "#terminal" },
    { id: "integrations", label: "Integrations", href: "#integrations" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0A0D14]/80 border-b border-white/10 px-4 md:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logotype */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#5EE0FF]/20 to-[#5EE0FF]/5 border border-[#5EE0FF]/40 shadow-[0_0_15px_rgba(94,224,255,0.2)]">
            <Cpu className="w-5 h-5 text-[#5EE0FF]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#5EE0FF] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-lg md:text-xl tracking-tight text-white group-hover:text-gray-200 transition-colors">
                ITERIS<span className="text-[#5EE0FF]">.OS</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase rounded-full bg-[#5EE0FF]/10 text-[#5EE0FF] border border-[#5EE0FF]/30">
                Agentic v1.0
              </span>
            </div>
          </div>
        </Link>



        {/* Right: Controls & Auth */}
        <div className="flex items-center space-x-3">
          {/* Agent Status Pill */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all ${currentConfig.badgeBg} bg-white/5 hover:bg-white/10`}
              aria-label="Toggle agent status dropdown"
            >
              <span className="relative flex h-2 w-2">
                {state.agentStatus !== "idle" && (
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentConfig.pingColor}`}
                  />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${currentConfig.dotColor}`}
                />
              </span>
              <span className="font-mono text-xs font-medium">
                {currentConfig.label}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 4, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0A0D14]/95 border border-white/15 backdrop-blur-2xl shadow-2xl p-1.5 z-50"
                >
                  <div className="px-2.5 py-1.5 border-b border-white/10 mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                      Agent State
                    </span>
                    <Activity className="w-3 h-3 text-[#5EE0FF]" />
                  </div>
                  {(
                    [
                      "idle",
                      "thinking",
                      "executing",
                      "awaiting_approval",
                      "error",
                    ] as AgentStatus[]
                  ).map((statusKey) => {
                    const cfg = statusConfig[statusKey];
                    const isSelected = state.agentStatus === statusKey;
                    return (
                      <button
                        key={statusKey}
                        onClick={() => handleSelectStatus(statusKey)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center space-x-2 transition-colors ${
                          isSelected
                            ? "bg-[#5EE0FF]/15 text-[#5EE0FF]"
                            : "text-gray-300 hover:bg-white/5"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${cfg.dotColor}`} />
                        <span>{cfg.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Supabase Auth Controls */}
          {user ? (
            <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs font-mono">
              <UserIcon className="w-3.5 h-3.5 text-[#5EE0FF]" />
              <span className="text-gray-300 max-w-[120px] sm:max-w-[180px] truncate">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="p-1 text-gray-400 hover:text-red-400 transition-colors ml-1"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs font-mono">
                <UserIcon className="w-3.5 h-3.5 text-[#5EE0FF]" />
                <span className="text-gray-300 max-w-[120px] sm:max-w-[180px] truncate">
                  aryatare38@gmail.com
                </span>
                <button
                  onClick={() => router.push("/login")}
                  className="p-1 text-gray-400 hover:text-[#5EE0FF] transition-colors ml-1"
                  title="Sign In"
                >
                  <LogOut className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
              <Link
                href="/login"
                className="sm:hidden px-3.5 py-1.5 rounded-xl text-xs font-mono text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
