/**
 * Shared vocabulary for the eBliss decision-support agent.
 *
 * The agent may observe, facilitate, suggest, and propose without gaining
 * decision authority. Approval/authorization/execution remain explicit
 * capabilities governed by Core authorization policies.
 */

export const AGENT_MODES = [
  "observe",
  "facilitate",
  "suggest",
  "propose",
  "request",
  "approve",
  "authorize",
  "execute",
  "verify",
] as const;

export type AgentMode = (typeof AGENT_MODES)[number];

export type EvidenceState =
  | "observed"
  | "derived"
  | "uncertain"
  | "speculative"
  | "proposed";

export interface EvidenceRef {
  id: string;
  source: string;
  state: EvidenceState;
  description?: string;
}

export interface ImpactItem {
  subject: string;
  relationship: string;
  evidence: EvidenceRef[];
  confidence: "high" | "medium" | "low";
}

export interface ImpactAnalysis {
  resourceId: string;
  direct: ImpactItem[];
  dependent: ImpactItem[];
  external: ImpactItem[];
  unknown: ImpactItem[];
}

export interface DecisionProposal {
  id: string;
  question: string;
  proposal: string;
  evidence: EvidenceRef[];
  requiredAuthorities: string[];
  status: "open" | "approved" | "rejected" | "withdrawn";
}

export const FACILITATOR_BOUNDARY =
  "Facilitators may observe, organize, clarify, summarize, surface evidence, and propose process actions; facilitation does not imply decision or authorization authority.";
