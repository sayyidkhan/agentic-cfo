# Initial Foundation Verification

Automated checks performed by GitHub Actions on 2026-10-26 13:25 UTC.

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
[ info ] tuyau: created api client registry (./.adonisjs/client/registry) (8.99 ms)
[ success ] Codegen files generated
inertia/pages/dashboard.tsx(5,3): error TS6133: 'Activity' is declared but its value is never read.
inertia/pages/dashboard.tsx(5,38): error TS6133: 'ArrowUpRight' is declared but its value is never read.
inertia/pages/dashboard.tsx(5,52): error TS6133: 'CalendarClock' is declared but its value is never read.
inertia/pages/dashboard.tsx(6,3): error TS6133: 'ChevronRight' is declared but its value is never read.
inertia/pages/dashboard.tsx(6,17): error TS6133: 'CircleDollarSign' is declared but its value is never read.
inertia/pages/dashboard.tsx(6,35): error TS6133: 'Landmark' is declared but its value is never read.
inertia/pages/dashboard.tsx(6,51): error TS6133: 'ReceiptText' is declared but its value is never read.
inertia/pages/dashboard.tsx(7,16): error TS6133: 'TrendingDown' is declared but its value is never read.
inertia/pages/dashboard.tsx(7,30): error TS6133: 'TrendingUp' is declared but its value is never read.
inertia/pages/dashboard.tsx(103,10): error TS6133: 'StatCard' is declared but its value is never read.
\`\`\`
</details>

- **Unit tests:** PASS
- **Authenticated-route smoke tests:** PASS
- **Production build:** PASS
- **Install Chromium for browser tests:** PASS
- **Full browser journey and user isolation:** FAIL

<details><summary>Full browser journey and user isolation logs</summary>

\`\`\`
c[ info ] loading hooks...
[ info ] generating indexes...
[ info ] codegen: created 6 file(s)
[ info ] booting application to run tests...

browser / Acorra browser journey (tests/browser/finance_journey.spec.ts)
❯ Already up to date
[ success ] Truncated tables successfully
  ✖ a working professional can build a budget and move through the financial workspace (31s)
❯ Already up to date
[ success ] Truncated tables successfully
  ✔ logged-in users only see their own bank and chat records (619.27ms)
 ERRORS 

❯ Acorra browser journey / a working professional can build a budget and move through the financial workspace

[31mℹ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('heading', { name: 'Your money, in focus.' }) to be visible
[39m

 ⁃ at Object.executor [33m(tests/browser/finance_journey.spec.ts:20:72)[39m

   [2m15[22m [2m┃[22m        email[34m:[0m [32m'financial-journey@example.test'[0m[34m,[0m
   [2m16[22m [2m┃[22m        password[34m:[0m [32m'TestPassword123!'[0m[34m,[0m
   [2m17[22m [2m┃[22m      })
   [2m18[22m [2m┃[22m      [31mawait[0m browserContext[34m.[0m[35mloginAs[0m(user)
   [2m19[22m [2m┃[22m      [31mconst[0m page [34m=[0m [31mawait[0m [35mvisit[0m([32m'/dashboard'[0m)
 [41m❯ 20 ┃      await page.getByRole('heading', { name: 'Your money, in focus.' }).waitFor()[49m
   [2m21[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByRole[0m([32m'link'[0m[34m,[0m { name[34m:[0m [34m/Get started/[0m })[34m.[0m[35mclick[0m()
   [2m22[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByRole[0m([32m'heading'[0m[34m,[0m { name[34m:[0m [32m'Know what you own.'[0m })[34m.[0m[35mwaitFor[0m()
   [2m23[22m [2m┃[22m  
   [2m24[22m [2m┃[22m      [90m// Create a real account using the React/Inertia form.
   [2m25[22m [2m┃[22m  [0m    [31mawait[0m page[34m.[0m[35mgetByLabel[0m([32m'Account name'[0m)[34m.[0m[35mfill[0m([32m'Everyday bank'[0m)

 ⁃ at async #wrapTestInTimeout [33m(node_modules/@japa/core/build/index.js:680:4)[39m
 ⁃ at async TestRunner.run [33m(node_modules/@japa/core/build/index.js:710:4)[39m
 ⁃ at async Test$1.exec [33m(node_modules/@japa/core/build/index.js:918:3)[39m
 ⁃ at async GroupRunner.run [33m(node_modules/@japa/core/build/index.js:259:4)[39m
 ⁃ at async Group$1.exec [33m(node_modules/@japa/core/build/index.js:354:3)[39m
 ⁃ at async SuiteRunner.run [33m(node_modules/@japa/core/build/index.js:1100:4)[39m
 ⁃ at async Suite$1.exec [33m(node_modules/@japa/core/build/index.js:1175:3)[39m
 ⁃ at async Runner$1.exec [33m(node_modules/@japa/core/build/index.js:427:4)[39m
 ⁃ at async run [33m(node_modules/@japa/runner/build/index.js:213:3)[39m
 ⁃ at async TestRunnerProcess.run [33m(node_modules/@adonisjs/core/build/main-B2rXbPKm.js:158:3)[39m
[1/1]─

 FAILED 

Tests  1 passed, 1 failed (2)
 Time  31s

::error file=tests/browser/finance_journey.spec.ts,title=Acorra browser journey / a working professional can build a budget and move through the financial workspace,line=20,column=72::locator.waitFor: Timeout 30000ms exceeded.%0ACall log:%0A  - waiting for getByRole('heading', { name: 'Your money, in focus.' }) to be visible%0A
\`\`\`
</details>

- **Compiled Node server and SQLite smoke:** PASS
