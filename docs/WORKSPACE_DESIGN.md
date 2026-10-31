# Acorra workspace design

The internal app uses a balance-first hierarchy and direct everyday actions inspired by Revolut, retaining Acorra’s forest green, champagne accents and Sandy identity. Reference: https://www.revolut.com/blog/post/revolut-10/ . No Revolut artwork or branding is included.

## Clearer dashboard hierarchy — 31 October 2026

The agreed navigation is **Overview · Spending · Sandy · Plan · Profile** on mobile. Desktop keeps Sandy first. **Accounts** is a supporting page reached from Overview; legacy URLs remain compatible. Plan contains Budgets, Goals and Bills. Spending continues to support income and transfers.

Overview now leads with a monthly spending panel, exact cash and net-worth figures, category-budget coverage, recorded income and net cash flow. The account and spending figures open their detail screens. Accounts and Add entry remain visible in the page header. Category highlights sort overspent/near-limit budgets first. Spending outside budgeted categories is explicit rather than hidden in a reassuring aggregate.

Sandy shows one prioritised signal and its relevant action: cash shortfall first, then overspending, overdue bill confirmation and other notices. Additional signals expand beneath it. Bill dates/status and goal progress use compact rows. Goals never count as additional assets. All monthly figures reuse the deterministic engine; no forecasts or historical trends were invented.

Validation: 34 Sites tests passed, including aggregate category coverage, zero limits, unsafe totals, duplicate rejection and signal ordering. TypeScript passed. Browser evidence below covers exact-cent expense updates, contextual bill links and responsive layouts. Real financial persistence remains locked; test records are synthetic.

The earlier sections below retain the wording and evidence of their milestones.

## Presentation

- Desktop uses a fixed 208px navigation rail below a full-width 36px workspace/demo header bar. Profile, Settings and sign-in/logout are direct links at the bottom, with a divider above Profile and the brand line at the very bottom, below sign-in/logout. Sandy is the first desktop navigation item; mobile keeps Sandy in the centre. There is no floating desktop account submenu. The content header contains the breadcrumb. Tablet and mobile use five bottom destinations, with Profile after Budget and Sandy in the centre; the header profile menu has been removed. Short desktop windows scroll the navigation links while keeping account links accessible.
- Summary groups recorded cash, monthly spending and net worth in one emerald balance surface with Add entry, Budget ahead and Ask Sandy shortcuts. The three values stay on one row on mobile. `FitMoney` scales exact SGD amounts to fit without rounding, truncation or wrapping.
- Budget highlights and Sandy’s next-step card form an asymmetric desktop layout and stack on mobile; bills and savings progress follow.
- Activity shows readable transaction descriptions, account/date metadata, signed amounts and compact action menus. Menus dismiss on outside click, action selection or Escape, with focus returned on keyboard dismissal.
- Budget uses consistent segmented controls, budget bars, savings progress, bill dates and two clear commitment totals. Marking a bill paid still updates only its reminder.
- Wealth groups account creation with account balances and manual valuations with their creation form. Manual valuations remain separate from accounts to prevent double-counting.
- Sandy, Profile and Settings share the same typography, fields, surfaces and spacing. Guided-mode and privacy explanations remain accessible.
- The public synthetic-data notice remains visible. Landing page, seasonal artwork, financial calculations, access controls and the real-data release lock are unchanged.

## Verification for this revision

- Production build and all 29 existing financial, security, asset and animation tests pass.
- Browser layout checks at 320px, 390px, 820px, 1040px and the desktop viewport. No horizontal overflow observed on the main tabs; all three mobile Summary values share a row.
- Browser journeys: synthetic expense creation and editing update totals accurately; transfer editing works; Budget tabs render; Sandy’s bill response reflects recorded values; Profile and Settings remain reachable.
- Compact record menus open, launch editors and dismiss with Escape. Financial-record deletion retains its existing confirmation.
- Temporary responsive QA routes are removed before publishing. No financial test data is packaged.

## Financial destinations

- Summary is the starting screen for net worth, recorded cash, income/spending, budget highlights, upcoming bills, savings progress and financial alerts. Each highlight links to its detail or management screen.
- Activity is transaction entry and history only; monthly cash-flow cards are no longer repeated there.
- Budget manages spending limits, bills and savings goals. Summary links select the appropriate Budget section.
- Sandy explains verified recorded figures in guided mode, with no financial mutations.
- Net worth is a Summary detail screen containing account balances, asset/debt valuations and creation/update controls. Existing `view=wealth` links remain compatible, with Summary selected in navigation and a back link.
- Desktop keeps Sandy first. Mobile has five destinations: Summary, Activity, Sandy, Budget, Profile.
- Landing page branding and seasonal animation are unchanged.

## Profile cleanup

Profile uses one compact account panel: sign-in status, the available workspace, Settings, and account actions. Signed-out visitors get the native ChatGPT sign-in link; signed-in visitors get a status and logout. Loading and failed session checks have explicit states and a retry control.

Removed the user-facing storage marker experiment, automatic storage-check fetch, engineering launch-gate prose and redundant Sandy-library button. The storage-check API remains available for existing integration checks. No auth scope, persistence setting or financial-data release gate was changed. Native identity does not currently supply a display name or email to this client, so Profile does not invent either.

Verified all four account display states with server rendering, Settings and Summary navigation in the browser, desktop layout, and 320px/390px mobile fit. No personal financial data was used.

## Editable profile

Profile now edits an optional display name (up to 60 characters) and an initials-avatar colour. Signed-in preferences persist in a dedicated D1 `user_profiles` table, separate from financial records. ChatGPT remains the sign-in method; no email, legal name or password is invented or requested. Anonymous visitors can inspect the form but must sign in before editing/saving.

The profile endpoint derives the owner exclusively from the Sites-authenticated identity, rejects extra fields and cross-origin writes, and uses revision checks to prevent lost updates. The financial-data release lock remains false. A schema-only migration appends the profile table to the existing Worker migration journal; this custom Worker project does not use a Drizzle ORM schema generator.

Verification: 30 tests pass, including profile persistence, two-identity isolation, rejected owner selectors, invalid names/colours, stale saves and cross-origin writes. Local browser fixtures verified save/reload, two separate accounts, cancel, and the 390px mobile layout. Local fixtures are not production authentication verification and no test profile data is deployed.

## Optional profile photos

Signed-in users can upload, replace or remove a private profile photo. The browser accepts JPG/PNG/WebP up to 5 MB, decodes the image and centre-crops/resizes it to a 512px JPEG before uploading. Re-encoding discards source metadata. Photo changes save immediately; removing a photo restores the initials avatar.

R2 uses the native BUCKET binding. Photo objects are never public: the image route requires the native signed-in identity and derives its object key server-side from that identity. Query parameters cannot select another user's photo. Writes require same-origin requests, a JPEG signature and a 1 MB processed-image limit; reads are private/no-store. Display-name and avatar-colour persistence remains independent.

31 tests pass, including private reads, account isolation, cross-origin rejection, unsafe type/size rejection and removal. Browser tests used a synthetic test image: upload, 512px output, reload, separate local identities, removal and mobile fit passed. Preview photo objects are memory-only test fixtures; production photos use R2.

## Settings directory

The Settings entry opens a compact directory with Companion → Sandy’s expressions, and Demo data → Reset demo. The seven-state library and animation controls now live at `/settings?section=sandy`, with a return link and nested desktop breadcrumb. Existing `/settings?sandy=<state>` links remain compatible. Reset demo remains on the Settings directory and retains its existing scope and behaviour.

Browser verification covered opening the library, choosing Relieved Sandy, pausing/resuming animation, returning to Settings, a legacy Calm link, and mobile menu navigation at 390px with no horizontal overflow. This is a navigation/layout change; financial calculations, authentication and storage are unchanged.

## Mobile Profile navigation

Mobile and tablet bottom navigation now has five destinations: Summary, Activity, Sandy, Budget, Profile. The header Profile popup is removed, so Sandy returns to the centre and Profile opens the account page directly. A mobile-only Settings row inside Profile preserves access to preferences; Settings and its expression library keep Profile selected as their parent tab. The desktop sidebar remains unchanged.

Browser checks verified the five-tab order, Profile navigation from Sandy, Profile → Settings, the active parent tab, and 390px layout without horizontal overflow. The five touch targets are approximately 71px wide at the tested viewport. No account or financial behaviour changed.

## Landing-to-app transition

All landing links that enter the workspace use a shared branded entry curtain. The header Open app link now uses client navigation, matching Explore Acorra and the deeper preview links. A forest-green overlay with a gold orbit, Acorra mark/wordmark and indeterminate loading trail covers the route swap, then fades into the destination. The initial sequence was about 940ms (superseded by the expanded entrance below); there is no fabricated percentage or financial-sync claim.

The destination renders behind an inert surface until the reveal completes. Focus moves to its heading, repeated activations are ignored, browser history cancels pending entry, and timers/body scroll locks clean up on exit. Reduced-motion preferences skip the transition. A slow personal-workspace load can hold the curtain, with an 8-second escape to the app’s existing loading/error screen. Internal tab changes and direct app visits stay immediate.

Verification: 31 existing tests passed. Browser checks covered desktop Open app, Explore Acorra, keyboard entry, mobile viewport coverage, the final Summary focus and unlocked surface, and browser Back restoring the landing page without a stuck overlay. Mobile had no horizontal overflow.

## Expanded app entrance

The landing-to-app entrance now lasts about 2.55 seconds after its first painted frame, replacing the previous 940ms sequence. Twelve gold sparks converge around a larger acorn identity, light rings expand, the Acorra letters enter in sequence, and a 650ms circular curtain reveal opens the workspace. The clock starts after two animation frames so initial click/render work does not consume the visible presentation time; a 120ms timer starts it if animation frames are throttled. The brand remains visible even before animations advance. Slow-load escape, cleanup, focus handoff and reduced-motion bypass remain intact.
