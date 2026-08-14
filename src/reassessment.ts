export type ReassessmentRelationship =
  | "supports"
  | "contradicts"
  | "explains"
  | "caused"
  | "supersedes"
  | "related";

export interface EvidenceLink {
  evidenceId: string;
  targetType: "decision" | "proposal" | "change" | "evidence";
  targetId: string;
  relationship: ReassessmentRelationship;
}

export interface ReassessmentCandidate {
  targetType: "decision" | "proposal" | "change";
  targetId: string;
  relationships: ReassessmentRelationship[];
  requiresReview: boolean;
}

export function findReassessmentCandidates(
  evidenceId: string,
  links: EvidenceLink[],
): ReassessmentCandidate[] {
  const grouped = new Map<string, ReassessmentCandidate>();

  for (const link of links) {
    if (link.evidenceId !== evidenceId || link.targetType === "evidence") continue;

    const key = `${link.targetType}:${link.targetId}`;
    const existing = grouped.get(key) ?? {
      targetType: link.targetType,
      targetId: link.targetId,
      relationships: [],
      requiresReview: false,
    };

    if (!existing.relationships.includes(link.relationship)) {
      existing.relationships.push(link.relationship);
    }

    if (link.relationship === "contradicts" || link.relationship === "supersedes") {
      existing.requiresReview = true;
    }

    grouped.set(key, existing);
  }

  return [...grouped.values()];
}
