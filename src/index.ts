import { CapabilityRegistry } from "./application";
import { AGENT_MODES, FACILITATOR_BOUNDARY, type ImpactAnalysis } from "./agent";
import { DefaultAuthorizer, AUTHORIZATION_ACTIONS, type AuthorizationRequest } from "./authorization";
import { findReassessmentCandidates, type EvidenceLink } from "./reassessment";

export const registry = new CapabilityRegistry();
export const authorizer = new DefaultAuthorizer();

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") return Response.json({ ok: true, service: "eBliss-Core" });
    if (url.pathname === "/capabilities" && request.method === "GET") {
      return Response.json({ capabilities: [], note: "Domain-specific capabilities are registered by consuming applications." });
    }
    if (url.pathname === "/agent/contract" && request.method === "GET") {
      return Response.json({
        agentModes: AGENT_MODES,
        evidenceStates: ["observed", "derived", "uncertain", "speculative", "proposed"],
        facilitatorBoundary: FACILITATOR_BOUNDARY,
        lifecycle: ["context", "impact-analysis", "discussion", "authorization", "action", "verification"],
        authorizationActions: AUTHORIZATION_ACTIONS,
      });
    }
    if (url.pathname === "/agent/authorize" && request.method === "POST") {
      const body = (await request.json()) as Partial<AuthorizationRequest>;
      if (!body.subjectId || !body.action || !body.resourceType || !body.resourceId) {
        return Response.json({ error: "subjectId, action, resourceType, and resourceId are required" }, { status: 400 });
      }
      return Response.json(await authorizer.authorize(body as AuthorizationRequest));
    }
    if (url.pathname === "/agent/impact" && request.method === "POST") {
      const body = (await request.json()) as { resourceId?: string; direct?: ImpactAnalysis["direct"]; dependent?: ImpactAnalysis["dependent"]; external?: ImpactAnalysis["external"]; unknown?: ImpactAnalysis["unknown"] };
      if (!body.resourceId) return Response.json({ error: "resourceId is required" }, { status: 400 });
      return Response.json({ resourceId: body.resourceId, direct: body.direct ?? [], dependent: body.dependent ?? [], external: body.external ?? [], unknown: body.unknown ?? [] });
    }
    if (url.pathname === "/agent/reassess" && request.method === "POST") {
      const body = (await request.json()) as { evidenceId?: string; links?: EvidenceLink[] };
      if (!body.evidenceId) return Response.json({ error: "evidenceId is required" }, { status: 400 });
      return Response.json({ evidenceId: body.evidenceId, candidates: findReassessmentCandidates(body.evidenceId, body.links ?? []) });
    }
    return Response.json({ error: "Not found", service: "eBliss-Core" }, { status: 404 });
  },
};

export * from "./agent";
export * from "./application";
export * from "./authorization";
export * from "./capabilities";
export * from "./identity";
export * from "./protocols";
export * from "./reassessment";
