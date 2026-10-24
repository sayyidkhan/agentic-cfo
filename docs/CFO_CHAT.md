# Conversational CFO — MVP

**Status:** Implemented as a read-only conversational vertical slice. Streaming, live bank feeds, investment advice and mutation tools are intentionally excluded.

## What this adds
- Protected **Ask CFO** page (`/cfo`) alongside the existing dashboard.
- User-scoped SQLite message history (the latest 40 messages shown; up to 100 retained).
- Configurable **Chat Completions-compatible** AI provider with function/tool calling.
- Server-side, read-only financial tools: overview, budgets, upcoming bills, savings goals and hypothetical current-month purchase.
- A rules-backed financial snapshot assembled from the **signed-in user's records**, not IDs or table names supplied by the model.
- Provider communication and errors handled server-side.
- Clear-chat operation scoped to the authenticated user.
- Daily allowance of 20 user prompts per user to limit unexpected API costs.

## Configuration
Set the following server-side environment variables (not browser variables):

```env
CFO_AI_API_KEY=<private provider key>
CFO_AI_MODEL=<chat-completions model supporting function tools>
CFO_AI_BASE_URL=https://api.openai.com/v1
```

`CFO_AI_BASE_URL` can point at a different HTTPS Chat Completions-compatible provider. If unspecified, it defaults to the OpenAI API. Choose a model your provider documents as compatible with **Chat Completions and function calling**; not every model supports that API. If the key or model is missing, chat is disabled with a visible configuration message; existing budgeting features remain usable.

The service calls `POST /chat/completions` on that provider. The API key stays server-side; do not commit it to GitHub or send it to the browser.

## Data boundaries
1. Each request authenticates the user via AdonisJS session.
2. Only that user's database rows are loaded and used to compute a financial snapshot.
3. The model may request one of **five explicitly allowlisted read-only tools**.
4. Tool implementations receive the signed-in user's snapshot—not a model-chosen user ID, raw SQL, or a database connection.
5. Financial arithmetic occurs in deterministic services using integer cents.
6. User questions and tool outputs may be sent to the selected external AI provider; provider data handling depends on that service's terms.
7. History is stored in SQLite as plain text, so protect the database file, its snapshots and backups as sensitive personal data.

The app cannot send payments, edit budgets through chat, place trades or guarantee current market values. The "planned purchase" tool is only a **static current-month subtraction**, not a forecast of future income or an assertion that a purchase is affordable.

## Manual verification script
1. Start the app and log in; confirm the Ask CFO tab appears.
2. Without a configured provider, confirm chat is disabled rather than pretending to answer.
3. Configure a compatible model key and restart the application.
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
