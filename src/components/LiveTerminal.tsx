'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Play, 
  Pause, 
  RotateCcw, 
  Code2, 
  Copy, 
  Check, 
  Search, 
  Zap, 
  ChevronRight, 
  Layers, 
  Calendar, 
  ShieldCheck, 
  Send,
  X,
  FileCode,
  Activity
} from 'lucide-react';
import { AgentLog, WorkflowNode } from '../types';

const INITIAL_LOGS: AgentLog[] = [
  {
    id: 'log-1',
    timestamp: '10:01:04 AM',
    agent: '🧠 Lyzr Agent Core',
    text: 'Decomposing high-level user goal into 3 parallel sub-task graphs...',
    type: 'info',
    jsonPayload: {
      requestId: 'req_8f93a1',
      agentId: 'lyzr-orchestrator-01',
      inputParameters: {
        goal: 'Audit Q3 SaaS Expenses & Resolve Tokyo Logistics',
        maxConcurrency: 3,
        safetyLevel: 'Strict'
      },
      outputResult: {
        subTasks: [
          'task_sky_01: Skyscanner API query for flight reroutes',
          'task_cal_02: Google Calendar availability check',
          'task_fin_03: AWS Cost Explorer reservation reconciliation'
        ]
      },
      tokensUsed: 1420,
      costUsd: 0.0028
    }
  },
  {
    id: 'log-2',
    timestamp: '10:01:18 AM',
    agent: '🗓️ Calendar Sync API',
    text: 'Checked team availability across GMT & JST timezones (No conflict found).',
    type: 'success',
    jsonPayload: {
      requestId: 'req_cal_44b2',
      endpoint: 'https://api.google.com/calendar/v3/freeBusy',
      method: 'POST',
      statusCode: 200,
      latencyMs: 148,
      inputParameters: {
        timeMin: '2026-07-25T10:00:00Z',
        timeMax: '2026-07-26T18:00:00Z',
        items: [{ id: 'elena@iteris.ai' }, { id: 'kenji@iteris.ai' }]
      },
      outputResult: {
        busySlots: [],
        conflictStatus: 'NONE_DETECTED'
      }
    }
  },
  {
    id: 'log-3',
    timestamp: '10:02:05 AM',
    agent: '🌐 Logistics Execution',
    text: 'Calling Skyscanner & Freight API for Tokyo air cargo alternative routing...',
    type: 'api',
    jsonPayload: {
      requestId: 'req_sky_991a',
      endpoint: 'https://api.skyscanner.net/gds/v2/flights/search',
      method: 'GET',
      statusCode: 200,
      latencyMs: 210,
      inputParameters: {
        origin: 'HND',
        destination: 'LHR',
        weightKg: 450,
        typhoonBypass: true
      },
      outputResult: {
        carrier: 'ANA Cargo Flight 801',
        revisedArrival: '2026-07-26 08:30 JST',
        delayMitigatedHours: 4.2
      }
    }
  },
  {
    id: 'log-4',
    timestamp: '10:02:44 AM',
    agent: '🛡️ Human Approval Gate',
    text: 'Task #101 requires human approval due to contract financial threshold ($14.2k).',
    type: 'warning',
    jsonPayload: {
      requestId: 'req_gate_007',
      agentId: 'guardrail-policy-engine',
      inputParameters: {
        policyRule: 'FINANCIAL_APPROVAL_THRESHOLD_10K',
        currentAmount: 14200,
        currency: 'USD'
      },
      outputResult: {
        gateStatus: 'PAUSED_WAITING_FOR_SLIDE_APPROVAL',
        assignedApprover: 'Elena Rostova (FinOps Lead)'
      }
    }
  },
  {
    id: 'log-5',
    timestamp: '10:03:12 AM',
    agent: '⚡ Dispatch Worker',
    text: 'Executed microservice deployment dry-run to EU-Central-1 cluster.',
    type: 'action',
    jsonPayload: {
      requestId: 'req_dispatch_55c',
      endpoint: 'https://k8s-eu-central.iteris.internal/apis/apps/v1/namespaces/prod/deployments',
      method: 'PATCH',
      statusCode: 200,
      latencyMs: 340,
      outputResult: {
        replicasReady: 12,
        healthCheck: 'PASS',
        zeroDowntimeVerified: true
      }
    }
  }
];

const WORKFLOW_NODES: WorkflowNode[] = [
  {
    id: 'step-1',
    label: 'Input Ingestion',
    sublabel: 'Audio / Text Goal',
    icon: 'Terminal',
    status: 'completed',
    connectedTo: ['step-2'],
    payload: { inputType: 'Direct Goal', parsedIntent: 'SaaS Audit & Reroute' }
  },
  {
    id: 'step-2',
    label: 'Agent Reasoning',
    sublabel: 'Lyzr Sub-task Graph',
    icon: 'Layers',
    status: 'completed',
    connectedTo: ['step-3', 'step-4'],
    payload: { subTasksSpawned: 3, strategy: 'Parallel Execution' }
  },
  {
    id: 'step-3',
    label: 'Calendar Check',
    sublabel: 'Conflict Avoidance',
    icon: 'Calendar',
    status: 'completed',
    connectedTo: ['step-4'],
    payload: { status: 'No Overlap Found', latency: '148ms' }
  },
  {
    id: 'step-4',
    label: 'Approval Gate',
    sublabel: 'Human-in-the-Loop',
    icon: 'ShieldCheck',
    status: 'active',
    connectedTo: ['step-5'],
    payload: { threshold: '$10k+', state: 'Awaiting Slide Unlock' }
  },
  {
    id: 'step-5',
    label: 'Dispatch Endpoint',
    sublabel: 'API & Microservices',
    icon: 'Send',
    status: 'pending',
    connectedTo: [],
    payload: { target: 'Production K8s & FinOps Cloud' }
  }
];

export const LiveTerminal = () => {
  const [logs, setLogs] = useState<AgentLog[]>(INITIAL_LOGS);
  const [isStreaming, setIsStreaming] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AgentLog | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-typewriter simulation interval
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();
      const randomTypes: AgentLog['type'][] = ['info', 'success', 'api', 'action'];
      const chosenType = randomTypes[Math.floor(Math.random() * randomTypes.length)];

      const newLog: AgentLog = {
        id: `log-${Date.now()}`,
        timestamp,
        agent: '⚡ Iteris Telemetry Worker',
        text: `Stream heartbeat OK • Latency: ${(10 + Math.random() * 20).toFixed(1)}ms • Processing graph queue`,
        type: chosenType,
        jsonPayload: {
          requestId: `req_${Math.random().toString(36).substring(7)}`,
          agentId: 'telemetry-stream-01',
          latencyMs: Math.floor(10 + Math.random() * 20),
          statusCode: 200,
          timestamp: new Date().toISOString()
        }
      };

      setLogs((prev) => [...prev.slice(-14), newLog]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Copy JSON Payload
  const handleCopyJson = (jsonObj: any, id: string) => {
    navigator.clipboard.writeText(JSON.stringify(jsonObj, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="agent-stream" className="w-full space-y-6">
      
      {/* Section Title */}
      <div className="border-b border-white/10 pb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Live Command Terminal</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              AGENT TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time typewriter execution stream & step payload inspection drawer.
          </p>
        </div>

        {/* Stream Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`p-2 rounded-lg text-xs font-mono border flex items-center space-x-1.5 transition ${
              isStreaming
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pause Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Resume</span>
              </>
            )}
          </button>

          <button
            onClick={() => setLogs([])}
            className="p-2 rounded-lg text-xs text-slate-400 bg-white/5 border border-white/10 hover:text-white transition"
            title="Clear Log Terminal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Workflow Flowchart Diagram */}
      <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20">
        <div className="text-xs font-mono font-bold text-emerald-400 mb-3 flex items-center space-x-2">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>Interactive Execution Graph (Hover steps to highlight connected lines)</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 relative py-2">
          {WORKFLOW_NODES.map((node, index) => {
            const isHovered = hoveredNodeId === node.id;
            const isConnected = hoveredNodeId && WORKFLOW_NODES.find(n => n.id === hoveredNodeId)?.connectedTo.includes(node.id);

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className={`relative p-3 rounded-xl border transition-all duration-300 cursor-pointer flex-1 min-w-[130px] ${
                    isHovered || isConnected
                      ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105'
                      : node.status === 'active'
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : node.status === 'completed'
                      ? 'bg-black/60 border-emerald-500/30 text-emerald-300'
                      : 'bg-black/40 border-white/10 text-slate-500'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="p-1 rounded bg-white/10 text-emerald-400">
                      {index === 0 && <Terminal className="w-3.5 h-3.5" />}
                      {index === 1 && <Layers className="w-3.5 h-3.5" />}
                      {index === 2 && <Calendar className="w-3.5 h-3.5" />}
                      {index === 3 && <ShieldCheck className="w-3.5 h-3.5" />}
                      {index === 4 && <Send className="w-3.5 h-3.5" />}
                    </span>
                    <span className="text-xs font-bold text-white leading-tight">{node.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{node.sublabel}</div>
                </div>

                {/* Arrow Connector Line */}
                {index < WORKFLOW_NODES.length - 1 && (
                  <div className="hidden sm:flex items-center justify-center">
                    <div
                      className={`h-0.5 w-6 transition-all duration-300 ${
                        isHovered || isConnected
                          ? 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,1)]'
                          : 'bg-white/15'
                      }`}
                    />
                    <ChevronRight
                      className={`w-4 h-4 -ml-1 transition-colors ${
                        isHovered || isConnected ? 'text-emerald-400' : 'text-slate-600'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Terminal Container */}
      <div className="relative rounded-2xl overflow-hidden glass-panel border border-emerald-500/20 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        
        {/* Terminal Titlebar */}
        <div className="px-4 py-2.5 bg-slate-950/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="ml-2 font-mono text-xs text-slate-400 flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>iteris-stream@agent-cluster-01 ~ %</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>LIVE STACK INSPECTOR ACTIVE</span>
          </div>
        </div>

        {/* Log Lines Container */}
        <div className="p-4 h-[360px] overflow-y-auto font-mono text-xs space-y-2.5 bg-black/90">
          {logs.map((log) => {
            const isSelected = selectedLog?.id === log.id;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedLog(log)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer group flex items-start justify-between ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-white/[0.02] border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-start space-x-3 overflow-hidden">
                  <span className="text-slate-500 text-[10px] font-mono whitespace-nowrap pt-0.5">
                    [{log.timestamp}]
                  </span>
                  <div className="space-y-0.5">
                    <div className="text-emerald-400 font-semibold text-[11px] flex items-center space-x-1.5">
                      <span>{log.agent}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-normal">
                      {log.text}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-2 flex-shrink-0 pt-0.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 group-hover:text-emerald-300 group-hover:border-emerald-500/30 transition">
                    Inspect JSON ➔
                  </span>
                </div>
              </motion.div>
            );
          })}
          <div ref={logEndRef} />
        </div>

      </div>

      {/* JSON Payload Inspector Drawer / Modal */}
      <AnimatePresence>
        {selectedLog && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="glass-panel p-5 rounded-2xl border border-emerald-500/40 bg-black/95 shadow-[0_0_50px_rgba(16,185,129,0.25)] relative"
          >
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white font-mono">
                  JSON Payload Drawer: {selectedLog.agent}
                </h4>
              </div>

              <button
                onClick={() => handleCopyJson(selectedLog.jsonPayload, selectedLog.id)}
                className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center space-x-1.5 hover:bg-emerald-500/20 transition"
              >
                {copiedId === selectedLog.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-3 font-mono">
              Timestamp: <span className="text-emerald-400">{selectedLog.timestamp}</span> • Payload ID: <span className="text-cyan-400">{selectedLog.jsonPayload.requestId}</span>
            </p>

            <pre className="p-4 rounded-xl bg-slate-950 border border-white/10 text-emerald-300 font-mono text-xs overflow-x-auto max-h-60 selection:bg-emerald-500/40">
              {JSON.stringify(selectedLog.jsonPayload, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default LiveTerminal;
