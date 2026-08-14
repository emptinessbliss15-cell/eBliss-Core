# eBliss Core

Shared application capabilities and protocols for eBliss apps, powering REST, MCP, agents, and other interfaces.

## Architecture

Interfaces are adapters. Business/domain behavior lives in reusable application capabilities rather than inside REST or MCP handlers.

```text
REST ──────┐
           ├──> eBliss Core capabilities ──> data/services
MCP ───────┘
```

This keeps application logic in one place while allowing multiple clients and interfaces to consume the same capabilities.

## Design principles

- One capability implementation; multiple interfaces.
- MCP is a first-class interface for agent interaction.
- REST remains available for conventional clients.
- Shared protocols define stable contracts between components.
- Authorization belongs at the capability boundary, not only at an interface adapter.
- Keep domain logic independent of any particular UI.
- Prefer Cloudflare service bindings for Worker-to-Worker communication where appropriate.

## Status

Early foundation for the eBliss application platform. Domain-specific capabilities will be implemented by individual eBliss applications such as eB-Lists while this repository provides reusable infrastructure and contracts.

## License

MIT
