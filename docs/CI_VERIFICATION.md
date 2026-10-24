# Initial Foundation Verification

Automated checks performed by GitHub Actions on 2026-10-24 09:57 UTC.

- **Generate app key:** PASS
- **Run migrations:** PASS
- **Typecheck:** FAIL

<details><summary>Typecheck logs</summary>

\`\`\`

> agentic-cfo-starter@0.0.0 typecheck
> tsc --noEmit && tsc --noEmit --project inertia/tsconfig.json

inertia/pages/dashboard.tsx(73,17): error TS2769: No overload matches this call.
  Overload 1 of 3, '(props: Omit<InertiaFormProps<{} | { email: string; fullName: string | null; password: string; passwordConfirmation: string; } | { email: string; password: string; }>, "children" | ... 1 more ... | "action"> & { ...; } & { ...; } & { ...; } & { ...; }): Element', gave the following error.
    Type '"finance.accounts.store"' is not assignable to type '"dashboard" | "home" | "new_account.create" | "new_account.store" | "session.create" | "session.store" | "session.destroy"'.
  Overload 2 of 3, '(props: Omit<InertiaFormProps<Record<string, any>>, "route" | "children"> & { route?: undefined; routeParams?: undefined; qs?: undefined; children?: FormChildren<...>; } & { ...; }): Element', gave the following error.
    Type 'string' is not assignable to type 'undefined'.
  Overload 3 of 3, '(props: (Omit<InertiaFormProps<{} | { email: string; fullName: string | null; password: string; passwordConfirmation: string; } | { email: string; password: string; }>, "children" | ... 1 more ... | "action"> & { ...; } & { ...; } & { ...; } & { ...; }) | (Omit<...> & ... 1 more ... & { ...; })): Element', gave the following error.
    Type '"finance.accounts.store"' is not assignable to type '"dashboard" | "home" | "new_account.create" | "new_account.store" | "session.create" | "session.store" | "session.destroy" | undefined'.
inertia/pages/dashboard.tsx(87,17): error TS2769: No overload matches this call.
  Overload 1 of 3, '(props: Omit<InertiaFormProps<{} | { email: string; fullName: string | null; password: string; passwordConfirmation: string; } | { email: string; password: string; }>, "children" | ... 1 more ... | "action"> & { ...; } & { ...; } & { ...; } & { ...; }): Element', gave the following error.
    Type '"finance.transactions.store"' is not assignable to type '"dashboard" | "home" | "new_account.create" | "new_account.store" | "session.create" | "session.store" | "session.destroy"'.
  Overload 2 of 3, '(props: Omit<InertiaFormProps<Record<string, any>>, "route" | "children"> & { route?: undefined; routeParams?: undefined; qs?: undefined; children?: FormChildren<...>; } & { ...; }): Element', gave the following error.
    Type 'string' is not assignable to type 'undefined'.
  Overload 3 of 3, '(props: (Omit<InertiaFormProps<{} | { email: string; fullName: string | null; password: string; passwordConfirmation: string; } | { email: string; password: string; }>, "children" | ... 1 more ... | "action"> & { ...; } & { ...; } & { ...; } & { ...; }) | (Omit<...> & ... 1 more ... & { ...; })): Element', gave the following error.
    Type '"finance.transactions.store"' is not assignable to type '"dashboard" | "home" | "new_account.create" | "new_account.store" | "session.create" | "session.store" | "session.destroy" | undefined'.
inertia/pages/dashboard.tsx(103,17): error TS2769: No overload matches this call.
  Overload 1 of 3, '(props: Omit<InertiaFormProps<{} | { email: string; fullName: string | null; password: string; passwordConfirmation: string; } | { email: string; password: string; }>, "children" | ... 1 more ... | "action"> & { ...; } & { ...; } & { ...; } & { ...; }): Element', gave the following error.
    Type '"finance.categories.store"' is not assignable to type '"dashboard" | "home" | "new_account.create" | "new_account.store" | "session.create" | "session.store" | "session.destroy"'.
  Overload 2 of 3, '(props: Omit<InertiaFormProps<Record<string, any>>, "route" | "children"> & { route?: undefined; routeParams?: undefined; qs?: undefined; children?: FormChildren<...>; } & { ...; }): Element', gave the following error.
    Type 'string' is not assignable to type 'undefined'.
  Overload 3 of 3, '(props: (Omit<InertiaFormProps<{} | { email: string; fullName: string | null; password: string; passwordConfirmation: string; } | { email: string; password: string; }>, "children" | ... 1 more ... | "action"> & { ...; } & { ...; } & { ...; } & { ...; }) | (Omit<...> & ... 1 more ... & { ...; })): Element', gave the following error.
    Type '"finance.categories.store"' is not assignable to type '"dashboard" | "home" | "new_account.create" | "new_account.store" | "session.create" | "session.store" | "session.destroy" | undefined'.
inertia/pages/dashboard.tsx(111,17): error TS2769: No overload matches this call.
  Overload 1 of 3, '(props: Omit<InertiaFormProps<{} | { email: string; fullName: string | null; password: string; passwordConfirmation: string; } | { email: string; password: string; }>, "children" | ... 1 more ... | "action"> & { ...; } & { ...; } & { ...; } & { ...; }): Element', gave the following error.
    Type '"finance.budgets.store"' is not assignable to type '"dashboard" | "home" | "new_account.create" | "new_account.store" | "session.create" | "session.store" | "session.destroy"'.
  Overload 2 of 3, '(props: Omit<InertiaFormProps<Record<string, any>>, "route" | "children"> & { route?: undefined; routeParams?: undefined; qs?: undefined; children?: FormChildren<...>; } & { ...; }): Element', gave the following error.
    Type 'string' is not assignable to type 'undefined'.
  Overload 3 of 3, '(props: (Omit<InertiaFormProps<{} | { email: string; fullName: string | null; password: string; passwordConfirmation: string; } | { email: string; password: string; }>, "children" | ... 1 more ... | "action"> & { ...; } & { ...; } & { ...; } & { ...; }) | (Omit<...> & ... 1 more ... & { ...; })): Element', gave the following error.
    Type '"finance.budgets.store"' is not assignable to type '"dashboard" | "home" | "new_account.create" | "new_account.store" | "session.create" | "session.store" | "session.destroy" | undefined'.
inertia/pages/dashboard.tsx(125,17): error TS2769: No overload matches this call.
  Overload 1 of 3, '(props: Omit<InertiaFormProps<{} | { email: string; fullName: string | null; password: string; passwordConfirmation: string; } | { email: string; password: string; }>, "children" | ... 1 more ... | "action"> & { ...; } & { ...; } & { ...; } & { ...; }): Element', gave the following error.
    Type '"finance.valuations.store"' is not assignable to type '"dashboard" | "home" | "new_account.create" | "new_account.store" | "session.create" | "session.store" | "session.destroy"'.
  Overload 2 of 3, '(props: Omit<InertiaFormProps<Record<string, any>>, "route" | "children"> & { route?: undefined; routeParams?: undefined; qs?: undefined; children?: FormChildren<...>; } & { ...; }): Element', gave the following error.
    Type 'string' is not assignable to type 'undefined'.
  Overload 3 of 3, '(props: (Omit<InertiaFormProps<{} | { email: string; fullName: string | null; password: string; passwordConfirmation: string; } | { email: string; password: string; }>, "children" | ... 1 more ... | "action"> & { ...; } & { ...; } & { ...; } & { ...; }) | (Omit<...> & ... 1 more ... & { ...; })): Element', gave the following error.
    Type '"finance.valuations.store"' is not assignable to type '"dashboard" | "home" | "new_account.create" | "new_account.store" | "session.create" | "session.store" | "session.destroy" | undefined'.
\`\`\`
</details>

- **Unit tests:** PASS
- **Production build:** PASS
