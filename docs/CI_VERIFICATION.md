# Initial Foundation Verification

Automated checks performed by GitHub Actions on 2026-10-24 09:56 UTC.

- **Generate app key:** PASS
- **Run migrations:** FAIL

<details><summary>Run migrations logs</summary>

\`\`\`

[31mℹ TypeError: Cannot read properties of undefined (reading 'name')[39m

 ⁃ at #resolveRouteHandle [33m(node_modules/@adonisjs/http-server/build/helpers-D-ryK4qq.js:288:38)[39m
 ⁃ at new Route [33m(node_modules/@adonisjs/http-server/build/helpers-D-ryK4qq.js:233:58)[39m
 ⁃ at Router.route [33m(node_modules/@adonisjs/http-server/build/define_config-CthsZu7o.js:3165:17)[39m
 ⁃ at Router.get [33m(node_modules/@adonisjs/http-server/build/define_config-CthsZu7o.js:3198:15)[39m
 ⁃ at <anonymous> [33m(start/routes.ts:28:12)[39m

   [2m23[22m [2m┃[22m    })
   [2m24[22m [2m┃[22m    [34m.[0m[35muse[0m(middleware[34m.[0m[35mguest[0m())
   [2m25[22m [2m┃[22m  
   [2m26[22m [2m┃[22m  router
   [2m27[22m [2m┃[22m    [34m.[0m[35mgroup[0m(() [31m=>[0m {
 [41m❯ 28 ┃      router.get('/dashboard', [controllers.Finance, 'index']).as('dashboard')[49m
   [2m29[22m [2m┃[22m      router[34m.[0m[35mpost[0m([32m'/finance/accounts'[0m[34m,[0m [controllers[34m.[0m[33mFinance[0m[34m,[0m [32m'storeAccount'[0m])[34m.[0m[31mas[0m([32m'finance.accounts.store'[0m)
   [2m30[22m [2m┃[22m      router[34m.[0m[35mpost[0m([32m'/finance/categories'[0m[34m,[0m [controllers[34m.[0m[33mFinance[0m[34m,[0m [32m'storeCategory'[0m])[34m.[0m[31mas[0m([32m'finance.categories.store'[0m)
   [2m31[22m [2m┃[22m      router[34m.[0m[35mpost[0m([32m'/finance/transactions'[0m[34m,[0m [controllers[34m.[0m[33mFinance[0m[34m,[0m [32m'storeTransaction'[0m])[34m.[0m[31mas[0m([32m'finance.transactions.store'[0m)
   [2m32[22m [2m┃[22m      router[34m.[0m[35mpost[0m([32m'/finance/budgets'[0m[34m,[0m [controllers[34m.[0m[33mFinance[0m[34m,[0m [32m'storeBudget'[0m])[34m.[0m[31mas[0m([32m'finance.budgets.store'[0m)
   [2m33[22m [2m┃[22m      router[34m.[0m[35mpost[0m([32m'/finance/valuations'[0m[34m,[0m [controllers[34m.[0m[33mFinance[0m[34m,[0m [32m'storeValuation'[0m])[34m.[0m[31mas[0m([32m'finance.valuations.store'[0m)

 ⁃ at Router.group [33m(node_modules/@adonisjs/http-server/build/define_config-CthsZu7o.js:3249:3)[39m
 ⁃ at <anonymous> [33m(start/routes.ts:27:4)[39m

\`\`\`
</details>

- **Typecheck:** FAIL

<details><summary>Typecheck logs</summary>

\`\`\`

> agentic-cfo-starter@0.0.0 typecheck
> tsc --noEmit && tsc --noEmit --project inertia/tsconfig.json

start/routes.ts(28,43): error TS2339: Property 'Finance' does not exist on type '{ NewAccount: () => Promise<typeof import("/home/runner/work/agentic-cfo/agentic-cfo/app/controllers/new_account_controller", { with: { "resolution-mode": "import" } })>; Session: () => Promise<typeof import("/home/runner/work/agentic-cfo/agentic-cfo/app/controllers/session_controller", { with: { "resolution-mode": ...'.
start/routes.ts(29,51): error TS2339: Property 'Finance' does not exist on type '{ NewAccount: () => Promise<typeof import("/home/runner/work/agentic-cfo/agentic-cfo/app/controllers/new_account_controller", { with: { "resolution-mode": "import" } })>; Session: () => Promise<typeof import("/home/runner/work/agentic-cfo/agentic-cfo/app/controllers/session_controller", { with: { "resolution-mode": ...'.
start/routes.ts(30,53): error TS2339: Property 'Finance' does not exist on type '{ NewAccount: () => Promise<typeof import("/home/runner/work/agentic-cfo/agentic-cfo/app/controllers/new_account_controller", { with: { "resolution-mode": "import" } })>; Session: () => Promise<typeof import("/home/runner/work/agentic-cfo/agentic-cfo/app/controllers/session_controller", { with: { "resolution-mode": ...'.
start/routes.ts(31,55): error TS2339: Property 'Finance' does not exist on type '{ NewAccount: () => Promise<typeof import("/home/runner/work/agentic-cfo/agentic-cfo/app/controllers/new_account_controller", { with: { "resolution-mode": "import" } })>; Session: () => Promise<typeof import("/home/runner/work/agentic-cfo/agentic-cfo/app/controllers/session_controller", { with: { "resolution-mode": ...'.
start/routes.ts(32,50): error TS2339: Property 'Finance' does not exist on type '{ NewAccount: () => Promise<typeof import("/home/runner/work/agentic-cfo/agentic-cfo/app/controllers/new_account_controller", { with: { "resolution-mode": "import" } })>; Session: () => Promise<typeof import("/home/runner/work/agentic-cfo/agentic-cfo/app/controllers/session_controller", { with: { "resolution-mode": ...'.
start/routes.ts(33,53): error TS2339: Property 'Finance' does not exist on type '{ NewAccount: () => Promise<typeof import("/home/runner/work/agentic-cfo/agentic-cfo/app/controllers/new_account_controller", { with: { "resolution-mode": "import" } })>; Session: () => Promise<typeof import("/home/runner/work/agentic-cfo/agentic-cfo/app/controllers/session_controller", { with: { "resolution-mode": ...'.
\`\`\`
</details>

- **Unit tests:** PASS
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
✓ 2518 modules transformed.
[31m✗[39m Build failed in 136ms

[31mℹ Error: [31mBuild failed with 2 errors:

[31m[builtin:vite-transform] [0mExpected corresponding JSX closing tag for 'div'.
    [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m inertia/pages/dashboard.tsx:95:17 [38;5;246m][0m
    [38;5;246m│[0m
 [38;5;246m88 │[0m [38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m{[0m[38;5;249m([0m[38;5;249m{[0m[38;5;249m [0m[38;5;249me[0m[38;5;249mr[0m[38;5;249mr[0m[38;5;249mo[0m[38;5;249mr[0m[38;5;249ms[0m[38;5;249m,[0m[38;5;249m [0m[38;5;249mp[0m[38;5;249mr[0m[38;5;249mo[0m[38;5;249mc[0m[38;5;249me[0m[38;5;249ms[0m[38;5;249ms[0m[38;5;249mi[0m[38;5;249mn[0m[38;5;249mg[0m[38;5;249m [0m[38;5;249m}[0m[38;5;249m)[0m[38;5;249m [0m[38;5;249m=[0m[38;5;249m>[0m[38;5;249m [0m[38;5;249m<[0mdiv[38;5;249m [0m[38;5;249ms[0m[38;5;249mt[0m[38;5;249my[0m[38;5;249ml[0m[38;5;249me[0m[38;5;249m=[0m[38;5;249m{[0m[38;5;249m{[0m[38;5;249m [0m[38;5;249md[0m[38;5;249mi[0m[38;5;249ms[0m[38;5;249mp[0m[38;5;249ml[0m[38;5;249ma[0m[38;5;249my[0m[38;5;249m:[0m[38;5;249m [0m[38;5;249m'[0m[38;5;249mg[0m[38;5;249mr[0m[38;5;249mi[0m[38;5;249md[0m[38;5;249m'[0m[38;5;249m,[0m[38;5;249m [0m[38;5;249mg[0m[38;5;249ma[0m[38;5;249mp[0m[38;5;249m:[0m[38;5;249m [0m[38;5;249m1[0m[38;5;249m0[0m[38;5;249m [0m[38;5;249m}[0m[38;5;249m}[0m[38;5;249m>[0m
 [38;5;240m   │[0m                                           ─┬─  
 [38;5;240m   │[0m                                            ╰─── Opened here
 [38;5;240m   │[0m 
 [38;5;246m95 │[0m [38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m<[0m[38;5;249m/[0mlabel[38;5;249m>[0m
 [38;5;240m   │[0m                 ──┬──  
 [38;5;240m   │[0m                   ╰──── Expected `</div>`
[38;5;246m────╯[0m

[31m[builtin:vite-transform] [0mExpected `}` but found `{`
    [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m inertia/pages/dashboard.tsx:96:15 [38;5;246m][0m
    [38;5;246m│[0m
 [38;5;246m96 │[0m [38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m[38;5;249m [0m{[38;5;249mO[0m[38;5;249mb[0m[38;5;249mj[0m[38;5;249me[0m[38;5;249mc[0m[38;5;249mt[0m[38;5;249m.[0m[38;5;249mv[0m[38;5;249ma[0m[38;5;249ml[0m[38;5;249mu[0m[38;5;249me[0m[38;5;249ms[0m[38;5;249m([0m[38;5;249me[0m[38;5;249mr[0m[38;5;249mr[0m[38;5;249mo[0m[38;5;249mr[0m[38;5;249ms[0m[38;5;249m)[0m[38;5;249m.[0m[38;5;249mm[0m[38;5;249ma[0m[38;5;249mp[0m[38;5;249m([0m[38;5;249m([0m[38;5;249me[0m[38;5;249m,[0m[38;5;249m [0m[38;5;249mi[0m[38;5;249m)[0m[38;5;249m [0m[38;5;249m=[0m[38;5;249m>[0m[38;5;249m [0m[38;5;249m<[0m[38;5;249ms[0m[38;5;249mm[0m[38;5;249ma[0m[38;5;249ml[0m[38;5;249ml[0m[38;5;249m [0m[38;5;249mk[0m[38;5;249me[0m[38;5;249my[0m[38;5;249m=[0m[38;5;249m{[0m[38;5;249mi[0m[38;5;249m}[0m[38;5;249m [0m[38;5;249mr[0m[38;5;249mo[0m[38;5;249ml[0m[38;5;249me[0m[38;5;249m=[0m[38;5;249m"[0m[38;5;249ma[0m[38;5;249ml[0m[38;5;249me[0m[38;5;249mr[0m[38;5;249mt[0m[38;5;249m"[0m[38;5;249m>[0m[38;5;249m{[0m[38;5;249me[0m[38;5;249m}[0m[38;5;249m<[0m[38;5;249m/[0m[38;5;249ms[0m[38;5;249mm[0m[38;5;249ma[0m[38;5;249ml[0m[38;5;249ml[0m[38;5;249m>[0m[38;5;249m)[0m[38;5;249m}[0m
 [38;5;240m   │[0m               ┬  
 [38;5;240m   │[0m               ╰── `}` expected
[38;5;246m────╯[0m
[39m[31m[39m

 ⁃ at aggregateBindingErrorsIntoJsError [33m(node_modules/rolldown/dist/shared/error-D0SD8_tL.mjs:49:18)[39m

   [2m44[22m [2m┃[22m  			summary += [32m"..."[0m;
   [2m45[22m [2m┃[22m  			break;
   [2m46[22m [2m┃[22m  		}
   [2m47[22m [2m┃[22m  		summary += getErrorMessage(errors[i]);
   [2m48[22m [2m┃[22m  	}
 [41m❯ 49 ┃  	const wrapper = new Error(summary);[49m
   [2m50[22m [2m┃[22m  	Object.defineProperty(wrapper, [32m"errors"[0m, {
   [2m51[22m [2m┃[22m  		configurable: true,
   [2m52[22m [2m┃[22m  		enumerable: true,
   [2m53[22m [2m┃[22m  		get: () => errors,
   [2m54[22m [2m┃[22m  		set: (value) => Object.defineProperty(wrapper, [32m"errors"[0m, {

 ⁃ at unwrapBindingResult [33m(node_modules/rolldown/dist/shared/error-D0SD8_tL.mjs:19:128)[39m
 ⁃ at #build [33m(node_modules/rolldown/dist/shared/rolldown-CMhwwZPA.mjs:145:34)[39m
 ⁃ at async buildEnvironment [33m(node_modules/vite/dist/node/chunks/node.js:34849:66)[39m
 ⁃ at async Object.build [33m(node_modules/vite/dist/node/chunks/node.js:35270:19)[39m
 ⁃ at async Object.buildApp [33m(node_modules/vite/dist/node/chunks/node.js:35267:153)[39m
 ⁃ [33m(async file://node_modules/@adonisjs/vite/build/src/hooks/build_hook.js:21:2)[39m
 ⁃ at async #exec [33m(node_modules/@poppinss/hooks/build/index.js:115:24)[39m
 ⁃ at async Bundler.bundle [33m(node_modules/@adonisjs/assembler/build/index.js:210:3)[39m
 ⁃ at async Build.run [33m(node_modules/@adonisjs/core/build/commands/build.js:83:8)[39m

\`\`\`
</details>

