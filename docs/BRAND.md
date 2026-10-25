# Acorra — Product identity (v1)

**Product name:** Acorra  
**Financial companion:** Sandy the Squirrel  
**Brand promise:** Grow your wealth, one habit at a time.

## Current implementation
- Application branding: Acorra
- The chat experience is named **Chat with Sandy**.
- Sandy has a temporary, minimalist squirrel-icon avatar in one reusable React component.
- Keep the product refined, welcoming and habit-focused, not childish or judgmental.
- Preserve accurate money records, deterministic calculations and clear uncertainty disclosures.

## Deferred intentionally
Sandy's final illustration, colours, expression set, animation states, sound effects and mascot personality tuning are **not decided**. The placeholder avatar is implemented in `inertia/components/sandy_avatar.tsx` so the final artwork can replace it without touching finance logic or chat history.

## Copyright and distinction
The name Sandy was inspired by pop culture, but the final design must be wholly original and not reproduce another franchise's character, costume or distinctive traits.

## Engineering scope
The GitHub repository may retain its historical internal name `agentic-cfo`; changing that repository URL or database table names is unnecessary and could break deployment configuration. Brand-facing text should read Acorra and Sandy. This is a brand and user-interface change, **not** a new deployed ChatGPT Site.

## Sandy’s emotional states

The agreed seven-state catalogue is available in the Site under **Settings → Sandy** and defined in `sites/src/sandy_states.ts`. It preserves Curious, Calm, Watchful, Concerned, Screaming, Celebrating and Relieved, with triggers, sample dialogue and useful next actions. Screaming uses the marmot’s exaggerated expression as inspiration while Sandy remains an original squirrel. The library contains temporary vector mood sketches; final illustration and animation are still deferred. State previews do not mutate finances or automatically control Sandy in the app.
