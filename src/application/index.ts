import type { Capability, CapabilityContext } from "../capabilities";

export class CapabilityRegistry {
  private readonly capabilities = new Map<string, Capability>();

  register<TInput, TOutput>(capability: Capability<TInput, TOutput>): void {
    if (this.capabilities.has(capability.name)) {
      throw new Error(`Capability already registered: ${capability.name}`);
    }
    this.capabilities.set(capability.name, capability as Capability);
  }

  get(name: string): Capability {
    const capability = this.capabilities.get(name);
    if (!capability) {
      throw new Error(`Capability not found: ${name}`);
    }
    return capability;
  }

  async execute<TOutput = unknown>(
    name: string,
    input: unknown,
    context: CapabilityContext,
  ): Promise<TOutput> {
    return (await this.get(name).execute(input, context)) as TOutput;
  }
}
