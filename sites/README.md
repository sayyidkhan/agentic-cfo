# Acorra on ChatGPT Sites

This is an additive Cloudflare Worker adaptation of the existing application. The Adonis/Zo application is retained in the repository root. No Next.js, Docker, model API, bank API or paid AI dependency is added.

## Current public release: synthetic-data demo

All five original React views and the temporary Sandy avatar are reused through `src/bridge.tsx`. Original finance calculations, planning rules and guided coaching are imported from `app/services`, rather than reimplemented. Build aliases replace only Inertia navigation/forms and the runtime-specific shell. The premium Sites landing page and warm forest/ivory styling are additive.

Demo records and chat history live only in this browser tab's memory. Reloading resets the demo. There is no localStorage, cookie-based financial state or server-side demo record storage. Do not enter personal information. The sample balances are fictional and calculated by the same finance engine as the original app.

## Build and checks

From the repository root:

```sh
cd sites
npm ci
cd ..
npm run build:sites
npm run test:sites
```

The Worker is `dist/server/index.js`; `.openai/hosting.json` at the repository root is the canonical deployment configuration. `sites/.openai/hosting.json` is refreshed from it during build and supports local preview. The Worker contains the compiled React application and styles; no CDN scripts or secrets are needed. `sites/preview.mjs` is only a development server; `/__qa/mobile` creates a 390px iframe for responsive browser QA and is not a production route.

## Persistent account implementation and release lock

`src/server.ts` implements a server-only authenticated D1 workspace API. Owner identity comes exclusively from Sites' `oai-authenticated-user-id` dispatch header. Browser body/query user IDs are ignored. Missing identity returns 401. Same-origin mutation checks, action-level validation and optimistic revision checks apply to every write. SQL always binds the authenticated owner ID; all records and chat messages in a workspace belong to that owner.

D1 migration `drizzle/0000_financial_workspaces.sql` stores one aggregate financial ledger per owner with a revision. This permits atomic full-ledger validation and replacement without partial transfers or lost updates. Money inside the ledger is integer SGD cents, with safe-integer domain validation. A Sites D1 database is separate from the Zo SQLite database; no data was imported or synchronized.

`REAL_DATA_ENABLED` is hardcoded **false** in the shipped server. Even a signed-in caller receives 423 for personal storage. There is no environment-variable override. Automated API tests verify isolation with two simulated identities against a real in-memory SQLite database, but these do not establish that production dispatch strips forged identity headers or that two actual signed-in visitors remain isolated. The public build therefore cannot collect or persist real finances.

The UI is now connected to the protected workspace API behind that same server-side release gate. `workspace=personal` URLs preserve workspace selection across the five views; empty personal accounts never inherit demo records. Create/edit/delete and chat use server responses and exact revision checks, with explicit loading, signed-out, locked, unavailable and stale-write states. Refreshing after a conflict preserves form drafts. Session changes invalidate pending responses and clear cached personal state; an opaque hashed account scope is used only to detect browser identity changes, never for authorization.

`/account` provides native top-level sign-in/sign-out anchors and a fixed synthetic storage check. `/api/storage-check` accepts no financial/user content: it only creates, reads or removes a server-generated marker for the authenticated identity in the separate `storage_checks` table. This lets two real visitors check persistence without enabling personal finance entry.

Before a personal-data release: verify native sign-in and identity-header stripping on the actual public Site with two independent visitors; verify anonymous denial, record-ID tampering, chat isolation, cross-origin rejection and concurrent write conflict handling. Only then change the release lock in a reviewed source revision and repeat the connected UI tests. Do not treat the demo as a verified personal finance service.

## Product details

- Exact SGD input; income, expenses, internal transfers and liability repayments.
- Create/edit/delete transactions; categories and monthly budget upsert.
- Savings progress does not add to net worth; marking a bill paid does not post an expense.
- One current dated valuation per named item; case-insensitive duplicate prevention across accounts and valuations. Differently named duplicates remain a manual review responsibility, as in the original product.
- Sandy is read-only guided mode, not a generative AI model. No external inference, mutations, payments or trades.
- The original Adonis implementation and its database remain separate. Compiler exclusions isolate Sites code from the Adonis build; shared exact SGD formatting is now explicit and locale-independent. Existing route registries were regenerated.

## Local two-visitor browser QA

The development server offers `/__qa/visitors`, with disposable Alice/Bob/anonymous fixtures. These are **local test identities**, not evidence of ChatGPT authentication. It stores only synthetic test records in ignored `sites/.qa/preview.sqlite`, and locally enables the workspace API for those fixtures. The deployed Worker never imports this preview server, fixture route, cookie or database. The public real-data gate remains false.

Use `/__qa/mobile` for a 390px iframe viewport on the account screen. Local migrations are copied from the authoritative schema migrations into an ignored build-only preview bundle; request handlers never create database tables.

## Sandy’s state library

Settings (`/settings`) permanently includes the seven agreed states: Curious, Calm, Watchful, Concerned, Screaming, Celebrating and Relieved. `src/sandy_states.ts` is the shared reference catalogue of triggers, dialogue, tone and suggested actions. Each card opens a large temporary vector expression sketch. State-specific URLs retain the selected preview after refresh, and unknown state IDs fall back to Curious. Previews are silent and do not change financial records or enable automatic emotional reactions. Final mascot artwork remains deferred.

### Sandy’s rendered character artwork

The gallery and Sites avatars use seven consistent, original cinematic 3D-style character illustrations in `assets/sandy/`, with transparent WebP images served from same-origin versioned asset URLs. The artwork replaces the rejected primitive-mesh design. The old procedural rig is retained as an unused experiment and is not imported into the shipped client.

The selected illustration uses a calibrated 2D deformation rig (`src/sandy_motion.ts`) over the approved artwork. Each mood has an authored sequence with anticipation, a gesture, a hold, follow-through and a quiet rest. Head, tail, breathing and paw regions move together; feet remain anchored except for the two celebration hops. Floating-point displacement avoids subpixel stepping, exact head rotations preserve facial proportions, and the tail follows gestures after a short delay; eye shapes remain unchanged. The synthetic blink compression and eyelash overlay were removed because they made Sandy’s eyes twitch. A persistent Canvas 2D renderer samples the approved pixels with a calibrated displacement field. Images are decoded once and cached; each complete frame is painted offscreen and copied to the visible canvas without clearing it or changing any image URLs. This replaces the flickering SVG filter-image updates. Premultiplied-alpha interpolation prevents transparent fur edges from gaining coloured fringes. Celebration hops and the brief alarm reaction share the same timeline rather than competing with separate CSS loops. The renderer targets 30 fps. Pause/resume preserves the playhead; replay explicitly restarts it. This is articulated rendered artwork, not a skeletal 3D model. Pause/play is saved on this browser and replay restarts the reaction. System reduced-motion preferences suppress animation. Thumbnails remain still. Animation pauses offscreen/in background tabs, and larger chat/account avatars share the rig while small header avatars remain still. No WebGL, external asset host or inference service is required at runtime. The original vector illustration is retained as an image-error fallback.

Art direction, generation prompts and the asset inventory are recorded in `../docs/SANDY_ART_DIRECTION.md`. Automatic financial-state selection remains disabled.
