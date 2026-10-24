# Conversational CFO — MVP

**Status:** Implemented with two read-only modes: local guided responses by default and external AI model responses when configured. Streaming, bank feeds and payment/mutation tools are excluded.

## What this adds
- Protected **Ask CFO** page (`/cfo`) alongside the existing dashboard.
- User-scoped SQLite message history (the latest 40 messages shown; up to 100 retained).
- **Local guided coach**, using deterministic read-only tool results even when no model key is configured.
- Optional configurable **Chat Completions-compatible** AI provider with function/tool calling.
- Server-side, read-only financial tools: overview, budgets, upcoming bills, savings goals and hypothetical current-month purchase.
- A rules-backed financial snapshot assembled from the **signed-in user's records**, not IDs or table names supplied by the model.
- Provider communication and errors handled server-side.
- Clear-chat operation scoped to the authenticated user.
- Daily allowance of 20 user prompts per user to limit unexpected API costs.

## Default: no configuration needed

The CFO works out of the box in **guided mode**, using local financial calculations and rules. No model key, gateway, ChatGPT credentials, or separate model service is required. This is not an LLM and supports a narrower range of questions.

## Optional direct API (separate from ChatGPT subscription)

Only if you choose to enable generative AI in a standalone AdonisJS runtime later, set server-side direct-provider credentials:

```env
CFO_AI_API_KEY=<private provider key>
CFO_AI_MODEL=<chat-completions model supporting function tools>
CFO_AI_BASE_URL=https://api.openai.com/v1
```

`CFO_AI_BASE_URL` can point at a different HTTPS Chat Completions-compatible provider. If unspecified, it defaults to the OpenAI API. Choose a model your provider documents as compatible with **Chat Completions and function calling**; not every model supports that API. If the key or model is missing, chat uses clearly labelled **guided mode**, which can answer a defined set of financial questions from recorded data. Open-ended model reasoning currently requires a separately authorised provider/API key. Logging into ChatGPT in Zo or Sites for development does not automatically provide this app with an inference endpoint. Some officially participating apps can use ChatGPT plans through approved Sign in with ChatGPT flows; this custom app does not have that integration.

When configured, the service calls `POST /chat/completions` on that provider. The API key stays server-side; do not commit it to GitHub or send it to the browser.

See [ChatGPT subscription and Sites compatibility](SITES_COMPATIBILITY.md) for the distinction between subscription access and a custom application's model requests.

## Data boundaries
1. Each request authenticates the user via AdonisJS session.
2. Only that user's database rows are loaded and used to compute a financial snapshot.
3. The model may request one of **five explicitly allowlisted read-only tools**.
4. Tool implementations receive the signed-in user's snapshot—not a model-chosen user ID, raw SQL, or a database connection.
5. Financial arithmetic occurs in deterministic services using integer cents.
6. Only when external AI is configured are user questions and tool outputs sent to the selected AI provider; otherwise guided mode keeps reasoning local. Provider data handling depends on that service's terms.
7. History is stored in SQLite as plain text, so protect the database file, its snapshots and backups as sensitive personal data.

The app cannot send payments, edit budgets through chat, place trades or guarantee current market values. The "planned purchase" tool is only a **static current-month subtraction**, not a forecast of future income or an assertion that a purchase is affordable.

## Manual verification script
1. Start the app and log in; confirm the Ask CFO tab appears.
2. Without a configured provider, confirm **Guided mode** is explicitly labelled and correctly answers only supported financial questions using stored values, without calling any external model.
3. Optional: configure a separately authorised direct model if you wish to test generative chat. Otherwise continue in credential-free guided mode.
4. Create two test accounts/users with clearly different balances.
5. As User A, ask "How much recorded cash do I have?" and verify answer matches the dashboard and does not contain User B's values.
6. Ask "What is my dining budget this month?" and "Which bills are due?".
7. Ask about an imagined SGD purchase and confirm the answer mentions the static nature of the calculation.
8. Check browser network requests: API credentials never appear client-side.
9. Clear chat and confirm User A's history disappears while User B's history is unchanged.
10. Confirm no transaction or account records have changed from chat prompts.

## Deferred
- Token streaming and partial-response UI.
- Multi-step/multi-turn tool loops and richer scenarios.
- Conversation titles and multiple chat threads per user.
- Configurable data-retention windows and exports.
- User-specific AI model selection.
- Comprehensive authenticated browser tests and deployment security reviews.
