/**
 * Shared authorization vocabulary for eBliss capabilities.
 *
 * Authorization is intentionally separate from application/domain logic so
 * Lists, Theme, Console, and external MCP adapters can use the same model.
 */

export const AUTHORITY_LEVELS = [
  "observe",
  "facilitate",
  "suggest",
  "propose",
  "request",
  "approve",
  "reject",
  "authorize",
  "execute",
  "administer",
] as const;

export type Authority = (typeof AUTHORITY_LEVELS)[number];

export interface Subject {
  id: string;
  type: "person" | "agent" | "role" | "group" | "service";
}

export interface ResourceRef {
  id: string;
  type: string;
  source?: string;
}

export interface Permission {
  subject: Subject;
  authority: Authority;
  resource: ResourceRef;
  conditions?: Record<string, unknown>;
}

export interface AuthorizationRequest {
  subject: Subject;
  authority: Authority;
  resource: ResourceRef;
  context?: Record<string, unknown>;
}

export interface AuthorizationDecision {
  allowed: boolean;
  authority: Authority;
  reason: string;
  matchedPermissions: Permission[];
}

export interface Authorizer {
  authorize(request: AuthorizationRequest): Promise<AuthorizationDecision>;
}

/**
 * Minimal in-memory authorizer for tests and local development.
 * Production applications may replace this with database/policy-backed logic.
 */
export class PolicyAuthorizer implements Authorizer {
  constructor(private readonly permissions: Permission[] = []) {}

  async authorize(request: AuthorizationRequest): Promise<AuthorizationDecision> {
    const matchedPermissions = this.permissions.filter(
      (permission) =>
        permission.subject.id === request.subject.id &&
        permission.subject.type === request.subject.type &&
        permission.authority === request.authority &&
        permission.resource.id === request.resource.id &&
        permission.resource.type === request.resource.type &&
        (!permission.resource.source || permission.resource.source === request.resource.source),
    );

    return {
      allowed: matchedPermissions.length > 0,
      authority: request.authority,
      reason:
        matchedPermissions.length > 0
          ? "Authorized by matching permission."
          : "No matching permission was found.",
      matchedPermissions,
    };
  }
}
