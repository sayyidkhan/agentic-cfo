# Initial Foundation Verification

Automated checks performed by GitHub Actions on 2026-10-24 10:16 UTC.

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
[ info ] tuyau: created api client registry (./.adonisjs/client/registry) (1.17 ms)
[ success ] Codegen files generated
app/controllers/finance_controller.ts(107,7): error TS2353: Object literal may only specify known properties, and 'availableCashCents' does not exist in type '{ month: ScrollProp<never, false> | PagePropsEagerDataTypes<string> | MergeableProp<UnPackedPageProps<string>> | OnceProp<...>; ... 8 more ...; recentTransactions: ScrollProp<...> | ... 2 more ... | OnceProp<...>; }'.
\`\`\`
</details>

- **Unit tests:** PASS
- **Production build:** PASS
