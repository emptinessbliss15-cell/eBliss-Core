import type { EpistemicAssessment, EpistemicState, KnowledgeBoundary } from "./epistemic";

export interface EpistemicReview {
  boundaryId: string;
  reason: "assumption-challenged" | "unknown-resolved" | "new-unknown" | "observation-added" | "inference-changed";
  requiresReview: boolean;
  note: string;
}

export function reviewEpistemicChange(
  previous: EpistemicAssessment,
  current: EpistemicAssessment,
): EpistemicReview[] {
  const previousById = new Map(previous.boundaries.map((boundary: KnowledgeBoundary) => [boundary.id, boundary]));
  const reviews: EpistemicReview[] = [];

  for (const boundary of current.boundaries) {
    const prior = previousById.get(boundary.id);
    if (!prior) {
      reviews.push({
        boundaryId: boundary.id,
        reason: "observation-added",
        requiresReview: false,
        note: "A new knowledge boundary was added.",
      });
      continue;
    }

    if (prior.state === "assumed" && boundary.state !== "assumed") {
      reviews.push({
        boundaryId: boundary.id,
        reason: "assumption-challenged",
        requiresReview: true,
        note: "An assumption changed epistemic status and should be examined before dependent decisions are treated as unchanged.",
      });
    } else if (prior.state === "unknown" && boundary.state !== "unknown") {
      reviews.push({
        boundaryId: boundary.id,
        reason: "unknown-resolved",
        requiresReview: false,
        note: "A previously known unknown now has an explicit epistemic state.",
      });
    } else if (prior.state !== boundary.state) {
      reviews.push({
        boundaryId: boundary.id,
        reason: "inference-changed",
        requiresReview: true,
        note: `Epistemic state changed from ${prior.state} to ${boundary.state}.`,
      });
    }
  }

  return reviews;
}

export function findKnownUnknowns(assessment: EpistemicAssessment): KnowledgeBoundary[] {
  return assessment.boundaries.filter((boundary) => boundary.state === "unknown");
}

export function findUnobservable(assessment: EpistemicAssessment): KnowledgeBoundary[] {
  return assessment.boundaries.filter((boundary) => boundary.state === "unobservable");
}

export const REVIEW_TRIGGER_STATES: EpistemicState[] = ["uncertain", "assumed", "speculative"];
