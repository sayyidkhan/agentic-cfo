# Initial Foundation Verification

Automated checks performed by GitHub Actions on 2026-10-27 12:26 UTC.

- **Generate app key:** PASS
- **Run migrations:** PASS
- **Typecheck and codegen:** PASS
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
  ✔ a working professional can build a budget and move through the financial workspace (1s)
❯ Already up to date
[ success ] Truncated tables successfully
  ✖ logged-in users only see their own bank and chat records (32s)
 ERRORS 

❯ Acorra browser journey / logged-in users only see their own bank and chat records

::error file=tests/browser/finance_journey.spec.ts,title=Acorra browser journey / logged-in users only see their own bank and chat records,line=81,column=62::locator.waitFor: Timeout 30000ms exceeded.%0ACall log:%0A  - waiting for getByRole('heading', { name: 'Meet Sandy.' }) to be visible%0A

[31mℹ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('heading', { name: 'Meet Sandy.' }) to be visible
[39m

 ⁃ at Object.executor [33m(tests/browser/finance_journey.spec.ts:81:62)[39m

   [2m75[22m [2m┃[22m      })
   [2m76[22m [2m┃[22m      [31mawait[0m browserContext[34m.[0m[35mloginAs[0m(bob)
   [2m77[22m [2m┃[22m      [31mconst[0m page [34m=[0m [31mawait[0m [35mvisit[0m([32m'/dashboard?view=wealth'[0m)
   [2m78[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByText[0m([32m'Bob everyday wallet'[0m)[34m.[0m[35mwaitFor[0m()
   [2m79[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByText[0m([32m'Alice only savings'[0m)[34m.[0m[35mwaitFor[0m({ state[34m:[0m [32m'detached'[0m })
   [2m80[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByRole[0m([32m'navigation'[0m[34m,[0m { name[34m:[0m [32m'Financial workspace'[0m })[34m.[0m[35mgetByRole[0m([32m'link'[0m[34m,[0m { name[34m:[0m [32m'Sandy'[0m })[34m.[0m[35mclick[0m()
 [41m❯ 81 ┃      await page.getByRole('heading', { name: 'Meet Sandy.' }).waitFor()[49m
   [2m82[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByText[0m([32m'Alice private chat token'[0m)[34m.[0m[35mwaitFor[0m({ state[34m:[0m [32m'detached'[0m })
   [2m83[22m [2m┃[22m    })
   [2m84[22m [2m┃[22m  })
   [2m85[22m [2m┃[22m  

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

- **Compiled Node server and SQLite smoke:** PASS
