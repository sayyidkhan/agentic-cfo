# Initial Foundation Verification

Automated checks performed by GitHub Actions on 2026-10-24 10:38 UTC.

- **Generate app key:** PASS
- **Run migrations:** PASS
- **Typecheck and codegen:** PASS
- **Unit tests:** FAIL

<details><summary>Unit tests logs</summary>

\`\`\`
> node ace test --suite=unit

c[ info ] loading hooks...
[ info ] generating indexes...
[ info ] codegen: created 6 file(s)
[ info ] booting application to run tests...

unit / CFO model integration (tests/unit/cfo_agent.spec.ts)
  ✖ uses a read-only tool result before generating final advice (5.47ms)
  ✔ does not expose errors returned by a provider (0.79ms)

unit / read-only CFO tools (tests/unit/cfo_tools.spec.ts)
  ✔ returns verified budget values, without mutating source (0.59ms)
  ✔ assesses a hypothetical purchase in integer cents (0.66ms)
  ✔ rejects unknown operations or invalid model-generated arguments (0.62ms)

unit / financial calculations (tests/unit/finance.spec.ts)
  ✔ transfers between owned accounts do not change net worth (0.74ms)
  ✔ loan principal repayment reduces cash and liability equally (0.21ms)
  ✔ spending decreases net worth and consumes budget (0.35ms)
  ✔ manual valuation is added to net worth (0.17ms)
  ✔ invalid amounts and unknown accounts are rejected (0.54ms)

unit / exact SGD parsing (tests/unit/money.spec.ts)
  ✔ converts dollars to integer cents (0.26ms)
  ✔ rejects negative, fractional cent and invalid inputs (0.41ms)
  ✔ formats money (4.02ms)

unit / financial planning (tests/unit/planning.spec.ts)
  ✔ tracks upcoming unpaid bills without posting transactions (0.54ms)
  ✔ alerts for projected shortfall and budget pressure (0.21ms)
  ✔ flags overdue savings goal, not completed goals (0.18ms)
  ✔ rejects unrealistic due day and invalid date (0.26ms)
 ERRORS 

❯ CFO model integration / uses a read-only tool result before generating final advice

[31mℹ AssertionError: expected '[{"role":"system","content":"You are …' to include '"availableCashCents":100000'[39m

 ⁃ at Assert.include [33m(node_modules/@japa/assert/build/index.js:233:19)[39m
 ⁃ at Object.executor [33m(tests/unit/cfo_agent.spec.ts:49:14)[39m

   [2m44[22m [2m┃[22m        [31mconst[0m text [34m=[0m [31mawait[0m [35mgenerateCfoReply[0m([{ role[34m:[0m [32m'user'[0m[34m,[0m content[34m:[0m [32m'How much cash do I have?'[0m }][34m,[0m snapshot)
   [2m45[22m [2m┃[22m        assert[34m.[0m[35minclude[0m(text[34m,[0m [32m'S$1,000.00'[0m)
   [2m46[22m [2m┃[22m        assert[34m.[0m[35mequal[0m(requests[34m.[0mlength[34m,[0m [33m2[0m)
   [2m47[22m [2m┃[22m        assert[34m.[0m[35mequal[0m(requests[[33m0[0m][34m.[0mtool_choice[34m,[0m [32m'required'[0m)
   [2m48[22m [2m┃[22m        assert[34m.[0m[35mequal[0m(requests[[33m1[0m][34m.[0mtool_choice[34m,[0m [32m'none'[0m)
 [41m❯ 49 ┃        assert.include(JSON.stringify(requests[1].messages), '"availableCashCents":100000')[49m
   [2m50[22m [2m┃[22m      } [31mfinally[0m {
   [2m51[22m [2m┃[22m        globalThis[34m.[0mfetch [34m=[0m originalFetch
   [2m52[22m [2m┃[22m        [31mif[0m (oldKey [34m===[0m [33mundefined[0m) [31mdelete[0m process[34m.[0menv[34m.[0m[33mCFO_AI_API_KEY[0m
   [2m53[22m [2m┃[22m        [31melse[0m process[34m.[0menv[34m.[0m[33mCFO_AI_API_KEY[0m [34m=[0m oldKey
   [2m54[22m [2m┃[22m        [31mif[0m (oldModel [34m===[0m [33mundefined[0m) [31mdelete[0m process[34m.[0menv[34m.[0m[33mCFO_AI_MODEL[0m

 ⁃ at async #wrapTestInTimeout [33m(node_modules/@japa/core/build/index.js:680:4)[39m
 ⁃ at async TestRunner.run [33m(node_modules/@japa/core/build/index.js:710:4)[39m
 ⁃ at async Test$1.exec [33m(node_modules/@japa/core/build/index.js:918:3)[39m
 ⁃ at async GroupRunner.run [33m(node_modules/@japa/core/build/index.js:259:4)[39m
 ⁃ at async Group$1.exec [33m(node_modules/@japa/core/build/index.js:354:3)[39m
 ⁃ at async SuiteRunner.run [33m(node_modules/@japa/core/build/index.js:1100:4)[39m
 ⁃ at async Suite$1.exec [33m(node_modules/@japa/core/build/index.js:1175:3)[39m
 ⁃ at async Runner$1.exec [33m(node_modules/@japa/core/build/index.js:427:4)[39m
[1/1]─

 FAILED 

Tests  16 passed, 1 failed (17)
 Time  34ms

::error file=tests/unit/cfo_agent.spec.ts,title=CFO model integration / uses a read-only tool result before generating final advice,line=49,column=14::expected '[{"role":"system","content":"You are …' to include '"availableCashCents":100000'
\`\`\`
</details>

- **Production build:** PASS
