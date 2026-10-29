# Acorra workspace design

The internal app uses a balance-first hierarchy and direct everyday actions inspired by Revolut, retaining Acorra’s forest green, champagne accents and Sandy identity. Reference: https://www.revolut.com/blog/post/revolut-10/ . No Revolut artwork or branding is included.

## Presentation

- Desktop uses a fixed 208px navigation rail below a full-width 36px workspace/demo header bar. Profile, Settings and sign-in/logout are direct links at the bottom, with a divider above Profile and the brand line at the very bottom, below sign-in/logout. Sandy is the first desktop navigation item; mobile keeps Sandy in the centre. There is no floating desktop account submenu. The content header contains the breadcrumb. Tablet and mobile retain the profile menu in the header and bottom navigation with Sandy in the centre. Short desktop windows scroll the navigation links while keeping account links accessible.
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

## Four-tab organisation

- Summary is the starting screen for net worth, recorded cash, income/spending, budget highlights, upcoming bills, savings progress and financial alerts. Each highlight links to its detail or management screen.
- Activity is transaction entry and history only; monthly cash-flow cards are no longer repeated there.
- Budget manages spending limits, bills and savings goals. Summary links select the appropriate Budget section.
- Sandy explains verified recorded figures in guided mode, with no financial mutations.
- Net worth is a Summary detail screen containing account balances, asset/debt valuations and creation/update controls. Existing `view=wealth` links remain compatible, with Summary selected in navigation and a back link.
- Desktop keeps Sandy first. Mobile has four destinations: Summary, Activity, Sandy, Budget.
- Landing page branding and seasonal animation are unchanged.

## Profile cleanup

Profile uses one compact account panel: sign-in status, the available workspace, Settings, and account actions. Signed-out visitors get the native ChatGPT sign-in link; signed-in visitors get a status and logout. Loading and failed session checks have explicit states and a retry control.

Removed the user-facing storage marker experiment, automatic storage-check fetch, engineering launch-gate prose and redundant Sandy-library button. The storage-check API remains available for existing integration checks. No auth scope, persistence setting or financial-data release gate was changed. Native identity does not currently supply a display name or email to this client, so Profile does not invent either.

Verified all four account display states with server rendering, Settings and Summary navigation in the browser, desktop layout, and 320px/390px mobile fit. No personal financial data was used.

## Editable profile

Profile now edits an optional display name (up to 60 characters) and an initials-avatar colour. Signed-in preferences persist in a dedicated D1 `user_profiles` table, separate from financial records. ChatGPT remains the sign-in method; no email, legal name or password is invented or requested. Anonymous visitors can inspect the form but must sign in before editing/saving.

The profile endpoint derives the owner exclusively from the Sites-authenticated identity, rejects extra fields and cross-origin writes, and uses revision checks to prevent lost updates. The financial-data release lock remains false. A schema-only migration appends the profile table to the existing Worker migration journal; this custom Worker project does not use a Drizzle ORM schema generator.

Verification: 30 tests pass, including profile persistence, two-identity isolation, rejected owner selectors, invalid names/colours, stale saves and cross-origin writes. Local browser fixtures verified save/reload, two separate accounts, cancel, and the 390px mobile layout. Local fixtures are not production authentication verification and no test profile data is deployed.
