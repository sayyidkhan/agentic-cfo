# Initial Foundation Verification

Automated checks performed by GitHub Actions on 2026-10-25 09:34 UTC.

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
[ info ] tuyau: created api client registry (./.adonisjs/client/registry) (16 ms)
[ success ] Codegen files generated
sites/src/Layout.tsx(2,28): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './bridge.js'?
sites/src/Layout.tsx(3,25): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean '../../inertia/components/sandy_avatar.js'?
sites/src/bridge.tsx(5,66): error TS7006: Parameter 'e' implicitly has an 'any' type.
sites/src/bridge.tsx(5,69): error TS2304: Cannot find name 'alert'.
sites/src/bridge.tsx(5,134): error TS7006: Parameter 'e' implicitly has an 'any' type.
sites/src/bridge.tsx(5,137): error TS2304: Cannot find name 'alert'.
sites/src/bridge.tsx(7,50): error TS2584: Cannot find name 'document'. Do you need to change your target library? Try changing the 'lib' compiler option to include 'dom'.
sites/src/bridge.tsx(12,236): error TS2554: Expected 0 arguments, but got 1.
sites/src/bridge.tsx(12,344): error TS2339: Property 'reset' does not exist on type 'EventTarget & HTMLFormElement'.
sites/src/client.tsx(3,23): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean '../../inertia/pages/dashboard.js'?
sites/src/client.tsx(4,18): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean '../../inertia/pages/cfo-chat.js'?
sites/src/client.tsx(5,25): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean '../../inertia/components/sandy_avatar.js'?
sites/src/client.tsx(6,20): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './Layout.js'?
sites/src/client.tsx(7,36): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './bridge.js'?
sites/src/client.tsx(8,60): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './domain.js'?
sites/src/client.tsx(11,83): error TS2304: Cannot find name 'location'.
sites/src/client.tsx(11,101): error TS2304: Cannot find name 'location'.
sites/src/client.tsx(11,119): error TS6133: 'error' is declared but its value is never read.
sites/src/client.tsx(12,27): error TS2304: Cannot find name 'history'.
sites/src/client.tsx(12,85): error TS2304: Cannot find name 'window'.
sites/src/client.tsx(13,38): error TS2304: Cannot find name 'location'.
sites/src/client.tsx(13,56): error TS2304: Cannot find name 'location'.
sites/src/client.tsx(13,73): error TS2304: Cannot find name 'window'.
sites/src/client.tsx(13,123): error TS2304: Cannot find name 'window'.
sites/src/client.tsx(17,77): error TS2304: Cannot find name 'confirm'.
sites/src/client.tsx(24,318): error TS2304: Cannot find name 'location'.
sites/src/client.tsx(25,12): error TS2584: Cannot find name 'document'. Do you need to change your target library? Try changing the 'lib' compiler option to include 'dom'.
sites/src/domain.ts(20,45): error TS7006: Parameter 't' implicitly has an 'any' type.
sites/src/domain.ts(20,104): error TS7006: Parameter 'c' implicitly has an 'any' type.
sites/src/domain.ts(24,173): error TS7006: Parameter 'c' implicitly has an 'any' type.
sites/src/domain.ts(27,39): error TS7006: Parameter 'a' implicitly has an 'any' type.
sites/src/domain.ts(28,260): error TS7006: Parameter 'c' implicitly has an 'any' type.
sites/src/domain.ts(42,24): error TS7006: Parameter 'm' implicitly has an 'any' type.
sites/src/server.ts(1,20): error TS2307: Cannot find module './generated-client.js.txt' or its corresponding type declarations.
sites/src/server.ts(2,17): error TS2307: Cannot find module './generated-style.css.txt' or its corresponding type declarations.
sites/src/server.ts(3,38): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './domain.js'?
\`\`\`
</details>

- **Unit tests:** FAIL

<details><summary>Unit tests logs</summary>

\`\`\`
[2/4]─

❯ guided financial coach / does not add savings goals to wealth balances

::error file=tests/unit/guided_cfo.spec.ts,title=guided financial coach / uses category budgets from computed records,line=25,column=12::expected 'Dining: $425.00 of $500.00 used (85%25)…' to include 'S$425.00'

[31mℹ AssertionError: expected 'Emergency fund: $300.00 saved toward …' to include 'S$300.00'[39m

 ⁃ at Assert.include [33m(node_modules/@japa/assert/build/index.js:233:19)[39m
 ⁃ at Object.executor [33m(tests/unit/guided_cfo.spec.ts:30:12)[39m

   [2m25[22m [2m┃[22m      assert[34m.[0m[35minclude[0m(output[34m,[0m [32m'S$425.00'[0m)
   [2m26[22m [2m┃[22m      assert[34m.[0m[35minclude[0m(output[34m,[0m [32m'85%'[0m)
   [2m27[22m [2m┃[22m    })
   [2m28[22m [2m┃[22m    [35mtest[0m([32m'does not add savings goals to wealth balances'[0m[34m,[0m ({ assert }) [31m=>[0m {
   [2m29[22m [2m┃[22m      [31mconst[0m output [34m=[0m [35mguidedCfoReply[0m([32m'How are my savings goals?'[0m[34m,[0m user)
 [41m❯ 30 ┃      assert.include(output, 'S$300.00')[49m
   [2m31[22m [2m┃[22m      assert[34m.[0m[35minclude[0m(output[34m,[0m [32m'not be counted as extra net worth'[0m)
   [2m32[22m [2m┃[22m    })
   [2m33[22m [2m┃[22m    [35mtest[0m([32m'prompts onboarding when no recorded money exists'[0m[34m,[0m ({ assert }) [31m=>[0m {
   [2m34[22m [2m┃[22m      [31mconst[0m output [34m=[0m [35mguidedCfoReply[0m([32m'What is my net worth?'[0m[34m,[0m {
   [2m35[22m [2m┃[22m        [34m...[0muser[34m,[0m accountsRecorded[34m:[0m [33m0[0m[34m,[0m valuations[34m:[0m [][34m,[0m

 ⁃ at #runTest [33m(node_modules/@japa/core/build/index.js:634:121)[39m
 ⁃ at #wrapRegressionTest [33m(node_modules/@japa/core/build/index.js:670:118)[39m
 ⁃ at #wrapTestInTimeout [33m(node_modules/@japa/core/build/index.js:680:102)[39m
 ⁃ at #wrapTestInRetries [33m(node_modules/@japa/core/build/index.js:686:66)[39m
 ⁃ at TestRunner.run [33m(node_modules/@japa/core/build/index.js:710:33)[39m
 ⁃ at async Test$1.exec [33m(node_modules/@japa/core/build/index.js:918:3)[39m
 ⁃ at async GroupRunner.run [33m(node_modules/@japa/core/build/index.js:259:4)[39m
 ⁃ at async Group$1.exec [33m(node_modules/@japa/core/build/index.js:354:3)[39m
[3/4]─

❯ guided financial coach / returns tool-backed cash, not a guessed figure

::error file=tests/unit/guided_cfo.spec.ts,title=guided financial coach / does not add savings goals to wealth balances,line=30,column=12::expected 'Emergency fund: $300.00 saved toward …' to include 'S$300.00'

::error file=tests/unit/guided_cfo.spec.ts,title=guided financial coach / returns tool-backed cash%2C not a guessed figure,line=41,column=12::expected 'You have $1,000.00 in recorded bank/c…' to include 'S$1,000.00'

[31mℹ AssertionError: expected 'You have $1,000.00 in recorded bank/c…' to include 'S$1,000.00'[39m

 ⁃ at Assert.include [33m(node_modules/@japa/assert/build/index.js:233:19)[39m
 ⁃ at Object.executor [33m(tests/unit/guided_cfo.spec.ts:41:12)[39m

   [2m34[22m [2m┃[22m      [31mconst[0m output [34m=[0m [35mguidedCfoReply[0m([32m'What is my net worth?'[0m[34m,[0m {
   [2m35[22m [2m┃[22m        [34m...[0muser[34m,[0m accountsRecorded[34m:[0m [33m0[0m[34m,[0m valuations[34m:[0m [][34m,[0m
   [2m36[22m [2m┃[22m      })
   [2m37[22m [2m┃[22m      assert[34m.[0m[35minclude[0m(output[34m,[0m [32m'do not have any financial accounts'[0m)
   [2m38[22m [2m┃[22m    })
   [2m39[22m [2m┃[22m    [35mtest[0m([32m'returns tool-backed cash, not a guessed figure'[0m[34m,[0m ({ assert }) [31m=>[0m {
   [2m40[22m [2m┃[22m      [31mconst[0m output [34m=[0m [35mguidedCfoReply[0m([32m'What is my bank balance?'[0m[34m,[0m user)
 [41m❯ 41 ┃      assert.include(output, 'S$1,000.00')[49m
   [2m42[22m [2m┃[22m    })
   [2m43[22m [2m┃[22m  })
   [2m44[22m [2m┃[22m  

 ⁃ at #runTest [33m(node_modules/@japa/core/build/index.js:634:121)[39m
 ⁃ at #wrapRegressionTest [33m(node_modules/@japa/core/build/index.js:670:118)[39m
 ⁃ at #wrapTestInTimeout [33m(node_modules/@japa/core/build/index.js:680:102)[39m
 ⁃ at #wrapTestInRetries [33m(node_modules/@japa/core/build/index.js:686:66)[39m
 ⁃ at TestRunner.run [33m(node_modules/@japa/core/build/index.js:710:33)[39m
 ⁃ at async Test$1.exec [33m(node_modules/@japa/core/build/index.js:918:3)[39m
 ⁃ at async GroupRunner.run [33m(node_modules/@japa/core/build/index.js:259:4)[39m
 ⁃ at async Group$1.exec [33m(node_modules/@japa/core/build/index.js:354:3)[39m
[4/4]─

 FAILED 

Tests  18 passed, 4 failed (22)
 Time  30ms
\`\`\`
</details>

- **Authenticated-route smoke tests:** PASS
- **Production build:** FAIL

<details><summary>Production build logs</summary>

\`\`\`
[ info ] building assets with vite
[36mvite v8.3.5 [32mbuilding client environment for production...[36m[39m
transforming...
✓ 2526 modules transformed.
rendering chunks...
computing gzip size...
public/assets/.vite/manifest.json         4.06 kB │ gzip:   0.68 kB
public/assets/app-BFrQXqT6.css           33.27 kB │ gzip:   7.43 kB
public/assets/shield-check-CEOfpmCe.js    0.35 kB │ gzip:   0.27 kB
public/assets/logo-D4Pb-y8n.js            0.50 kB │ gzip:   0.31 kB
public/assets/trending-up-pXbC0yAu.js     0.57 kB │ gzip:   0.35 kB
public/assets/not_found-CPXQwb4E.js       0.70 kB │ gzip:   0.37 kB
public/assets/server_error-i0wzGn4H.js    0.73 kB │ gzip:   0.38 kB
public/assets/sandy_avatar-Be7SKGAm.js    0.80 kB │ gzip:   0.50 kB
public/assets/marketing-DJ7ltRW5.js       0.82 kB │ gzip:   0.38 kB
public/assets/auth-ChFEeJRo.js            1.07 kB │ gzip:   0.50 kB
public/assets/login-PKuycYk1.js           1.59 kB │ gzip:   0.66 kB
public/assets/signup-BTWklEHa.js          2.48 kB │ gzip:   0.76 kB
public/assets/home-Ca4DFsWC.js            3.43 kB │ gzip:   1.33 kB
public/assets/page-C-zZFB1I.js            4.39 kB │ gzip:   1.64 kB
public/assets/cfo-chat-Bk4T2Lsc.js        7.57 kB │ gzip:   2.98 kB
public/assets/dashboard-CESrrsbR.js      37.01 kB │ gzip:   8.32 kB
public/assets/theme_toggle--TPEg7E2.js   38.92 kB │ gzip:  11.49 kB
public/assets/app-DThTkyoD.js           378.52 kB │ gzip: 118.39 kB

[32m✓ built in 221ms[39m
[ info ] compiling typescript source (tsc)
sites/src/Layout.tsx(2,28): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './bridge.js'?
sites/src/Layout.tsx(3,25): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean '../../inertia/components/sandy_avatar.js'?
sites/src/bridge.tsx(5,66): error TS7006: Parameter 'e' implicitly has an 'any' type.
sites/src/bridge.tsx(5,69): error TS2304: Cannot find name 'alert'.
sites/src/bridge.tsx(5,134): error TS7006: Parameter 'e' implicitly has an 'any' type.
sites/src/bridge.tsx(5,137): error TS2304: Cannot find name 'alert'.
sites/src/bridge.tsx(7,50): error TS2584: Cannot find name 'document'. Do you need to change your target library? Try changing the 'lib' compiler option to include 'dom'.
sites/src/bridge.tsx(12,236): error TS2554: Expected 0 arguments, but got 1.
sites/src/bridge.tsx(12,344): error TS2339: Property 'reset' does not exist on type 'EventTarget & HTMLFormElement'.
sites/src/client.tsx(3,23): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean '../../inertia/pages/dashboard.js'?
sites/src/client.tsx(4,18): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean '../../inertia/pages/cfo-chat.js'?
sites/src/client.tsx(5,25): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean '../../inertia/components/sandy_avatar.js'?
sites/src/client.tsx(6,20): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './Layout.js'?
sites/src/client.tsx(7,36): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './bridge.js'?
sites/src/client.tsx(8,60): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './domain.js'?
sites/src/client.tsx(11,83): error TS2304: Cannot find name 'location'.
sites/src/client.tsx(11,101): error TS2304: Cannot find name 'location'.
sites/src/client.tsx(11,119): error TS6133: 'error' is declared but its value is never read.
sites/src/client.tsx(12,27): error TS2304: Cannot find name 'history'.
sites/src/client.tsx(12,85): error TS2304: Cannot find name 'window'.
sites/src/client.tsx(13,38): error TS2304: Cannot find name 'location'.
sites/src/client.tsx(13,56): error TS2304: Cannot find name 'location'.
sites/src/client.tsx(13,73): error TS2304: Cannot find name 'window'.
sites/src/client.tsx(13,123): error TS2304: Cannot find name 'window'.
sites/src/client.tsx(17,77): error TS2304: Cannot find name 'confirm'.
sites/src/client.tsx(24,318): error TS2304: Cannot find name 'location'.
sites/src/client.tsx(25,12): error TS2584: Cannot find name 'document'. Do you need to change your target library? Try changing the 'lib' compiler option to include 'dom'.
sites/src/domain.ts(20,45): error TS7006: Parameter 't' implicitly has an 'any' type.
sites/src/domain.ts(20,104): error TS7006: Parameter 'c' implicitly has an 'any' type.
sites/src/domain.ts(24,173): error TS7006: Parameter 'c' implicitly has an 'any' type.
sites/src/domain.ts(27,39): error TS7006: Parameter 'a' implicitly has an 'any' type.
sites/src/domain.ts(28,260): error TS7006: Parameter 'c' implicitly has an 'any' type.
sites/src/domain.ts(42,24): error TS7006: Parameter 'm' implicitly has an 'any' type.
sites/src/server.ts(1,20): error TS2307: Cannot find module './generated-client.js.txt' or its corresponding type declarations.
sites/src/server.ts(2,17): error TS2307: Cannot find module './generated-style.css.txt' or its corresponding type declarations.
sites/src/server.ts(3,38): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './domain.js'?
[ info ] created ace file (build/ace.js)
╭─────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                             │
│    Cannot complete the build process as there are TypeScript errors.                        │
│    Use "--ignore-ts-errors" flag to ignore TypeScript errors and continue the build.        │
│                                                                                             │
╰─────────────────────────────────────────────────────────────────────────────────────────────╯
\`\`\`
</details>

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
  ✖ a working professional can build a budget and move through the financial workspace (32s)
❯ Already up to date
[ success ] Truncated tables successfully
  ✔ logged-in users only see their own bank and chat records (878.79ms)
 ERRORS 

❯ Acorra browser journey / a working professional can build a budget and move through the financial workspace

::error file=tests/browser/finance_journey.spec.ts,title=Acorra browser journey / a working professional can build a budget and move through the financial workspace,line=33,column=56::locator.selectOption: Timeout 30000ms exceeded.%0ACall log:%0A  - waiting for getByLabel('Category', { exact: true })%0A

[31mℹ TimeoutError: locator.selectOption: Timeout 30000ms exceeded.
Call log:
  - waiting for getByLabel('Category', { exact: true })
[39m

 ⁃ at Object.executor [33m(tests/browser/finance_journey.spec.ts:33:56)[39m

   [2m28[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByText[0m([32m'Everyday bank'[0m)[34m.[0m[35mfirst[0m()[34m.[0m[35mwaitFor[0m()
   [2m29[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByRole[0m([32m'link'[0m[34m,[0m { name[34m:[0m [34m/Budgets & goals/[0m })[34m.[0m[35mclick[0m()
   [2m30[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByRole[0m([32m'heading'[0m[34m,[0m { name[34m:[0m [32m'Spend with intention.'[0m })[34m.[0m[35mwaitFor[0m()
   [2m31[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByLabel[0m([32m'New category'[0m)[34m.[0m[35mfill[0m([32m'Dining'[0m)
   [2m32[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByRole[0m([32m'button'[0m[34m,[0m { name[34m:[0m [32m'Add category'[0m })[34m.[0m[35mclick[0m()
 [41m❯ 33 ┃      await page.getByLabel('Category', { exact: true }).selectOption({ label: 'Dining' })[49m
   [2m34[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByLabel[0m([32m'Monthly limit (SGD)'[0m)[34m.[0m[35mfill[0m([32m'500.00'[0m)
   [2m35[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByRole[0m([32m'button'[0m[34m,[0m { name[34m:[0m [32m'Save monthly budget'[0m })[34m.[0m[35mclick[0m()
   [2m36[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByText[0m([32m'Dining'[0m)[34m.[0m[35mfirst[0m()[34m.[0m[35mwaitFor[0m()
   [2m37[22m [2m┃[22m  
   [2m38[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByRole[0m([32m'link'[0m[34m,[0m { name[34m:[0m [34m/Transactions/[0m })[34m.[0m[35mclick[0m()

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
 Time  33s
\`\`\`
</details>

- **Compiled Node server and SQLite smoke:** FAIL

<details><summary>Compiled Node server and SQLite smoke logs</summary>

\`\`\`
\`\`\`
</details>

