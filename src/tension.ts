export type TensionStatus = "open" | "acknowledged" | "in-progress" | "resolved" | "dismissed";

export type TensionTrigger =
  | "observation"
  | "known-unknown"
  | "conflict"
  | "constraint"
  | "opportunity"
  | "request"
  | "reassessment";

export interface Tension {
  id: string;
  title: string;
  description?: string;
  status: TensionStatus;
  trigger: TensionTrigger;
  raisedBy: string;
  resourceType?: string;
  resourceId?: string;
  evidenceIds: string[];
  relatedTensionIds: string[];
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface TensionAction {
  type: "investigate" | "discuss" | "propose" | "delegate" | "decide" | "act" | "observe" | "dismiss";
  rationale: string;
}

export interface TensionAssessment {
  tension: Tension;
  suggestedActions: TensionAction[];
  requiresHumanDecision: boolean;
}

/**
 * A facilitator may surface movement from a tension, but does not decide
 * which consequential action should be taken.
 */
export function assessTension(tension: Tension): TensionAssessment {
  const suggestedActions: TensionAction[] = [];

  if (tension.status === "resolved" || tension.status === "dismissed") {
    return { tension, suggestedActions: [], requiresHumanDecision: false };
  }

  if (tension.trigger === "known-unknown" || tension.trigger === "reassessment") {
    suggestedActions.push({ type: "investigate", rationale: "Additional information may resolve the tension before action is taken." });
  }

  if (tension.trigger === "conflict") {
    suggestedActions.push({ type: "discuss", rationale: "The conflicting perspectives should be surfaced without assuming either is correct." });
  }

  if (tension.trigger === "constraint") {
    suggestedActions.push({ type: "propose", rationale: "A proposed change may address the constraint while preserving authorization boundaries." });
  }

  if (tension.trigger === "opportunity" || tension.trigger === "request") {
    suggestedActions.push({ type: "propose", rationale: "A proposal creates an explicit, reviewable path from the tension to possible action." });
  }

  if (suggestedActions.length === 0) {
    suggestedActions.push({ type: "observe", rationale: "Gather enough context to understand the tension before choosing an intervention." });
  }

  return {
    tension,
    suggestedActions,
    requiresHumanDecision: suggestedActions.some((action) => ["decide", "act"].includes(action.type)),
  };
}
