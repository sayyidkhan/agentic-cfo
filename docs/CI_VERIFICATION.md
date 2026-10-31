# Initial Foundation Verification

Automated checks performed by GitHub Actions on 2026-10-31 10:15 UTC.

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
  - waiting for getByRole('link', { name: /Get started/ })
[39m

 ⁃ at Object.executor [33m(tests/browser/finance_journey.spec.ts:21:59)[39m

   [2m16[22m [2m┃[22m        password[34m:[0m [32m'TestPassword123!'[0m[34m,[0m
   [2m17[22m [2m┃[22m      })
   [2m18[22m [2m┃[22m      [31mawait[0m browserContext[34m.[0m[35mloginAs[0m(user)
   [2m19[22m [2m┃[22m      [31mconst[0m page [34m=[0m [31mawait[0m [35mvisit[0m([32m'/dashboard'[0m)
   [2m20[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByRole[0m([32m'heading'[0m[34m,[0m { name[34m:[0m [32m'Overview'[0m[34m,[0m exact[34m:[0m [36mtrue[0m })[34m.[0m[35mwaitFor[0m()
 [41m❯ 21 ┃      await page.getByRole('link', { name: /Get started/ }).click()[49m
   [2m22[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByRole[0m([32m'heading'[0m[34m,[0m { name[34m:[0m [32m'Wealth'[0m[34m,[0m exact[34m:[0m [36mtrue[0m })[34m.[0m[35mwaitFor[0m()
   [2m23[22m [2m┃[22m  
   [2m24[22m [2m┃[22m      [90m// Create a real account using the React/Inertia form.
   [2m25[22m [2m┃[22m  [0m    [31mawait[0m page[34m.[0m[35mgetByLabel[0m([32m'Account name'[0m)[34m.[0m[35mfill[0m([32m'Everyday bank'[0m)
   [2m26[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByLabel[0m([32m'Opening balance (SGD)'[0m)[34m.[0m[35mfill[0m([32m'4000.00'[0m)

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
[1/2]─

❯ Acorra browser journey / logged-in users only see their own bank and chat records

::error file=tests/browser/finance_journey.spec.ts,title=Acorra browser journey / a working professional can build a budget and move through the financial workspace,line=21,column=59::locator.click: Timeout 30000ms exceeded.%0ACall log:%0A  - waiting for getByRole('link', { name: /Get started/ })%0A

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
[2/2]─

 FAILED 

Tests  2 failed (2)
 Time  1m
\`\`\`
</details>

- **Compiled Node server and SQLite smoke:** PASS
