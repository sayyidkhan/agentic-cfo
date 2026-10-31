# Acorra — Product Requirements Document

**Version:** 2.0 · **Revised:** 31 October 2026
**Status:** Working product baseline for the next dashboard refinement; requirements are not proof of delivery.
**Audience:** Working professionals managing personal finances, initially in SGD.
**Product:** Your personal CFO. **Brand promise:** Grow your wealth, one habit at a time.
**Companion:** Sandy the Squirrel. **Primary challenge alignment:** UOB Theme 3.

## 1. Product purpose

Acorra helps working professionals understand their financial position, spot pressure early and choose a useful next step. It connects everyday transactions, monthly budgets, known bills, savings goals and estimated net worth in one personal workspace.

The product must answer five questions clearly:

1. What is my recorded financial position?
2. How is my spending tracking against my budget?
3. What bills or risks need attention next?
4. Am I progressing toward my savings goals?
5. What can I do about the numbers I am seeing?

Sandy turns the recorded figures into an understandable conversation. The longer-term ambition is a proactive personal CFO that recognises relevant changes and prepares useful recommendations. The current implementation uses deterministic calculations and credential-free guided rules; it is not a generative model or an autonomous financial operator.

### UOB challenge alignment

The source challenge statement is preserved in [uob-challenge-statements.md](uob-challenge-statements.md):

> How might we use AI to help individuals develop healthier financial habits by identifying needs early and providing timely, personalized guidance?

Acorra addresses this through early budget/bill warnings, explanations grounded in the user's records and direct links to the relevant next action. A polished dashboard alone does not satisfy the challenge: the user must understand what deserves attention and why.

## 2. Users, problems and boundaries

**Primary user:** A working professional with regular income, everyday spending, several accounts, recurring commitments and savings goals. They want a quick check-in rather than an accounting exercise.

**New-user problem:** The user does not know where to begin or whether cash, net worth and budget remaining mean the same thing.

**Returning-user problem:** The user needs to record something quickly, check whether the month is on track, and see what has changed or needs attention.

**Product boundaries:** Personal finances, manual records and SGD first. This is not a bank, brokerage, payment service, business accounting suite or investment-advice engine. An incomplete set of records must never be presented as a complete view of the user's finances.

## 3. Release reality versus intended product

| Area | Current Sites implementation | Requirement / remaining gap |
|---|---|---|
| Public access | Public landing page and interactive synthetic-data workspace | Keep demonstration mode clearly identifiable inside the workspace |
| Financial records | Public demo finances and chat live in tab memory and reset on reload | Real financial persistence stays locked until the production release gates pass |
| Personal workspace | Native identity integration and an authenticated D1 workspace API exist behind `REAL_DATA_ENABLED = false` | Verify actual production identity handling and two independent signed-in visitors before unlocking |
| Profile | Optional display name, avatar colour and private photo storage are implemented separately from finances | Clearly show signed-in state; never imply profile sign-in unlocks real financial records |
| Financial engine | Exact SGD cents, ledger replay, budgets, bills, goals and current net worth | Preserve calculations and existing working flows during UI refinement |
| Sandy | Read-only guided conversations and deterministic warnings | No claims of generative reasoning, background monitoring or autonomous actions |
| Net-worth history | Current balances and dated manual valuations | Historical snapshots and trend charts are not yet implemented |
| Accounts and planning | Transaction/valuation edit-delete and core creation/planning flows exist | Full account/category/budget management and richer planning remain follow-up work |
| Verification | 31 existing Sites tests passed at the latest engineering checkpoint; synthetic browser journeys performed | Local simulated-identity tests are not live production two-visitor verification |

The Sites app and the separate Adonis/Zo app share code but have independent persistence. Sites D1 and R2 do not synchronize with Zo SQLite. No private Zo data is to be imported as part of dashboard refinement.

## 4. Information architecture and ownership

Use one-word labels with distinct responsibilities. **Activity** is the agreed transaction destination; do not rename it Wallet in this revision.

| Destination | User question | Owns | Does not own |
|---|---|---|---|
| **Summary** | How am I doing, and what needs attention? | Financial synopsis, current net worth, cash, monthly income/spending, budget highlights, bills, goal progress and priority signals | Full transaction history or all planning forms |
| **Activity** | What money came in, went out or moved? | Income, expense and transfer entry; transaction history; edit/delete | A second copy of the Summary dashboard |
| **Sandy** | What do my figures mean, and what should I consider next? | Conversations, guided questions and explanations from financial tools | Automatic payments, trades or financial-record mutations |
| **Budget** | How do I organise this month's spending and saving? | Category limits, savings goals and recurring bills; Spending / Goals / Bills sections | A separate wealth dashboard |
| **Profile** | Which account am I using, and how do I personalise it? | Sign-in status, optional name/photo/avatar and sign-out; access to Settings on mobile | Budget health, storage diagnostics or financial totals |

**Supporting destinations:**

- **Summary → Net worth:** Account balances, asset/liability breakdown and dated manual valuations. There is no separate top-level Wealth tab. Legacy wealth URLs remain compatible.
- **Settings:** A preferences directory. **Companion → Sandy's expressions** contains the seven-state library and animation controls; **Demo data → Reset demo** contains the existing reset action. The expression gallery is not the Settings homepage.
- **Mobile/tablet:** Summary · Activity · Sandy · Budget · Profile. Sandy stays centred. Profile follows Budget; no duplicate top-right profile menu. Settings keeps Profile selected as its parent.
- **Desktop:** Sandy, Summary, Activity and Budget in the main sidebar; Profile, Settings and sign-in/out below a divider. The brand line remains at the bottom.

## 5. Core user journeys

### 5.1 First visit and first useful result

1. Landing page explains the personal-CFO benefit, with Sandy and the seasonal brand story.
2. Open app / Explore Acorra enters Summary through the branded transition.
3. In the public release, users explore synthetic records; personal financial entry remains locked.
4. For the eventual verified personal release, begin with a cash account and opening balance, then one monthly category budget and one expense. Assets, debts, bills and goals can be added progressively.
5. Summary shows the result and one useful next step. Do not require a complete wealth inventory before delivering value.

The transition is currently approximately 2.55 seconds. Respect reduced motion, handle interrupted navigation and slow loads, and keep internal tab changes immediate. Never claim that an animation represents bank synchronization or financial verification.

### 5.2 Daily check-in

Open Summary → understand the financial snapshot → identify the highest-priority signal → review its supporting figures → record an entry, review a bill/budget, or ask Sandy. Keep the next action close to the evidence.

### 5.3 Record and correct activity

Open Activity → choose income / expense / transfer → select the relevant account(s), category and date → submit → see exact updated figures. Edit/delete must recalculate all affected balances and planning results. Failed saves retain a useful draft and must not claim success.

### 5.4 Review wealth

Open the net-worth breakdown from Summary → inspect accounts, assets and debts → view valuation dates → update a manual valuation or record the relevant transaction. Savings-goal progress does not create another asset.

### 5.5 Plan and understand

Open Budget → manage Spending, Goals or Bills → return to Summary for the synopsis. A highlight must open the correct detail section directly. Ask Sandy to explain a warning using the same figures the user can inspect.

## 6. Summary dashboard requirements — next refinement

Summary is a decision surface, not a catalogue of features. Reuse the current domain calculations and data. Do not add new figures solely to fill a card.

### Required hierarchy

1. **Period and context:** Make the financial month explicit. Distinguish current net-worth/balance figures from selected-month flows; changing a month must not imply a historical net-worth snapshot exists.
2. **Financial snapshot:** Recorded cash, spending this month and estimated net worth. Keep all three in one row on mobile, scaling exact amounts to fit. Income remains visible alongside monthly spending.
3. **Budget pulse:** Highlight the categories closest to or over their limits, with spent / limit / remaining amounts. Show at most three initially, with access to all budgets.
4. **Sandy's next move:** One prioritised issue or grounded encouragement, its supporting amount/date, and a relevant action. Additional signals can be expanded.
5. **Upcoming bills:** Show the nearest unpaid commitments and overdue status. Link directly to Budget → Bills.
6. **Savings progress:** Show goals, saved versus target and target dates. Link directly to Budget → Goals.

On desktop, use the available width with an intentional main column and supporting column; do not create large empty side margins or stretch text across an unreadable width. On mobile, stack cards in the above reading order without a carousel hiding essential information.

### Actions and detail

- Keep Add entry, Budget and Ask Sandy as concise shortcuts; do not repeat them on every card.
- Cash and net-worth amounts must open their account/breakdown detail.
- Summary does not need a full transaction feed: Activity owns transaction history.
- Empty data calls for setup guidance, not reassuring financial-health claims.
- A net-worth or spending trend requires stored historical data. Do not draw invented history from a single current balance.

## 7. MVP functional requirements and acceptance

**P0** means preserve or complete before calling the core product ready. A requirement below is not a statement that its release gate has already passed.

| ID | Priority | Requirement | Acceptance criterion |
|---|---|---|---|
| SUM-01 | P0 | Summary provides a financial synopsis | All three snapshot figures match the shared calculation engine; budget, bill and goal highlights open their actual management/detail destinations |
| SUM-02 | P0 | Distinguish balance, wealth and budget | Labels never imply net worth or recorded cash is an amount available for discretionary spending |
| ACT-01 | P0 | Income, expense and transfer CRUD | Add/edit/delete updates the ledger and all affected totals; invalid dates, money and account references are rejected |
| ACT-02 | P0 | Clear transaction history | Each row exposes date, kind, account/category context and exact amount; transfer presentation avoids implying income or spending |
| BUD-01 | P0 | Monthly category limits | For each budget: remaining = limit minus eligible expenses in that category/month; overspending remains visible |
| BUD-02 | P0 | Recurring bills | Unpaid commitments, due dates and monthly reminder status are visible; marking paid does not silently create a transaction |
| BUD-03 | P0 | Savings goals | Saved, target, progress and date are clear; updating a goal does not alter cash or net worth |
| WEALTH-01 | P0 | Net-worth breakdown within Summary | Display accounts and manual assets/debts with correct asset-minus-liability arithmetic and valuation dates |
| WEALTH-02 | P0 | Avoid duplicate representations | Reject the existing same-name account/valuation duplicates; explain the manual limitation for differently named duplicates |
| SAN-01 | P0 | Read-only guided conversations | Answers cite the user's calculated values, handle incomplete records and perform no financial mutation |
| SAN-02 | P0 | Timely relevant signals | User activity or an explicit review recalculates meaningful warnings; each has evidence and a practical next step |
| SAN-03 | P0 | Revisit mascot states | All seven expressions remain accessible under Settings; previewing one changes neither records nor an automatic health classification |
| ACC-01 | P0 | Clear identity and optional personalisation | Signed-in badge is explicit; optional name/avatar/photo can be saved or removed within their existing scopes |
| ACC-02 | P0 | Private account ownership | Production sign-in, reads/writes and photos are owner-scoped; anonymous and cross-account attempts fail |
| UX-01 | P0 | Mobile-first, premium workspace | Five readable bottom destinations, safe-area padding, 44px touch targets, keyboard access and no horizontal overflow at 320px/390px |
| UX-02 | P0 | Truthful loading and errors | Loading releases to content or an actionable error; failed/stale saves never appear successful; animations respect reduced motion |

## 8. Financial definitions and integrity

All persisted and calculated monetary amounts use **safe integer SGD cents**. Formatting and animated counters are presentation only; final displayed amounts must be exact. Do not round away cents, truncate totals, or use a language model as the calculation source.

| Term | Definition / constraint |
|---|---|
| Recorded cash | Sum of balances in the current spendable cash/bank asset accounts. In the present engine, asset accounts are assumed spendable; noncash assets belong in manual valuations until explicit liquidity types exist. |
| Monthly income | Recorded income transactions booked in the selected month. Future salary is not cash already received. |
| Monthly spending | Recorded expense transactions booked in the selected month. Internal transfers and principal repayments are excluded. |
| Monthly net cash flow | Recorded monthly income minus recorded monthly expenses; not the same as the account balance. |
| Category budget remaining | Category limit minus that month's eligible expenses. A negative amount means overspending. |
| Cash after known unpaid bills | Recorded cash minus recorded unpaid commitments for the month, including overdue items. This excludes unknown/unrecorded spending and is not a guaranteed safe-to-spend balance. |
| Estimated net worth | Recorded asset account balances plus nonduplicated manual asset valuations, minus recorded liabilities. May be negative; manual values may be stale. |
| Goal progress | A planning amount toward a target. It is not added to assets or deducted from cash without a separate financial record. |

Additional rules:

- Transfers between owned cash accounts change neither income, spending nor net worth.
- Loan principal is a transfer from cash to the recorded liability, reducing both equally. Interest is a separate expense. Repayment cannot exceed the recorded principal owed.
- Validate the full affected ledger on edit/delete; reject inconsistent or unsafe results rather than storing partial changes.
- A zero budget must not produce division-by-zero or an infinite percentage; spending against it is still surfaced.
- Never count an account and a manual valuation of the same asset twice. Exact-name protection is implemented; robust identity/linking is a later improvement.
- Current manual valuations do not establish a historical time series. Retaining historical snapshots needs a separate model and migration.
- Current recurring commitments support due days 1–28. Do not advertise full calendar recurrence or automatic bill posting until implemented.
- Day/month boundaries should use the user's financial timezone, initially Asia/Singapore. Audit the current implementation before claiming this is fully enforced.
- Any new total must define inclusion, time basis and missing-data behaviour before appearing in Summary.

### Daily allowance and “left to spend”

Do not introduce an unexplained “safe to spend” figure in the next visual pass. Budget remaining, cash after known bills and net worth answer different questions.

A later daily **budget allowance** may divide a defined remaining discretionary budget by remaining days, including today. It needs explicit category coverage, current-month rules, treatment of commitments/reserves and negative budgets, and cent rounding tests. Suppress it for incomplete setup or historical periods. Do not treat all recorded cash, CPF or future income as disposable money, and do not subtract the same bill twice.

## 9. Sandy and the agentic CFO path

**MVP loop:** Observe recorded changes → calculate → detect a relevant condition → explain → suggest → let the user decide.

- Initial signals: category budget at/above the existing 80% threshold, overspending, known cash shortfalls, potentially overdue bills and overdue goals.
- Prioritise actionable risk over decorative scores. A cash shortfall should not be hidden behind routine encouragement; distinguish missing confirmation of bill payment from confirmed nonpayment.
- Explain what is known and what is missing. “Your recorded cash after known bills…” is preferable to claiming the user will run out of money.
- Sandy is encouraging and practical. Avoid shame, alarm fatigue or a panic expression for ordinary budget pressure.
- Curious, Calm, Watchful, Concerned, Screaming, Celebrating and Relieved remain the expression catalogue. Automatic state selection is a proposed enhancement, not current behaviour.
- Current checks run during user interaction/review. No scheduled monitoring, push alerts, streaming model response or external model call is promised by the MVP.

**Later agentic capability:** Remember acknowledged signals, detect meaningful changes, prepare a review and offer relevant next actions. Scheduled reviews/notifications require explicit cadence and opt-in. Any future generative explanation must use verified read-only financial tools, identify uncertainty and retain the deterministic source of truth. Paid model access or expanded financial write permissions requires separate approval; a ChatGPT subscription is not a backend API key.

## 10. Reference dashboard: what to learn and what to defer

**Reference:** [Vertical Institute Personal Finance Dashboard](https://abu-ops.github.io/vi-amp/dashboard.html#overview), overview inspected on 31 October 2026. The page showed example data. Its underlying calculations, other pages and security were not audited; its displayed claims are not verification of those properties.

| Observed pattern | Acorra decision |
|---|---|
| A clear monthly spending-versus-budget panel | Borrow the readable financial hierarchy and contextual remaining amount; preserve Acorra's cash/net-worth distinction |
| Net worth broken into understandable components | Provide a useful breakdown within Summary rather than another top-level tab |
| Goals show both progress and the gap to target | Keep saved/target/date explicit; contribution forecasts need defined calculations before adoption |
| Highlights link to accounts or planning detail | Adopt direct contextual navigation; avoid repeated dashboard cards across tabs |
| Month selection makes the reporting period obvious | A useful follow-up; it needs month-aware budgets, goals/bills context and honest current-versus-historical balance labels |
| CPF balances and loan payoff projections | Do not copy them as visual-only widgets. Manual noncash valuations can represent user-supplied assets; structured CPF views and amortisation forecasts need additional models/tests |
| AI prompt handoff | Keep Sandy as the in-app companion. Do not add a competing copy-paste-AI workflow or imply guided mode is generative |
| Local-device storage and onboarding banners | Do not copy its storage claims: Acorra's demo is tab-memory, profile data is account-persisted, and finance persistence is separately gated |

Retain Acorra's forest green, champagne gold, warm ivory and original squirrel identity. Borrow clarity and useful interactions rather than branding, artwork or unverified calculations.

## 11. Scope and sequencing

| Stage | Scope | Boundary |
|---|---|---|
| **Next: dashboard refinement** | Clearer Summary hierarchy, period labels, budget pressure, a prioritised Sandy next step, bills/goals and contextual links; preserve existing transactions and calculations | No new financial model, persistence unlock or navigation rename hidden inside a visual redesign |
| **Personal-data release gate** | Production native identity verification, two-visitor isolation, persistence/conflict/error tests and release review | A separate functional/security milestone; not satisfied by a premium UI or working profile |
| **P1 product improvements** | Account/category/budget management gaps, transaction search/filtering, month navigation, historical net-worth snapshots, explicit liquidity/asset types, goal contribution calculations and optional automatic mascot state rules | Proposed backlog; specify and validate each before implementation |
| **P2 CFO expansion** | Acknowledged-signal memory, explainable planning scenarios, opt-in scheduled reviews, carefully specified debt payoff/CPF views and optional generative explanations | Not part of the next dashboard pass; no paid AI or autonomous financial actions by implication |

**Out of scope:** Bank connections, automatic payments or trades, live market feeds, FX/multicurrency, receipt/email ingestion, SME accounting, arbitrary database/schema builders and multi-agent orchestration. Do not add Docker, LiteLLM, Next.js or unnecessary external services.

## 12. Persistence, privacy and runtime requirements

- GitHub remains the source of truth. Reuse existing working components and pure finance services; do not rebuild the app from scratch.
- Sites runs the existing Worker/React adaptation, with native supported identity, D1 financial/profile storage and private R2 photos. Original AdonisJS 7 / Inertia / Tuyau / Lucid / SQLite remains the separate Node/Zo implementation.
- Derive the owner from the authenticated server context, never a browser-supplied user ID. Apply ownership checks to every read, write, photo and conversation.
- Enforce input validation, same-origin mutations and revision/conflict handling; reject stale writes without losing user intent or inventing a successful save.
- Session changes must clear personal caches and invalidate pending responses. Frontend bundles must contain no credentials or private records.
- Profile sign-in and profile persistence are distinct from financial-workspace availability. Retain the visible synthetic-data notice until financial release is verified.
- Reset demo restores sample finances/chat; it must not remove private profile data or another account's records.

### Gate before enabling real financial data

1. Verify native sign-in/sign-out and production handling of spoofed identity headers.
2. Use two genuinely independent signed-in visitors; prove neither can read, mutate or select the other's accounts, valuations, goals, bills, messages or photos.
3. Verify anonymous denial, direct API/record tampering, cross-origin rejection, stale writes and identity changes.
4. Verify persistence after reload, error recovery and calculation parity using synthetic records.
5. Review secrets/bundle contents and document the actual production evidence.
6. Only then approve a reviewed source change that unlocks financial persistence. Keep the public synthetic demo if the evidence is unavailable.

## 13. Acceptance scenarios and product validation

### Deterministic scenarios

| Scenario | Required result |
|---|---|
| Synthetic baseline used by existing tests | Cash S$21,410.00; monthly income S$5,200.00; monthly expenses S$2,190.00; assets S$45,410.00 minus liabilities S$4,000.00 = net worth S$41,410.00 |
| Add a S$12.34 cash expense to that baseline | Expenses S$2,202.34; cash S$21,397.66; net worth S$41,397.66; matching category budget updates |
| Transfer S$100 between owned cash accounts | Individual balances change; total cash, income, spending and net worth do not |
| Record S$100 of principal repayment | Cash and recorded liability each decrease S$100; net worth and expense total remain unchanged |
| Known unpaid bills total S$275.00 at baseline | Cash after those bills is S$21,135.00, labelled as an estimate from known records |
| Mark a bill paid without recording an expense | Reminder state changes; cash and spending do not |
| Update goal saved amount | Progress changes; cash and net worth do not |
| User has incomplete or no records | Setup guidance and uncertainty are visible; no invented healthy state, forecast or trend |

### Usability targets for the next validation round

These are proposed acceptance targets, not measured results:

- At least 4 of 5 representative users choose the correct destination for a transaction, a budget change and a net-worth review without coaching.
- At least 4 of 5 correctly distinguish recorded cash, budget remaining and net worth after a Summary check-in.
- A new user can record the first expense within two minutes after basic account/budget setup.
- At least 4 of 5 can identify the highest-priority signal and reach its relevant action without searching other tabs.
- No horizontal overflow at 320px/390px; readable exact amounts, keyboard/screen-reader controls, reduced-motion support and accessible errors.
- Financial scenario tests pass with zero arithmetic discrepancies. Browser journeys cover entry/edit/delete, transfer, budget, bill, goal, valuation and Sandy explanation.

Actual usefulness of proactive guidance and continued manual record-keeping remain validation questions. Do not claim habit improvement or retention uplift without observation.

## 14. Decisions retained and next handoff

- Summary handles highlights and current net worth; Activity handles transactions; Budget replaces Plan.
- Net-worth/account detail remains under Summary. Sandy remains a distinct companion destination.
- Profile is the last mobile tab after Budget; Settings is a directory, with the squirrel-state library inside it.
- The next dashboard pass follows Sections 6–8 and preserves the release lock. This document update does not authorise its implementation or declare proposed backlog items delivered.
- The official UOB challenge transcription is unchanged. Earlier requirements that conflict with this revised product/navigation baseline are superseded; historical verification reports retain their original dates and evidence.

**Implementation evidence:** [WORKSPACE_DESIGN.md](WORKSPACE_DESIGN.md), [SITES_VERIFICATION.md](SITES_VERIFICATION.md), current source and tests.
**Runtime architecture:** [BUILD_PLAN.md](BUILD_PLAN.md), [SITES_COMPATIBILITY.md](SITES_COMPATIBILITY.md), [sites/README.md](../sites/README.md). Older architecture/status documents describe earlier milestones; this PRD does not silently upgrade their verification claims.
