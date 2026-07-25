'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  UserCheck, 
  ShieldAlert, 
  SlidersHorizontal, 
  Sparkles,
  ChevronRight,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, TaskStatus } from '../types';

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-101',
    name: 'Reconcile Q3 Cloud Infrastructure Costs & Reserved Instances',
    ownerName: 'Elena Rostova',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    ownerRole: 'FinOps Lead',
    status: 'Requires Approval',
    priority: 'Critical',
    conflict: {
      hasConflict: true,
      title: 'Schedule Overlap',
      details: 'Overlaps with AWS Annual Contract Negotiation meeting at 3:00 PM EST.',
      conflictingWith: 'AWS Renewal Sync',
      severity: 'red'
    },
    deadline: 'Today, 4:00 PM',
    category: 'Finance & Cloud',
    impact: 'Estimated Savings: $14,200 / mo',
    approvalRequired: true,
    isApproved: false,
    progress: 75
  },
  {
    id: 'task-102',
    name: 'Reroute Tokyo Supply Chain Air Freight around Typhoon Flare',
    ownerName: 'Kenji Sato',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ownerRole: 'APAC Logistics Spec',
    status: 'Active',
    priority: 'High',
    conflict: {
      hasConflict: true,
      title: 'Schedule Overlap',
      details: 'Carrier API timeout window coincides with London Customs clearance batching.',
      conflictingWith: 'London Customs API Batch',
      severity: 'amber'
    },
    deadline: 'Tomorrow, 09:00 AM JST',
    category: 'Logistics',
    impact: 'Avoids 18 hr transport delay',
    approvalRequired: false,
    isApproved: false,
    progress: 45
  },
  {
    id: 'task-103',
    name: 'Auto-Negotiate Enterprise SaaS Renewal for Notion & Figma',
    ownerName: 'Marcus Vance',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    ownerRole: 'Procurement Manager',
    status: 'Requires Approval',
    priority: 'High',
    conflict: null,
    deadline: 'Jul 28, 2026',
    category: 'Procurement',
    impact: '15% Tier Discount Locked',
    approvalRequired: true,
    isApproved: false,
    progress: 90
  },
  {
    id: 'task-104',
    name: 'Deploy Zero-Trust Authentication Patch to EU Microservice Cluster',
    ownerName: 'Sophia Lin',
    ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    ownerRole: 'DevSecOps Engineer',
    status: 'Completed',
    priority: 'Medium',
    conflict: null,
    deadline: 'Completed 10m ago',
    category: 'Security',
    impact: 'GDPR Article 32 Verified',
    approvalRequired: false,
    isApproved: true,
    progress: 100
  },
  {
    id: 'task-105',
    name: 'Aggregate Executive Board Briefing from 14 Multi-Team Transcripts',
    ownerName: 'David Kim',
    ownerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    ownerRole: 'AI Ops Architect',
    status: 'Completed',
    priority: 'Low',
    conflict: null,
    deadline: 'Completed 1h ago',
    category: 'Executive AI',
    impact: 'Saved 6.5 engineering hours',
    approvalRequired: false,
    isApproved: true,
    progress: 100
  }
];

// Interactive Parallax 3D Card Component
interface ParallaxCardProps {
  task: Task;
  onApprove: (id: string) => void;
}

const ParallaxCard: React.FC<ParallaxCardProps> = ({ task, onApprove }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [sheenPosition, setSheenPosition] = useState({ x: 50, y: 50 });
  const [showTooltip, setShowTooltip] = useState(false);

  // Slide-to-approve drag position state
  const [slideX, setSlideX] = useState(0);
  const maxSlide = 220; // Max drag distance
  const [isApprovedState, setIsApprovedState] = useState(task.isApproved);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rX = ((mouseY - height / 2) / height) * -14;
    const rY = ((mouseX - width / 2) / width) * 14;

    setRotateX(rX);
    setRotateY(rY);
    setSheenPosition({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setSheenPosition({ x: 50, y: 50 });
  };

  // Slider Drag Logic
  const handleSliderDrag = (_: any, info: any) => {
    const newX = Math.max(0, Math.min(info.offset.x, maxSlide));
    setSlideX(newX);
  };

  const handleSliderDragEnd = () => {
    if (slideX > maxSlide * 0.75) {
      // Trigger approval celebration
      setSlideX(maxSlide);
      setIsApprovedState(true);
      onApprove(task.id);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (err) {
        // Fallback
      }
    } else {
      setSlideX(0);
    }
  };

  const statusColors = {
    'Requires Approval': 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]',
    'Active': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
    'Completed': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    'Pending': 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between h-full min-h-[340px] select-none ${
        isApprovedState
          ? 'glass-panel bg-emerald-950/20 border-emerald-500/30'
          : task.conflict?.severity === 'red'
          ? 'glass-panel bg-rose-950/20 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
          : 'glass-panel hover:border-emerald-500/40 hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)]'
      }`}
    >
      {/* Light Sheen Reflection Overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(255,255,255,0.4), transparent 60%)`
        }}
      />

      <div className="space-y-3 relative z-10">
        
        {/* Top Header: Category + Status Badge */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center space-x-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>{task.category}</span>
          </span>

          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
              isApprovedState
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : statusColors[task.status]
            }`}
          >
            {isApprovedState ? 'Approved & Dispatched' : task.status}
          </span>
        </div>

        {/* Task Name */}
        <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
          {task.name}
        </h3>

        {/* Impact Subtitle */}
        <div className="text-xs text-emerald-400 font-mono flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{task.impact}</span>
        </div>

        {/* Conflict Indicator with Interactive Hover Tooltip */}
        {task.conflict && !isApprovedState && (
          <div className="relative pt-1">
            <div
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                task.conflict.severity === 'red'
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 animate-pulse'
                  : 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-bounce" />
                <span className="font-semibold text-[11px] font-mono">
                  {task.conflict.title}: Overlaps with {task.conflict.conflictingWith}
                </span>
              </div>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Interactive Conflict Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="absolute bottom-full left-0 right-0 mb-2 p-3 glass-panel rounded-xl border border-rose-500/50 bg-black/90 shadow-[0_0_25px_rgba(244,63,94,0.3)] z-30 text-xs space-y-1"
                >
                  <div className="font-bold text-rose-300 flex items-center space-x-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Iteris Conflict Detector</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    {task.conflict.details}
                  </p>
                  <div className="text-[10px] text-emerald-400 font-mono pt-1">
                    Suggested Resolution: Auto-reschedule meeting or slide to override & execute immediately.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* Card Footer Section */}
      <div className="pt-4 border-t border-white/10 space-y-3 relative z-10">
        
        {/* Owner Info & Deadline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {/* Owner Avatar */}
            <div className="relative">
              <img
                src={task.ownerAvatar}
                alt={task.ownerName}
                className="w-7 h-7 rounded-full object-cover border border-emerald-500/40"
              />
              <div className="w-2 h-2 rounded-full bg-emerald-400 absolute bottom-0 right-0 border border-black"></div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">{task.ownerName}</div>
              <div className="text-[10px] text-slate-400">{task.ownerRole}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400 flex items-center space-x-1 justify-end">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Deadline</span>
            </div>
            <div className="text-xs font-mono font-medium text-slate-200">{task.deadline}</div>
          </div>
        </div>

        {/* Human-in-the-Loop "Slide to Approve" Bar */}
        {task.approvalRequired && !isApprovedState ? (
          <div className="pt-2">
            <div className="relative h-11 bg-slate-900/90 rounded-full border border-rose-500/30 p-1 flex items-center overflow-hidden shadow-inner">
              
              {/* Sliding Track Label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[11px] font-mono text-slate-400 font-semibold tracking-wider">
                <span>Slide to Approve ➔</span>
              </div>

              {/* Glowing Slider Knob */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: maxSlide }}
                dragElastic={0.05}
                onDrag={handleSliderDrag}
                onDragEnd={handleSliderDragEnd}
                style={{ x: slideX }}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-rose-500 via-emerald-500 to-teal-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.8)] cursor-grab active:cursor-grabbing z-20"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </div>
        ) : isApprovedState ? (
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center space-x-2 text-xs font-mono text-emerald-300">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Human Approval Confirmed</span>
          </div>
        ) : null}

      </div>
    </motion.div>
  );
};

export const TaskMatrix = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Requires Approval' | 'Completed'>('All');

  const handleApprove = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: 'Completed', isApproved: true, approvalRequired: false }
          : t
      )
    );
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'Requires Approval') return t.approvalRequired && !t.isApproved;
    if (activeFilter === 'Completed') return t.status === 'Completed' || t.isApproved;
    return true;
  });

  return (
    <section id="task-matrix" className="w-full space-y-6">
      
      {/* Matrix Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Task Matrix</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              PARALLAX GRID
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time conflict detection & human-in-the-loop slide approval gates.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="glass-pill p-1 rounded-xl inline-flex items-center space-x-1 border border-white/10 self-start sm:self-auto">
          {(['All', 'Requires Approval', 'Completed'] as const).map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter === 'All' && `All Tasks (${tasks.length})`}
                {filter === 'Requires Approval' && `Requires Approval (${tasks.filter(t => t.approvalRequired && !t.isApproved).length})`}
                {filter === 'Completed' && `Completed (${tasks.filter(t => t.status === 'Completed' || t.isApproved).length})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Parallax Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ParallaxCard task={task} onApprove={handleApprove} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </section>
  );
};

export default TaskMatrix;
