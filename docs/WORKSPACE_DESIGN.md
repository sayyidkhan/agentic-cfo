# Acorra workspace design

The internal app uses a balance-first hierarchy and direct everyday actions inspired by Revolut, retaining Acorra’s forest green, champagne accents and Sandy identity. Reference: https://www.revolut.com/blog/post/revolut-10/ . No Revolut artwork or branding is included.

## Presentation

- Desktop uses a fixed 208px navigation rail with the workspace/demo notice at the top and the Profile menu anchored at the bottom. The account menu opens upward and groups Profile, Settings and sign-in/logout. The content header contains the breadcrumb. Tablet and mobile retain the notice and profile in the header, and bottom navigation with Sandy in the centre. Short desktop windows scroll the navigation links while keeping the profile accessible.
- Home groups recorded cash, monthly spending and net worth in one emerald balance surface with Add entry, Plan ahead and Ask Sandy shortcuts. The three values stay on one row on mobile. `FitMoney` scales exact SGD amounts to fit without rounding, truncation or wrapping.
- Recent activity and Sandy’s next-step card form an asymmetric desktop layout and stack on mobile.
- Activity shows readable transaction descriptions, account/date metadata, signed amounts and compact action menus. Menus dismiss on outside click, action selection or Escape, with focus returned on keyboard dismissal.
- Plan uses consistent segmented controls, budget bars, savings progress, bill dates and two clear commitment totals. Marking a bill paid still updates only its reminder.
- Wealth groups account creation with account balances and manual valuations with their creation form. Manual valuations remain separate from accounts to prevent double-counting.
- Sandy, Profile and Settings share the same typography, fields, surfaces and spacing. Guided-mode and privacy explanations remain accessible.
- The public synthetic-data notice remains visible. Landing page, seasonal artwork, financial calculations, access controls and the real-data release lock are unchanged.

## Verification for this revision

- Production build and all 29 existing financial, security, asset and animation tests pass.
- Browser layout checks at 320px, 390px, 820px, 1040px and the desktop viewport. No horizontal overflow observed on the main tabs; all three mobile Home values share a row.
- Browser journeys: synthetic expense creation and editing update totals accurately; transfer editing works; Plan tabs render; Sandy’s bill response reflects recorded values; Profile and Settings remain reachable.
- Compact record menus open, launch editors and dismiss with Escape. Financial-record deletion retains its existing confirmation.
- Temporary responsive QA routes are removed before publishing. No financial test data is packaged.
