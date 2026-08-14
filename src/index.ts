import { CapabilityRegistry } from "./application";
import { AGENT_MODES, FACILITATOR_BOUNDARY, type ImpactAnalysis } from "./agent";

export const registry = new CapabilityRegistry();

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ ok: true, service: "eBliss-Core" });
    }

    if (url.pathname === "/capabilities" && request.method === "GET") {
      return Response.json({
        capabilities: [],
        note: "Domain-specific capabilities are registered by consuming applications.",
      });
    }

    if (url.pathname === "/agent/contract" && request.method === "GET") {
      return Response.json({
        agentModes: AGENT_MODES,
        evidenceStates: ["observed", "derived", "uncertain", "speculative", "proposed"],
        facilitatorBoundary: FACILITATOR_BOUNDARY,
        lifecycle: ["context", "impact-analysis", "discussion", "authorization", "action", "verification"],
      });
    }

    if (url.pathname === "/agent/impact" && request.method === "POST") {
      const body = (await request.json()) as {
        resourceId?: string;
        direct?: ImpactAnalysis["direct"];
        dependent?: ImpactAnalysis["dependent"];
        external?: ImpactAnalysis["external"];
        unknown?: ImpactAnalysis["unknown"];
      };

      if (!body.resourceId) {
        return Response.json({ error: "resourceId is required" }, { status: 400 });
      }

      return Response.json({
        resourceId: body.resourceId,
        direct: body.direct ?? [],
        dependent: body.dependent ?? [],
        external: body.external ?? [],
        unknown: body.unknown ?? [],
      });
    }

    return Response.json({ error: "Not found", service: "eBliss-Core" }, { status: 404 });
  },
};

export * from "./agent";
export * from "./application";
export * from "./authorization";
export * from "./capabilities";
export * from "./protocols";
