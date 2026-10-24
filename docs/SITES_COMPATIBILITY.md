# ChatGPT Sites compatibility — separate runtime, shared product logic

**Decision:** The main repository is an AdonisJS + React/Inertia + Lucid + local SQLite Node application.

This app is **not** a ready-to-deploy ChatGPT Site. Sites uses its own supported hosting/runtime model with D1 and R2 bindings; it cannot be assumed to start an unrestricted AdonisJS Node server or use the same local SQLite connection.

## Sharing LiteLLM across environments

Both a Zo Node app and a future Sites-compatible backend may use the same LiteLLM gateway URL and `agentic-cfo` model alias, with separate restricted virtual keys. In ChatGPT Sites, store secrets through hosted Site Settings, **not in browser code or a public file**. Sites needs an adapter that can make authenticated outbound requests from its supported server runtime. This repository does not currently contain or deploy a complete Sites adaptation.

Using one ChatGPT subscription to build/manage both environments does not automatically connect runtime AI calls to that plan. The LiteLLM ChatGPT-subscription provider is a separate OAuth-authenticated upstream integration with model/plan restrictions. See [LiteLLM setup](LITELLM_SETUP.md).

## Valid development approach

- ChatGPT remains a convenient development environment for this GitHub repository.
- Deploy the **full AdonisJS app** on a Node-capable host (Zo Computer Services) with a persistent SQLite file.
- If a separately hosted ChatGPT Site is needed, treat that as a dedicated adapter/application targeting Sites runtime, storage and authentication. Reuse only portable, pure TypeScript domain services after compatibility testing (financial calculations, planning rules, input representations). Keep data and application contracts consistent; do not copy Node-specific Lucid code into a D1 worker and expect it to run.
- Site instances would use an independent D1 database until explicitly migrated or synchronized. Never claim the Zo SQLite DB and Sites D1 stay in sync automatically.

## What is deliberately not included

No second Sites frontend or SQLite-to-D1 adapter has been fabricated. Before implementing one, confirm the Sites environment supports the desired framework/build output and decide which data source is canonical.

Current reference: [Sites documentation](https://learn.chatgpt.com/docs/sites).
