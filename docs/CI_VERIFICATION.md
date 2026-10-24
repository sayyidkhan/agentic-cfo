# Initial Foundation Verification

Automated checks performed by GitHub Actions on 2026-10-24 14:31 UTC.

- **Generate app key:** PASS
- **Run migrations:** PASS
- **Typecheck and codegen:** PASS
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
 Time  31ms

::error file=tests/unit/guided_cfo.spec.ts,title=guided financial coach / returns tool-backed cash%2C not a guessed figure,line=41,column=12::expected 'You have $1,000.00 in recorded bank/c…' to include 'S$1,000.00'
\`\`\`
</details>

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
  ✔ logged-in users only see their own bank and chat records (480.66ms)
 ERRORS 

❯ Acorra browser journey / a working professional can build a budget and move through the financial workspace

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
 Time  32s

::error file=tests/browser/finance_journey.spec.ts,title=Acorra browser journey / a working professional can build a budget and move through the financial workspace,line=33,column=56::locator.selectOption: Timeout 30000ms exceeded.%0ACall log:%0A  - waiting for getByLabel('Category', { exact: true })%0A
\`\`\`
</details>

- **Compiled Node server and SQLite smoke:** PASS
