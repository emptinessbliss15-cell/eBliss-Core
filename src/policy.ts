import type { AuthorizationAction, AuthorizationDecision, AuthorizationRequest } from "./authorization";
import type { Delegation, RelationshipGrant } from "./identity";

export interface PolicyContext {
  relationships: RelationshipGrant[];
  delegations: Delegation[];
}

export interface PolicyRule {
  relationship: RelationshipGrant["relationship"];
  actions: AuthorizationAction[];
}

const DEFAULT_RULES: PolicyRule[] = [
  { relationship: "owner", actions: ["observe", "facilitate", "suggest", "propose", "request", "approve", "reject", "authorize", "execute", "administer"] },
  { relationship: "administrator", actions: ["observe", "facilitate", "suggest", "propose", "request", "approve", "reject", "authorize", "execute"] },
  { relationship: "member", actions: ["observe", "facilitate", "suggest", "propose", "request"] },
  { relationship: "participant", actions: ["observe", "facilitate", "suggest", "propose", "request"] },
  { relationship: "delegate", actions: ["observe", "facilitate", "suggest", "propose", "request"] },
  { relationship: "viewer", actions: ["observe"] },
];

export class RelationshipPolicy {
  constructor(private readonly rules: PolicyRule[] = DEFAULT_RULES) {}

  authorize(request: AuthorizationRequest, context: PolicyContext): AuthorizationDecision {
    const grants = context.relationships.filter(
      (grant) => grant.subjectId === request.subjectId && grant.resourceType === request.resourceType && grant.resourceId === request.resourceId,
    );

    const delegated = context.delegations.some((delegation: Delegation) =>
      delegation.delegateId === request.subjectId &&
      delegation.resourceType === request.resourceType &&
      delegation.resourceId === request.resourceId &&
      delegation.actions.includes(request.action),
    );

    if (delegated) return this.decision(request, true, "delegation", "Action is explicitly delegated for this resource.");

    for (const grant of grants) {
      const rule = this.rules.find((candidate) => candidate.relationship === grant.relationship);
      if (rule?.actions.includes(request.action)) {
        return this.decision(request, true, "role", `Action is permitted by the ${grant.relationship} relationship.`);
      }
    }

    return this.decision(request, false, "denied", "No relationship or delegation grants this action for this resource.");
  }

  private decision(request: AuthorizationRequest, allowed: boolean, basis: AuthorizationDecision["basis"], explanation: string): AuthorizationDecision {
    return { allowed, subjectId: request.subjectId, action: request.action, resourceType: request.resourceType, resourceId: request.resourceId, basis, explanation };
  }
}
