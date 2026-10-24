# Agentic CFO — LiteLLM shared model gateway

**Status:** Client integration committed; shared gateway not provisioned, subscription OAuth not completed, and a production ChatGPT Sites adaptation is not yet deployed.

## Why LiteLLM?

The AdonisJS CFO client and any future Sites-compatible server runtime can send the same OpenAI-format requests to one **LiteLLM gateway**. The app uses a stable model alias (`agentic-cfo`) and only the gateway maps it to a provider/model. Switching models does not require changes to the CFO domain calculations.

```text
Zo Node/AdonisJS CFO -- HTTPS + gateway key --+
                                             +--> LiteLLM Gateway --> selected upstream model
ChatGPT Sites backend* -- HTTPS + gateway key +
```

*Sites still requires a dedicated, compatible backend and a safely stored secret. The current AdonisJS app cannot simply run as a Site, and a Site's own native ChatGPT model access is not automatically routed through LiteLLM.*

## The ChatGPT subscription question

**ChatGPT account/plan access and OpenAI API access are different concepts.** Using the same ChatGPT subscription to build/edit a Site and operate Zo/Codex does not, by itself, give a normal Node application a shared model API key.

As documented by LiteLLM, its **ChatGPT Subscription** provider has an OAuth device-code login path and routes eligible models via `chatgpt/`. This is a distinct, opt-in upstream integration which may be constrained by your ChatGPT plan, usage limits, model support, and provider changes. It is not a general entitlement to unlimited app API calls. Verify subscription/model eligibility and acceptable use before relying on it, particularly for a public or commercial finance product.

- LiteLLM documentation: https://docs.litellm.ai/docs/providers/chatgpt
- OpenAI plan integration: https://help.openai.com/en/articles/20001542-using-your-chatgpt-plan-in-other-apps-and-sites
- Note: OpenAI's **Sign in with ChatGPT** participating-app option is a different application integration, not automatically a LiteLLM virtual key.

LiteLLM reports that the subscription route is based on Responses API, with supported Chat Completions requests bridged to Responses. **Test structured tool calls** on the exact model/version; the CFO must receive valid function-call results to respond. A provider unable to do this does not become suitable merely because the gateway has the right URL.

## One-time gateway setup (separate from AdonisJS)

LiteLLM's proxy is a Python service; deploy/operate it once on a compatible persistent Node-independent host (including Zo Services if Python process hosting is supported), or a managed LiteLLM gateway. **No Docker is required by Agentic CFO.**

1. Install LiteLLM in a dedicated Python environment, preferably pinning a tested release.
2. For the subscription provider, complete the **interactive device-code OAuth on a trusted terminal before launching proxy workers**:

```bash
python -c "from litellm.llms.chatgpt.authenticator import Authenticator; Authenticator().get_access_token()"
```

The authentication file is normally held under `~/.config/litellm/chatgpt/auth.json`. Keep it private, writable for refresh, and persistent. **Do not copy, publish, or commit the token file**. LiteLLM documents this pre-login step because its proxy cannot interactively complete device-code authentication from a running worker.

3. Use `litellm/config.example.yaml` as a template and set a long, random **LITELLM_MASTER_KEY** (separate from the ChatGPT login) in the gateway secret environment.
4. Start the gateway with its normal Python CLI (e.g. `litellm --config /path/to/config.yaml --port 4000`). Bind privately behind an authenticated HTTPS gateway if external Sites requests are required.
5. Create a **restricted client/virtual key** and apply request/spend limits. Never expose the master key to the CFO web frontend or Sites browser JavaScript.
6. Confirm `POST /v1/chat/completions` works with the alias `agentic-cfo` and supports CFO's read-only function calls. If the subscription bridge is incompatible, switch the gateway's alias upstream to a documented API-key-backed provider; the application code stays unchanged.

Each deployment needs only a gateway URL, a restricted gateway key, and the alias. Both can point to the same gateway if networking and Sites runtime permissions allow.

## App environment (Zo AdonisJS instance)

Set the following **server-side only**:

```env
LITELLM_BASE_URL=https://your-private-gateway.example.com/v1
LITELLM_API_KEY=<restricted-gateway-virtual-key>
LITELLM_MODEL=agentic-cfo
```

Do **not** put a ChatGPT device-code token or LiteLLM master key into the CFO application's environment. Keep it only at the LiteLLM gateway.

The older `CFO_AI_*` settings remain a backward-compatible fallback when LiteLLM is not fully configured. When all LiteLLM values are set, they take precedence. With no configured model, the app continues using transparent local guided mode.

## ChatGPT Sites adapter

ChatGPT Sites supports hosted environment values/secrets in the Site settings, subject to the current runtime and workspace. The **future Sites-specific server adapter**, not its public browser, should read `LITELLM_BASE_URL`, `LITELLM_API_KEY` and `LITELLM_MODEL`, and POST a Chat Completions request to the gateway.

For example, the backend request contract is:

```ts
await fetch(`${LITELLM_BASE_URL}/chat/completions`, {
  method: 'POST',
  headers: {
    authorization: `Bearer ${LITELLM_API_KEY}`,
    'content-type': 'application/json',
  },
  body: JSON.stringify({ model: LITELLM_MODEL, messages, tools }),
})
```

This is only an integration contract, not a claim that the AdonisJS app has already been ported to the Sites runtime. Sites' data storage/authentication would still need an adapter.

See: https://learn.chatgpt.com/docs/sites/managing-a-site

## Security and privacy

A LiteLLM gateway can receive user questions and financial snapshots. Use TLS, private virtual keys, appropriate retention settings and no raw financial data in gateway logs. Treat the upstream ChatGPT subscription authorization file as a sensitive credential with refresh capability. Limit access, rotate keys when needed, and verify the AI provider's data handling before sending real user finances.

The CFO's authoritative balances are calculated locally from SQLite. LiteLLM only selects the model; it never receives database credentials and cannot execute payments or edit transactions.

**Not yet verified:** OAuth eligibility with the specific account, the exact model's tool-call format, ChatGPT Sites backend connectivity, and a live Zo/CFO-to-gateway request.
