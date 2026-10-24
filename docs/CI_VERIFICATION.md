# Initial Foundation Verification

Automated checks performed by GitHub Actions on 2026-10-24 10:19 UTC.

- **Generate app key:** PASS
- **Run migrations:** PASS
- **Typecheck and codegen:** FAIL

<details><summary>Typecheck and codegen logs</summary>

\`\`\`

> agentic-cfo-starter@0.0.0 typecheck
> node ace codegen && tsc --noEmit && tsc --noEmit --project inertia/tsconfig.json

[ info ] loading hooks...
[ info ] generating indexes...
[ info ] codegen: created 6 file(s)
[ info ] tuyau: created api client registry (./.adonisjs/client/registry) (1.83 ms)
[ success ] Codegen files generated
app/controllers/finance_controller.ts(90,40): error TS2345: Argument of type '{ accounts: { id: any; name: any; kind: any; }[]; categories: { id: any; name: any; }[]; recentTransactions: { id: any; bookedOn: any; kind: any; amountCents: number; accountId: any; destinationAccountId: any; note: any; categoryId: any; }[]; ... 10 more ...; planning: { ...; }; }' is not assignable to parameter of type 'never'.
\`\`\`
</details>

- **Unit tests:** PASS
- **Production build:** PASS
