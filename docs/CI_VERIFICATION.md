# Initial Foundation Verification

Automated checks performed by GitHub Actions on 2026-10-25 10:11 UTC.

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
  ✖ a working professional can build a budget and move through the financial workspace (1s)
❯ Already up to date
[ success ] Truncated tables successfully
  ✔ logged-in users only see their own bank and chat records (567.97ms)
 ERRORS 

❯ Acorra browser journey / a working professional can build a budget and move through the financial workspace

::error file=tests/browser/finance_journey.spec.ts,title=Acorra browser journey / a working professional can build a budget and move through the financial workspace,line=46,column=56::locator.click: Error: strict mode violation: getByRole('link', { name: /Overview/ }) resolved to 2 elements:%0A    1) <a href="/dashboard">…</a> aka getByRole('navigation', { name: 'Financial workspace' }).getByRole('link', { name: 'Overview' })%0A    2) <a href="/dashboard" class="cfo-action cfo-action--quiet">…</a> aka getByRole('main').getByRole('link', { name: 'Overview' })%0A%0ACall log:%0A  - waiting for getByRole('link', { name: /Overview/ })%0A

[31mℹ Error: locator.click: Error: strict mode violation: getByRole('link', { name: /Overview/ }) resolved to 2 elements:
    1) <a href="/dashboard">…</a> aka getByRole('navigation', { name: 'Financial workspace' }).getByRole('link', { name: 'Overview' })
    2) <a href="/dashboard" class="cfo-action cfo-action--quiet">…</a> aka getByRole('main').getByRole('link', { name: 'Overview' })

Call log:
  - waiting for getByRole('link', { name: /Overview/ })
[39m

 ⁃ at Object.executor [33m(tests/browser/finance_journey.spec.ts:46:56)[39m

   [2m41[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByRole[0m([32m'combobox'[0m[34m,[0m { name[34m:[0m [32m'From account'[0m[34m,[0m exact[34m:[0m [36mtrue[0m })[34m.[0m[35mselectOption[0m({ label[34m:[0m [32m'Everyday bank'[0m })
   [2m42[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByRole[0m([32m'combobox'[0m[34m,[0m { name[34m:[0m [32m'Category'[0m[34m,[0m exact[34m:[0m [36mtrue[0m })[34m.[0m[35mselectOption[0m({ label[34m:[0m [32m'Dining'[0m })
   [2m43[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByRole[0m([32m'button'[0m[34m,[0m { name[34m:[0m [32m'Save transaction'[0m })[34m.[0m[35mclick[0m()
   [2m44[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByText[0m([32m'S$425.00'[0m)[34m.[0m[35mfirst[0m()[34m.[0m[35mwaitFor[0m()
   [2m45[22m [2m┃[22m  
 [41m❯ 46 ┃      await page.getByRole('link', { name: /Overview/ }).click()[49m
   [2m47[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByRole[0m([32m'heading'[0m[34m,[0m { name[34m:[0m [32m'Your money, in focus.'[0m })[34m.[0m[35mwaitFor[0m()
   [2m48[22m [2m┃[22m      [31mawait[0m page[34m.[0m[35mgetByText[0m([32m'S$425.00'[0m)[34m.[0m[35mfirst[0m()[34m.[0m[35mwaitFor[0m()
   [2m49[22m [2m┃[22m  
   [2m50[22m [2m┃[22m      [90m// Screenshot contains synthetic data only; artifact available in Actions.
   [2m51[22m [2m┃[22m  [0m    [35mmkdirSync[0m([32m'artifacts'[0m[34m,[0m { recursive[34m:[0m [36mtrue[0m })

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
 Time  2s
\`\`\`
</details>

- **Compiled Node server and SQLite smoke:** PASS
