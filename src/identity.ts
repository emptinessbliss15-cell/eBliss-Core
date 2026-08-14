export type SubjectType = "person" | "agent" | "service" | "group";

export interface Subject {
  id: string;
  type: SubjectType;
  displayName?: string;
}

export type Relationship =
  | "owner"
  | "member"
  | "participant"
  | "delegate"
  | "viewer"
  | "administrator";

export interface RelationshipGrant {
  subjectId: string;
  resourceType: string;
  resourceId: string;
  relationship: Relationship;
  grantedBy?: string;
  expiresAt?: string;
}

export interface Delegation {
  delegatorId: string;
  delegateId: string;
  actions: string[];
  resourceType: string;
  resourceId: string;
  startsAt?: string;
  expiresAt?: string;
  reason?: string;
}

export interface IdentityContext {
  subject: Subject;
  relationships: RelationshipGrant[];
  delegations: Delegation[];
}
