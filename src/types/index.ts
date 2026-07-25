export type TaskStatus = 'Pending' | 'Active' | 'Completed' | 'Requires Approval';

export interface TaskConflict {
  hasConflict: boolean;
  title?: string;
  details?: string;
  conflictingWith?: string;
  severity?: 'amber' | 'red';
}

export interface Task {
  id: string;
  name: string;
  ownerName: string;
  ownerAvatar: string;
  ownerRole: string;
  status: TaskStatus;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  conflict: TaskConflict | null;
  deadline: string;
  category: string;
  impact: string;
  approvalRequired?: boolean;
  isApproved?: boolean;
  progress: number;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  agent: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'action' | 'api';
  jsonPayload: {
    requestId: string;
    endpoint?: string;
    method?: string;
    statusCode?: number;
    latencyMs?: number;
    agentName?: string;
    agentId?: string;
    inputParameters?: Record<string, any>;
    outputResult?: Record<string, any>;
    tokensUsed?: number;
    costUsd?: number;
    timestamp?: string;
  };
}

export interface GlobePin {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  xPercent: number; // 2D projection percentage for map/globe canvas fallback
  yPercent: number;
  activeAgent: string;
  taskSummary: string;
  metric: string;
  status: 'Active' | 'Processing' | 'Synced';
}

export interface WorkflowNode {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  status: 'completed' | 'active' | 'pending' | 'warning';
  connectedTo: string[];
  payload: Record<string, any>;
}
