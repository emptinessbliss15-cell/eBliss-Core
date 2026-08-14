/** Shared protocol types belong here as the eBliss platform evolves. */

export interface ResourceRef {
  id: string;
  type: string;
}

export interface CapabilityDescriptor {
  name: string;
  description?: string;
  inputSchema?: unknown;
  outputSchema?: unknown;
}

/** A request for evidence-backed decision support. */
export interface DecisionSupportRequest {
  id: string;
  subject: ResourceRef;
  question: string;
  proposedAction?: string;
  context?: Record<string, unknown>;
}

export interface DecisionSupportFinding {
  statement: string;
  evidenceIds: string[];
  state: "observed" | "derived" | "uncertain" | "speculative" | "proposed";
  confidence?: "high" | "medium" | "low";
}

export interface DecisionSupportResponse {
  requestId: string;
  findings: DecisionSupportFinding[];
  impact?: import("../agent").ImpactAnalysis;
  requiresHumanDecision: boolean;
  recommendedNextSteps?: string[];
}

/**
 * A proposed action remains distinct from an authorized action.
 * Applications must perform authorization before mutation/execution.
 */
export interface ActionProposal {
  id: string;
  resource: ResourceRef;
  action: string;
  rationale?: string;
  evidenceIds: string[];
  authorizationRequired: boolean;
}
