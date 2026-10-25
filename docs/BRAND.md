# Acorra — Product identity (v1)

**Product name:** Acorra  
**Financial companion:** Sandy the Squirrel  
**Brand promise:** Grow your wealth, one habit at a time.

## Current implementation
- Application branding: Acorra
- The chat experience is named **Chat with Sandy**.
- On Sites, Sandy uses original rendered squirrel artwork with cinnamon fur, a cream muzzle, fluffy plume tail, forest-green neckerchief and gold acorn clasp. The separate Adonis/Zo app retains its existing placeholder icon.
- Keep the product refined, welcoming and habit-focused, not childish or judgmental.
- Preserve accurate money records, deterministic calculations and clear uncertainty disclosures.

## Deferred intentionally
Sandy’s current artwork is a design revision rather than a frozen final identity. Sites uses `sites/src/SandyAvatar.tsx` for avatars and `sites/src/SandyCharacter.tsx` for the expression gallery. The original Adonis placeholder remains in `inertia/components/sandy_avatar.tsx`. Character changes do not affect finance logic or chat history. Sound effects remain off.

## Copyright and distinction
The name Sandy was inspired by pop culture, but the final design must be wholly original and not reproduce another franchise's character, costume or distinctive traits.

## Engineering scope
The GitHub repository may retain its historical internal name `agentic-cfo`; changing that repository URL or database table names is unnecessary and could break deployment configuration. Brand-facing text should read Acorra and Sandy. This is a brand and user-interface change, **not** a new deployed ChatGPT Site.

## Sandy’s emotional states

The agreed seven-state catalogue is available in the Site under **Settings → Sandy** and defined in `sites/src/sandy_states.ts`. It preserves Curious, Calm, Watchful, Concerned, Screaming, Celebrating and Relieved, with triggers, sample dialogue and useful next actions. Screaming uses the marmot’s exaggerated expression as inspiration while Sandy remains an original squirrel. The library now contains seven consistent 3D-style rendered illustrations with lightweight idle and reaction motion. The rejected primitive 3D rig remains an unused source experiment. Art direction, asset paths and prompts are documented in `docs/SANDY_ART_DIRECTION.md`. The illustrations are not a live skeletal 3D rig. State previews do not mutate finances or automatically control Sandy in the app.
