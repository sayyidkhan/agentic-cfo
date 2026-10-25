# Acorra Sites verification — 25 October 2026

## Release decision

Publish the user-authorized fallback: a clearly labelled **public synthetic-data demo**, with all five finance areas interactive. Real financial-data entry/persistence remains locked. This is not a verified production personal-finance account service.

Sites provides native identity headers and D1. The deployment uses a Worker ESM bundle rather than attempting to run Adonis/Lucid/SQLite or introducing Next.js. Existing React dashboard/chat/planning/editor components, Sandy's temporary squirrel icon, finance calculations, money parsing, planning and guided financial tools are reused. The original Zo application is retained.

## Automated verification

`npm run build:sites` builds the production Worker and a test module from the same finance source graph. `npm run test:sites` passes eight test groups:

1. Deterministic synthetic cash, monthly income/expenses and net worth; internal-transfer neutrality; savings-goal exclusion from wealth.
2. Exact SGD cents, expense create/edit/delete and ledger replay; invalid precision, calendar dates and transfers; loan overpayment prevention and repayment neutrality.
3. Monthly budget replacement, overspending, cash shortfall and paid reminders without cash mutation.
4. Dated valuation editing/deletion and case-insensitive duplicate protection against accounts.
5. Sandy answers from computed figures, does not mutate financial records, and retains/clears session history.
6. Anonymous API denial and the immutable personal-storage release lock, including requests with pretend identity headers.
7. Two simulated identities against actual in-memory SQLite: read isolation, record-ID tampering, ignored body/query tenant selection, same-origin mutation checks, revision conflicts and owner deletion.
8. Built-bundle checks for common credential patterns and accidental external-provider configuration.

Tests use synthetic data only. They do not establish production dispatch header integrity or live identity isolation.

## Browser verification

Desktop cloud-browser walkthrough:

- Public landing and all five navigable finance views render.
- Add synthetic S$12.34 expense: monthly expenses change from S$2,190.00 to S$2,202.34.
- Edit to S$15.67: expenses become S$2,205.67. Delete: expenses restore to S$2,190.00.
- Replace Dining budget with S$400: S$20 overspend warning appears.
- Add S$50,000 monthly sample bill: known unpaid bills total S$50,275 and projected cash becomes -S$28,865, with a shortfall warning.
- Create a synthetic savings goal without changing net worth.
- Ask Sandy for net worth: S$41,410 = assets S$45,410 minus liabilities S$4,000.
- New save feedback is visible; create forms clear after success.

390px-wide browser iframe viewport (responsive-layout QA, not a physical mobile device):

- Landing and dashboard stack into readable single-column layouts; navigation scrolls horizontally.
- Transaction summary and entry area render at the narrow width.
- Blank onboarding starts without accounts or valuations.
- Create first synthetic bank account at S$100.01; displayed cash and net worth match exactly.
- Attempt a same-name valuation: a visible validation error prevents double counting.
- Month pills adjusted to avoid wrapping.

## Security and remaining gate

The shipped `REAL_DATA_ENABLED = false` is server-side and cannot be overridden through browser input or an environment variable. The public UI uses only tab-memory synthetic state and never calls the personal workspace API. Reloading discards changes and chat. No real financial database or credentials are bundled. No external model is called. Personal records and chat are not sent to a server by the demo.

The authenticated D1 API supports server-derived tenant ownership, complete action validation, atomic revision-guarded workspace writes and same-origin mutations. D1 is separately provisioned; Zo SQLite remains separate and unsynchronized.

**Unverified:** actual native sign-in, production removal of forged identity headers, and two independent signed-in visitors accessing their own persisted records. No independent second visitor identity is available in this execution. Therefore the fallback is mandatory under the launch brief. The personal-data UI/API integration and live identity checks must be completed before a reviewed source change unlocks personal storage.

Exact-name duplicate checking cannot detect differently named representations of the same asset. Manual valuations are not live market prices. Bills and goals are planning records, not payments or additional assets. Sandy is rules-based guided mode, not a generative model or a financial adviser.
