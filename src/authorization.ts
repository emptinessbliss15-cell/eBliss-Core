export const AUTHORIZATION_ACTIONS = [
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

export type AuthorizationAction = (typeof AUTHORIZATION_ACTIONS)[number];

export interface AuthorizationRequest {
  subjectId: string;
  action: AuthorizationAction;
  resourceType: string;
  resourceId: string;
  reason?: string;
}

export interface AuthorizationDecision {
  allowed: boolean;
  subjectId: string;
  action: AuthorizationAction;
  resourceType: string;
  resourceId: string;
  basis: "role" | "delegation" | "policy" | "owner" | "system" | "denied";
  explanation: string;
}

export interface AuthorizationPolicy {
  id: string;
  description?: string;
  allowedActions: AuthorizationAction[];
}

export interface Authorizer {
  authorize(request: AuthorizationRequest): Promise<AuthorizationDecision> | AuthorizationDecision;
}

/**
 * Safe default: no mutating or decision-making authority is granted until
 * a consuming application supplies its real policy/identity implementation.
 */
export class DefaultAuthorizer implements Authorizer {
  authorize(request: AuthorizationRequest): AuthorizationDecision {
    const nonMutating = ["observe", "facilitate", "suggest"] as AuthorizationAction[];
    const allowed = nonMutating.includes(request.action);

    return {
      allowed,
      subjectId: request.subjectId,
      action: request.action,
      resourceType: request.resourceType,
      resourceId: request.resourceId,
      basis: allowed ? "system" : "denied",
      explanation: allowed
        ? "Core default permits non-mutating support actions only."
        : "No decision, authorization, execution, or administrative authority is granted by the Core default policy.",
    };
  }
}
