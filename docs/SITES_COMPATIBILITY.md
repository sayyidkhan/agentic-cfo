# ChatGPT Sites and Zo: simple CFO model approach

## Current decision

**No LiteLLM gateway, no subscription-token proxy, and no Docker.**

Agentic CFO's source of truth is [GitHub](https://github.com/sayyidkhan/agentic-cfo). The Node/AdonisJS app runs on Zo with SQLite. The product's budgeting, net worth calculations and **guided financial chat** work without AI keys.

## What the same ChatGPT subscription gives you

- **ChatGPT / Sites:** A plan-eligible place to build, edit and manage a supported Site, subject to plan limits.
- **Zo Codex:** Supported subscription sign-in for using Codex as an AI coding/agent tool inside Zo. This does **not** automatically give this AdonisJS server a model API.
- **Sign in with ChatGPT:** Some participating apps can ask permission to use the ChatGPT plan for eligible AI requests. This is not enabled automatically for arbitrary applications; the custom Agentic CFO is not currently enrolled as a participating integration.

OpenAI documentation:
- [Using your ChatGPT plan in other apps](https://help.openai.com/en/articles/20001542-using-your-chatgpt-plan-in-other-apps-and-sites)
- [Sign in with ChatGPT](https://help.openai.com/en/articles/20001410-sign-in-with-chatgpt)

## Sites runtime adaptation

The AdonisJS + Lucid + local SQLite server cannot simply be deployed unchanged to ChatGPT Sites. The additive `sites/` application now adapts the frontend to a React/Cloudflare Worker bundle and reuses the pure calculation services. Its authenticated D1 workspace API and schema are implemented behind a fail-closed release lock.

The public release is an explicitly labelled synthetic-data demo. Real financial record persistence remains disabled pending live native authentication and two-visitor isolation verification. No records were imported from Zo, and no automatic data sync exists. See `sites/README.md` and `docs/SITES_VERIFICATION.md`.

## If live model responses are required later

Option A: Use an officially supported native model capability exposed to a compatible Site, if that capability is available for your project.

Option B: Adopt a properly authorised external direct API model when you're ready, with separate server-side credentials and any applicable usage billing.

Until then, **guided mode is deliberate, reliable and credential-free**, but it is a rules-based assistant, not a generative model.
