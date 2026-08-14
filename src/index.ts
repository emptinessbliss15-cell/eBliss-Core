import { CapabilityRegistry } from "./application";

export const registry = new CapabilityRegistry();

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({
        ok: true,
        service: "eBliss-Core",
      });
    }

    if (url.pathname === "/capabilities" && request.method === "GET") {
      return Response.json({
        capabilities: [],
        note: "Domain-specific capabilities are registered by consuming applications.",
      });
    }

    return Response.json(
      {
        error: "Not found",
        service: "eBliss-Core",
      },
      { status: 404 },
    );
  },
};

export * from "./application";
export * from "./capabilities";
export * from "./protocols";
