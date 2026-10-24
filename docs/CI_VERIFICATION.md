# Initial Foundation Verification

Automated checks performed by GitHub Actions on 2026-10-24 11:12 UTC.

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
[ info ] tuyau: created api client registry (./.adonisjs/client/registry) (1.99 ms)
[ success ] Codegen files generated
tests/browser/finance_journey.spec.ts(54,53): error TS2584: Cannot find name 'document'. Do you need to change your target library? Try changing the 'lib' compiler option to include 'dom'.
\`\`\`
</details>

- **Unit tests:** FAIL

<details><summary>Unit tests logs</summary>

\`\`\`

unit / read-only CFO tools (tests/unit/cfo_tools.spec.ts)
  ✔ returns verified budget values, without mutating source (0.61ms)
  ✔ assesses a hypothetical purchase in integer cents (0.62ms)
  ✔ rejects unknown operations or invalid model-generated arguments (0.75ms)

unit / financial calculations (tests/unit/finance.spec.ts)
  ✔ transfers between owned accounts do not change net worth (0.75ms)
  ✔ loan principal repayment reduces cash and liability equally (0.25ms)
  ✔ spending decreases net worth and consumes budget (0.37ms)
  ✔ manual valuation is added to net worth (0.22ms)
  ✔ invalid amounts and unknown accounts are rejected (0.68ms)

unit / exact SGD parsing (tests/unit/money.spec.ts)
  ✔ converts dollars to integer cents (0.26ms)
  ✔ rejects negative, fractional cent and invalid inputs (0.54ms)
  ✔ formats money (3.92ms)

unit / financial planning (tests/unit/planning.spec.ts)
  ✔ tracks upcoming unpaid bills without posting transactions (0.54ms)
  ✔ alerts for projected shortfall and budget pressure (0.2ms)
  ✔ flags overdue savings goal, not completed goals (0.16ms)
  ✔ rejects unrealistic due day and invalid date (0.38ms)

functional / financial workspace access (tests/functional/financial_workspace_access.spec.ts)
  ✔ requires authentication for overview, finance views and CFO conversation (246.81ms)
 ERRORS 

❯ browser: Setup hook

[31mℹ Error: browserType.launch: Executable doesn't exist at /home/runner/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell
╔════════════════════════════════════════════════════════════╗
║ Looks like Playwright was just installed or updated.       ║
║ Please run the following command to download new browsers: ║
║                                                            ║
║     npx playwright install                                 ║
║                                                            ║
║ <3 Playwright Team                                         ║
╚════════════════════════════════════════════════════════════╝[39m

 ⁃ at chromium [33m(node_modules/@japa/browser-client/build/index.js:17:42)[39m

   [2m12[22m [2m┃[22m  		[31mthis[0m[34m.[0mcontext [34m=[0m context;
   [2m13[22m [2m┃[22m  	}
   [2m14[22m [2m┃[22m  };
   [2m15[22m [2m┃[22m  [31mvar[0m debug_default [34m=[0m [35mdebuglog[0m([32m"japa:browser-client"[0m);
   [2m16[22m [2m┃[22m  [31mconst[0m [33mDEFAULT_LAUNCHERS[0m [34m=[0m {
 [41m❯ 17 ┃  	chromium: (launcherOptions) => chromium.launch(launcherOptions),[49m
   [2m18[22m [2m┃[22m  	firefox[34m:[0m (launcherOptions) [31m=>[0m firefox[34m.[0m[35mlaunch[0m(launcherOptions)[34m,[0m
   [2m19[22m [2m┃[22m  	webkit[34m:[0m (launcherOptions) [31m=>[0m webkit[34m.[0m[35mlaunch[0m(launcherOptions)
   [2m20[22m [2m┃[22m  };
   [2m21[22m [2m┃[22m  [31mconst[0m [33mDEFAULT_ASSERTIONS_CONFIG[0m [34m=[0m {
   [2m22[22m [2m┃[22m  	timeout[34m:[0m [33m5e3[0m[34m,[0m

 ⁃ at Object.launcher [33m(node_modules/@japa/browser-client/build/index.js:46:11)[39m
 ⁃ [33m(node_modules/@japa/browser-client/build/index.js:574:55)[39m
 ⁃ at #exec [33m(node_modules/@poppinss/hooks/build/index.js:115:63)[39m
 ⁃ at Runner.run [33m(node_modules/@poppinss/hooks/build/index.js:137:22)[39m
 ⁃ at #runSetupHooks [33m(node_modules/@japa/core/build/index.js:1039:28)[39m
 ⁃ at SuiteRunner.run [33m(node_modules/@japa/core/build/index.js:1091:28)[39m
 ⁃ at Suite$1.exec [33m(node_modules/@japa/core/build/index.js:1175:16)[39m
 ⁃ at Runner$1.exec [33m(node_modules/@japa/core/build/index.js:427:16)[39m
 ⁃ at async run [33m(node_modules/@japa/runner/build/index.js:213:3)[39m
 ⁃ at async TestRunnerProcess.run [33m(node_modules/@adonisjs/core/build/main-B2rXbPKm.js:158:3)[39m
[1/1]─

 FAILED 

Tests  18 passed (18)
 Time  303ms
\`\`\`
</details>

- **Authenticated-route smoke tests:** FAIL

<details><summary>Authenticated-route smoke tests logs</summary>

\`\`\`

unit / read-only CFO tools (tests/unit/cfo_tools.spec.ts)
  ✔ returns verified budget values, without mutating source (0.65ms)
  ✔ assesses a hypothetical purchase in integer cents (0.62ms)
  ✔ rejects unknown operations or invalid model-generated arguments (0.7ms)

unit / financial calculations (tests/unit/finance.spec.ts)
  ✔ transfers between owned accounts do not change net worth (0.72ms)
  ✔ loan principal repayment reduces cash and liability equally (0.2ms)
  ✔ spending decreases net worth and consumes budget (0.39ms)
  ✔ manual valuation is added to net worth (0.19ms)
  ✔ invalid amounts and unknown accounts are rejected (0.64ms)

unit / exact SGD parsing (tests/unit/money.spec.ts)
  ✔ converts dollars to integer cents (0.27ms)
  ✔ rejects negative, fractional cent and invalid inputs (0.5ms)
  ✔ formats money (3.85ms)

unit / financial planning (tests/unit/planning.spec.ts)
  ✔ tracks upcoming unpaid bills without posting transactions (0.51ms)
  ✔ alerts for projected shortfall and budget pressure (0.21ms)
  ✔ flags overdue savings goal, not completed goals (0.17ms)
  ✔ rejects unrealistic due day and invalid date (0.3ms)

functional / financial workspace access (tests/functional/financial_workspace_access.spec.ts)
  ✔ requires authentication for overview, finance views and CFO conversation (251.41ms)
 ERRORS 

❯ browser: Setup hook

[31mℹ Error: browserType.launch: Executable doesn't exist at /home/runner/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell
╔════════════════════════════════════════════════════════════╗
║ Looks like Playwright was just installed or updated.       ║
║ Please run the following command to download new browsers: ║
║                                                            ║
║     npx playwright install                                 ║
║                                                            ║
║ <3 Playwright Team                                         ║
╚════════════════════════════════════════════════════════════╝[39m

 ⁃ at chromium [33m(node_modules/@japa/browser-client/build/index.js:17:42)[39m

   [2m12[22m [2m┃[22m  		[31mthis[0m[34m.[0mcontext [34m=[0m context;
   [2m13[22m [2m┃[22m  	}
   [2m14[22m [2m┃[22m  };
   [2m15[22m [2m┃[22m  [31mvar[0m debug_default [34m=[0m [35mdebuglog[0m([32m"japa:browser-client"[0m);
   [2m16[22m [2m┃[22m  [31mconst[0m [33mDEFAULT_LAUNCHERS[0m [34m=[0m {
 [41m❯ 17 ┃  	chromium: (launcherOptions) => chromium.launch(launcherOptions),[49m
   [2m18[22m [2m┃[22m  	firefox[34m:[0m (launcherOptions) [31m=>[0m firefox[34m.[0m[35mlaunch[0m(launcherOptions)[34m,[0m
   [2m19[22m [2m┃[22m  	webkit[34m:[0m (launcherOptions) [31m=>[0m webkit[34m.[0m[35mlaunch[0m(launcherOptions)
   [2m20[22m [2m┃[22m  };
   [2m21[22m [2m┃[22m  [31mconst[0m [33mDEFAULT_ASSERTIONS_CONFIG[0m [34m=[0m {
   [2m22[22m [2m┃[22m  	timeout[34m:[0m [33m5e3[0m[34m,[0m

 ⁃ at Object.launcher [33m(node_modules/@japa/browser-client/build/index.js:46:11)[39m
 ⁃ [33m(node_modules/@japa/browser-client/build/index.js:574:55)[39m
 ⁃ at #exec [33m(node_modules/@poppinss/hooks/build/index.js:115:63)[39m
 ⁃ at Runner.run [33m(node_modules/@poppinss/hooks/build/index.js:137:22)[39m
 ⁃ at #runSetupHooks [33m(node_modules/@japa/core/build/index.js:1039:28)[39m
 ⁃ at SuiteRunner.run [33m(node_modules/@japa/core/build/index.js:1091:28)[39m
 ⁃ at Suite$1.exec [33m(node_modules/@japa/core/build/index.js:1175:16)[39m
 ⁃ at Runner$1.exec [33m(node_modules/@japa/core/build/index.js:427:16)[39m
 ⁃ at async run [33m(node_modules/@japa/runner/build/index.js:213:3)[39m
 ⁃ at async TestRunnerProcess.run [33m(node_modules/@adonisjs/core/build/main-B2rXbPKm.js:158:3)[39m
[1/1]─

 FAILED 

Tests  18 passed (18)
 Time  305ms
\`\`\`
</details>

- **Production build:** FAIL

<details><summary>Production build logs</summary>

\`\`\`

> agentic-cfo-starter@0.0.0 build
> node ace build

[ info ] loading hooks...
[ info ] generating indexes...
[ info ] codegen: created 6 file(s)
[ info ] cleaning up output directory (build)
[ info ] building assets with vite
[36mvite v8.3.5 [32mbuilding client environment for production...[36m[39m
transforming...
✓ 2525 modules transformed.
rendering chunks...
computing gzip size...
public/assets/.vite/manifest.json           3.37 kB │ gzip:   0.61 kB
public/assets/app-DEij1GWR.css             28.36 kB │ gzip:   6.30 kB
public/assets/arrow-up-right-DtVP6NWi.js    0.20 kB │ gzip:   0.18 kB
public/assets/not_found-BwxiiYjp.js         0.70 kB │ gzip:   0.37 kB
public/assets/server_error-DSpmpCd0.js      0.73 kB │ gzip:   0.38 kB
public/assets/marketing-C0TlyrW_.js         0.82 kB │ gzip:   0.39 kB
public/assets/auth-XGIA0_Fi.js              1.11 kB │ gzip:   0.52 kB
public/assets/logo-DKFQAFVH.js              1.12 kB │ gzip:   0.67 kB
public/assets/login-DMMPHnkN.js             1.55 kB │ gzip:   0.63 kB
public/assets/signup-Xorbi6N_.js            2.44 kB │ gzip:   0.73 kB
public/assets/page-qym1U2FS.js              5.27 kB │ gzip:   1.97 kB
public/assets/home-M7l6fwTt.js              6.18 kB │ gzip:   2.29 kB
public/assets/cfo-chat-geuwW0iU.js          6.94 kB │ gzip:   2.74 kB
public/assets/dashboard-BsPn4uBN.js        37.27 kB │ gzip:   8.40 kB
public/assets/theme_toggle-DTXqxTP7.js     38.66 kB │ gzip:  11.34 kB
public/assets/app-DuJ9l2dw.js             378.46 kB │ gzip: 118.35 kB

[32m✓ built in 297ms[39m
[ info ] compiling typescript source (tsc)
tests/browser/finance_journey.spec.ts(54,53): error TS2584: Cannot find name 'document'. Do you need to change your target library? Try changing the 'lib' compiler option to include 'dom'.
[ info ] created ace file (build/ace.js)
╭─────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                             │
│    Cannot complete the build process as there are TypeScript errors.                        │
│    Use "--ignore-ts-errors" flag to ignore TypeScript errors and continue the build.        │
│                                                                                             │
╰─────────────────────────────────────────────────────────────────────────────────────────────╯
\`\`\`
</details>

