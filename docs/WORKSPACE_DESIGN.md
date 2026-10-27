# Acorra workspace refresh

The internal app takes inspiration from Revolut’s balance-first hierarchy and direct everyday actions, retaining Acorra’s own forest green, champagne accents and Sandy identity. Reference: https://www.revolut.com/blog/post/revolut-10/ . No Revolut artwork or branding is included.

- Cool neutral canvas, white cards, sans-serif page headings and compact navigation.
- Overview uses three equal mobile columns for recorded cash, monthly spending and net worth, with exact SGD cents. `FitMoney` measures the available width and scales long values down without truncation, rounding or wrapping.
- Add entry, Plan ahead and Ask Sandy are working shortcuts below the balance card.
- Transactions, plan sections, wealth, settings and chat share the refreshed workspace styling.
- Sandy’s guided-mode explanation and privacy details remain accessible through disclosures, reducing repeated prose around the conversation.
- Landing page and seasonal artwork are unchanged. Financial calculations, access controls and the public-demo release lock are preserved.

## Verification

Browser checks cover 320px and 390px overview values, a synthetic S$123,456,789.12 income entry and resulting large balances, shortcut navigation, plan tabs, wealth, chat and desktop layout. Existing financial and security tests are run before release.
