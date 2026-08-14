/** Shared protocol types belong here as the eBliss platform evolves. */

export interface ResourceRef {
  id: string;
  type: string;
}

export interface CapabilityDescriptor {
  name: string;
  description?: string;
  inputSchema?: unknown;
  outputSchema?: unknown;
}
