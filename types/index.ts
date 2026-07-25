export type GoalId = string;

export interface Goal {
  id: GoalId;
  title: string;
  current: number;
  goal: number;
  /** Lucide icon key, resolved through components/icon-map.ts */
  icon: string;
  accent: "gold" | "success" | "info";
  cadence?: string;
}

export type StreamStatus =
  | "Active"
  | "Growing"
  | "Building"
  | "Planning"
  | "Passive";

export interface IncomeStream {
  id: string;
  title: string;
  icon: string;
  monthly: number;
  status: StreamStatus;
  /** Twelve months of history, used by the sparkline and the area chart. */
  history: number[];
}

export interface Idea {
  id: string;
  title: string;
  note?: string;
  stage: "Spark" | "Exploring" | "Committed";
}

export type AgentStatus = "Active" | "Idle" | "Training";

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  /** 0–100, drives the load meter. */
  load: number;
  lastAction: string;
}

export interface RoadmapStage {
  id: string;
  label: string;
  detail: string;
  complete: boolean;
}

export interface LearningTrack {
  id: string;
  title: string;
  provider: string;
  progress: number;
  hours: number;
  icon: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  tone: "success" | "info" | "gold" | "danger";
  timestamp: number;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}
