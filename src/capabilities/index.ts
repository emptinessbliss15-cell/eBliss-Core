/**
 * Application capabilities are the shared business operations consumed by
 * REST, MCP, UI, CLI, and future interfaces.
 *
 * Domain-specific capabilities should be implemented by consuming apps or
 * modules. This package owns the common capability contract and execution
 * boundary rather than embedding interface-specific logic.
 */

export interface CapabilityContext {
  requestId: string;
  actorId?: string;
}

export interface Capability<TInput = unknown, TOutput = unknown> {
  name: string;
  execute(input: TInput, context: CapabilityContext): Promise<TOutput>;
}

export function defineCapability<TInput, TOutput>(
  name: string,
  execute: Capability<TInput, TOutput>["execute"],
): Capability<TInput, TOutput> {
  return { name, execute };
}
