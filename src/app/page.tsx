"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DualInputSwitcher from "@/components/person_a/DualInputSwitcher";
import DashboardShell from "@/components/person_a/DashboardShell";
import Background3DMotionCanvas from "@/components/person_a/Background3DMotionCanvas";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0A0D10] text-[#E7ECEF] selection:bg-[#FFB454]/30 selection:text-[#FFB454] relative">
      {/* 3D Motion Canvas */}
      <Background3DMotionCanvas />

      {/* Top Header Navbar per home.html */}
      <nav className="flex items-center justify-between max-w-[1120px] mx-auto px-6 py-7 relative z-20">
        <Link href="/" className="flex items-center gap-2.5 font-display font-semibold text-lg tracking-wide text-white">
          <div className="w-5 h-5 border-[1.5px] border-[#E7ECEF] rounded relative flex items-center justify-center">
            <span className="absolute inset-[3px] bg-[#FFB454] rounded-[1px]" />
          </div>
          <span>IterisOS</span>
        </Link>

        <div className="flex items-center space-x-7 text-sm font-sans text-[#8791A0]">
          <a href="#agents" className="hover:text-white transition-colors">Agents</a>
          <a href="#pipeline" className="hover:text-white transition-colors">Pipeline</a>
          <Link
            href="/dashboard"
            className="text-[#0A0D10] bg-[#E7ECEF] px-4 py-2 rounded-md font-medium hover:bg-white transition-all shadow-sm"
          >
            Open Dashboard →
          </Link>
        </div>
      </nav>

      {/* Hero Section per home.html */}
      <section className="max-w-[1120px] mx-auto px-6 pt-12 pb-14 relative z-10">
        <div className="font-mono text-xs tracking-widest text-[#4E5661] uppercase mb-5 flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB454]" />
          <span>InnovaHack Chapter-1 · Domain 4</span>
        </div>

        <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight max-w-[760px] mb-6 text-white">
          Two agents.<br />
          <span className="text-[#8791A0]">One shell to run them in.</span>
        </h1>

        <p className="text-lg text-[#8791A0] max-w-[560px] mb-9 font-sans leading-relaxed">
          Give it a goal — it plans, calls tools, retries what fails, and shows its work. Give it a meeting — it pulls out the decisions and chases the follow-ups.
        </p>

        <div className="flex flex-wrap gap-3.5 mb-14">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-[#FFB454] text-[#1A1200] px-5 py-3 rounded-md font-semibold text-sm hover:bg-[#FFB454]/90 transition-all shadow-md cursor-pointer font-sans"
          >
            Open Dashboard
          </button>
          <button
            onClick={() => {
              document.getElementById("agents")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-transparent text-[#E7ECEF] border border-[#262D35] px-5 py-3 rounded-md font-medium text-sm hover:border-[#8791A0] transition-all cursor-pointer font-sans"
          >
            See how it works
          </button>
        </div>

        {/* Two-Agent Split — Signature Element per home.html */}
        <div className="agent-split" id="agents">
          {/* Goal Agent Card */}
          <div className="agent-card goal">
            <span className="agent-tag">Goal Agent</span>
            <h3>Give it an outcome, not a to-do list.</h3>
            <p>One instruction gets broken into steps, executed against tools, retried on failure, and summarized when done.</p>
            <div className="agent-example">
              → &quot;Find the cheapest flight + hotel<br />
              &nbsp;&nbsp;combo under ₹15,000 for next weekend&quot;
            </div>
          </div>

          {/* Meeting Agent Card */}
          <div className="agent-card meeting">
            <span className="agent-tag">Meeting Agent</span>
            <h3>Feed it a transcript, get the decisions.</h3>
            <p>Ingests a meeting and extracts decisions, owners, and action items — then dispatches the reminders itself.</p>
            <div className="agent-example">
              → &quot;Q3_Architecture_Review_Transcript.vtt&quot;<br />
              &nbsp;&nbsp;→ 3 decisions, 3 action items, 2 reminders
            </div>
          </div>
        </div>

        {/* Interactive Dual Input Command Sandbox */}
        <div className="mb-20">
          <DualInputSwitcher />
        </div>

        {/* Dynamic Dashboard Shell */}
        <div className="mb-20">
          <DashboardShell />
        </div>
      </section>

      {/* 4-Step Trace Section per home.html */}
      <section className="trace-section" id="pipeline">
        <div className="trace-header">
          <div className="font-mono text-xs tracking-widest text-[#4E5661] uppercase mb-3 flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB454]" />
            <span>How the goal agent runs</span>
          </div>
          <h2>Every run is one visible trace.</h2>
        </div>

        <div className="trace">
          <div className="trace-line" />

          <div className="trace-step">
            <div className="trace-num">01</div>
            <h4>Plan</h4>
            <p>Breaks the instruction into an ordered list of sub-tasks it can actually execute.</p>
          </div>

          <div className="trace-step">
            <div className="trace-num">02</div>
            <h4>Act</h4>
            <p>Calls a tool for one sub-task at a time — real or simulated API.</p>
          </div>

          <div className="trace-step">
            <div className="trace-num">03</div>
            <h4>Observe &amp; adjust</h4>
            <p>Checks the result, retries on failure, replans if a step is truly blocked.</p>
          </div>

          <div className="trace-step">
            <div className="trace-num">04</div>
            <h4>Summarize</h4>
            <p>Reports what it did, what it chose, and why — in plain language.</p>
          </div>
        </div>
      </section>

      {/* Footer per home.html */}
      <footer className="max-w-[1120px] mx-auto px-6 py-8 border-t border-[#262D35] flex flex-col sm:flex-row items-center justify-between text-xs text-[#4E5661] font-mono gap-2">
        <span>IterisOS — Unified Agentic Shell</span>
        <span>Domain 4 · Team ITERISOS</span>
      </footer>
    </main>
  );
}
