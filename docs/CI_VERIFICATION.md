# Initial Foundation Verification

Automated checks performed by GitHub Actions on 2026-10-24 10:15 UTC.

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
[ info ] tuyau: created api client registry (./.adonisjs/client/registry) (1.23 ms)
[ success ] Codegen files generated
app/controllers/finance_controller.ts(13,3): error TS6133: 'createCommitmentValidator' is declared but its value is never read.
app/controllers/finance_controller.ts(14,3): error TS6133: 'createGoalValidator' is declared but its value is never read.
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
✓ 2522 modules transformed.
rendering chunks...
computing gzip size...
public/assets/.vite/manifest.json         2.48 kB │ gzip:   0.49 kB
public/assets/app-DtDlKd6L.css           13.67 kB │ gzip:   3.46 kB
public/assets/not_found-SbZNZ7A7.js       0.70 kB │ gzip:   0.37 kB
public/assets/server_error-B-xqBpSH.js    0.73 kB │ gzip:   0.38 kB
public/assets/marketing-CmTm2SZt.js       0.78 kB │ gzip:   0.36 kB
public/assets/auth-BGaWUMDc.js            1.08 kB │ gzip:   0.51 kB
public/assets/login-C74pDfbZ.js           1.55 kB │ gzip:   0.63 kB
public/assets/signup-D2M6ZOlb.js          2.44 kB │ gzip:   0.73 kB
public/assets/home-xjIPE13y.js            6.32 kB │ gzip:   2.38 kB
public/assets/dashboard-CezzpuZQ.js      10.32 kB │ gzip:   2.92 kB
public/assets/theme_toggle-zKIpVvUA.js   39.73 kB │ gzip:  11.87 kB
public/assets/app-CtSp2iGf.js           376.62 kB │ gzip: 118.06 kB

[32m✓ built in 168ms[39m
[ info ] compiling typescript source (tsc)
app/controllers/finance_controller.ts(13,3): error TS6133: 'createCommitmentValidator' is declared but its value is never read.
app/controllers/finance_controller.ts(14,3): error TS6133: 'createGoalValidator' is declared but its value is never read.
[ info ] created ace file (build/ace.js)
╭─────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                             │
│    Cannot complete the build process as there are TypeScript errors.                        │
│    Use "--ignore-ts-errors" flag to ignore TypeScript errors and continue the build.        │
│                                                                                             │
╰─────────────────────────────────────────────────────────────────────────────────────────────╯
\`\`\`
</details>

