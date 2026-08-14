export const EPISTEMIC_STATES = [
  "observed",
  "derived",
  "assumed",
  "uncertain",
  "unknown",
  "unobservable",
  "speculative",
] as const;

export type EpistemicState = (typeof EPISTEMIC_STATES)[number];

export interface KnowledgeBoundary {
  id: string;
  subject: string;
  state: EpistemicState;
  statement: string;
  evidenceIds?: string[];
  assumptions?: string[];
  provenance?: string[];
  confidence?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EpistemicAssessment {
  known: KnowledgeBoundary[];
  inferred: KnowledgeBoundary[];
  assumptions: KnowledgeBoundary[];
  uncertainties: KnowledgeBoundary[];
  knownUnknowns: KnowledgeBoundary[];
  unobservable: KnowledgeBoundary[];
  speculative: KnowledgeBoundary[];
}

export interface EpistemicChange {
  kind:
    | "known-unknown-resolved"
    | "assumption-challenged"
    | "new-unknown"
    | "observation-added"
    | "inference-updated";
  boundaryId: string;
  evidenceIds: string[];
  explanation: string;
}

export function assessKnowledgeBoundaries(boundaries: KnowledgeBoundary[]): EpistemicAssessment {
  const assessment: EpistemicAssessment = {
    known: [],
    inferred: [],
    assumptions: [],
    uncertainties: [],
    knownUnknowns: [],
    unobservable: [],
    speculative: [],
  };

  for (const boundary of boundaries) {
    switch (boundary.state) {
      case "observed":
        assessment.known.push(boundary);
        break;
      case "derived":
        assessment.inferred.push(boundary);
        break;
      case "assumed":
        assessment.assumptions.push(boundary);
        break;
      case "uncertain":
        assessment.uncertainties.push(boundary);
        break;
      case "unknown":
        assessment.knownUnknowns.push(boundary);
        break;
      case "unobservable":
        assessment.unobservable.push(boundary);
        break;
      case "speculative":
        assessment.speculative.push(boundary);
        break;
    }
  }

  return assessment;
}
