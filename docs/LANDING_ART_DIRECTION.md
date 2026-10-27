# Acorra — Sandy through the seasons

Updated 27 October 2026.

## Current direction

Sandy gathers an acorn, approaches her oak-tree hiding place, crouches to store it, and settles beside her growing stash. The woodland progresses through spring, summer, autumn and winter. This gives the savings-habit metaphor a visible story rather than an isolated floating acorn.

Desktop uses a large, sharp woodland stage that extends to the right edge of the hero, without an arch or card border. A localized forest-green scrim keeps the copy readable without a duplicated blurry image. On phones, a single continuous portrait woodland extends upward behind the compact heading and navigation. A vertical dark scrim keeps text readable; the scene no longer starts at a horizontal seam below the call to action. The character and stash share a square scene plane so the acorn deposit stays aligned with the tree hollow. Moving sunbeams, airborne particles, autumn leaves and winter snow provide environmental motion. The foreground uses layered artwork and a shared 32-second timeline: eight seconds per season. Visitors can jump to a season using the four labelled buttons. No play/pause button is shown.

Sandy remains visible at loop boundaries and begins her approach further inside the scene, avoiding the empty woodland frame during transitions.

The clock suspends when the scene is offscreen or the document is hidden. OS reduced-motion preferences produce a complete still scene; season selection remains available. The animation is decorative and has no connection to financial mutations, account data or simulated investment returns. The actual finance preview and complete footer remain below it.

## Implementation and assets

- `sites/src/SeasonalHero.tsx`: character, scene, stash, season controls and visibility handling.
- `sites/src/season_story.ts`: deterministic timing for character poses, the released acorn and stash growth.
- `sites/src/seasonal-hero.css`: responsive composition, weather, atmosphere and transitions.
- `sites/assets/seasons/{spring,summer,autumn,winter}.webp`: four woodland environments.
- `sites/assets/seasons/sandy-carry.webp`: reused approved Sandy artwork.
- `sites/assets/seasons/sandy-stash.webp`: new crouching pose matched to the approved character.
- The relieved Sandy pose is reused for settling and winter.

The four environments and crouching pose were made with built-in image generation, not a paid runtime API. Environment sheet extraction and WebP encoding preserve the supplied panels and character transparency. All assets are served from same-origin versioned URLs with immutable caching. No new external service or WebGL dependency is needed. The previous sculptural acorn remains archived in the repository but is no longer shipped in the landing page.

## Generation prompts

### Woodland environment sheet

> Use case: stylized-concept. Asset: a FOUR SEASON environment sprite sheet for Acorra's animated woodland hero. Create a perfectly aligned 2 by 2 grid of FOUR equally sized square illustrations, edge to edge, no gutters, no borders, no text. Top-left SPRING, top-right SUMMER, bottom-left AUTUMN, bottom-right WINTER. SAME forest clearing, identical camera, exact same central objects and perspective in all four panels. Feature a huge old oak trunk on the RIGHT side (center x=76% of each panel), broad gnarled roots, and an inviting dark hollow at its base (center x=72%, y=73%), large enough for a squirrel's acorn store. Woodland floor at y=80%, clearing on LEFT two-thirds for a squirrel to approach the hollow. Far forest with atmospheric depth, sunrays, layered trees, storybook cinematic high fidelity 3D animation film environment, believable mossy bark texture, soft lush foliage. Spring: fresh green leaves, tiny flowers, morning light. Summer: rich forest greens, golden sunbeams, lush canopy. Autumn: amber and copper leaves, warm afternoon golden light, fallen leaves. Winter: same tree with sparse bare boughs, soft snow on ground and roots, cool blue-green twilight, welcoming warm light in hollow. Scene has room for overlaid character in clearing and stash inside hollow; DO NOT draw any animals, characters, nuts, acorns, people, furniture or text. Not flat clipart. Rich sophisticated forest green, ivory and gold palette, warm premium Pixar-quality environment, no logos. Each panel must be the exact same dimensions and all 4 panels fill the entire image. 2048 by 2048 overall preferred.

### Crouching pose

Reference: existing `sites/assets/sandy/curious.webp`.

> Create one new animation pose for this friendly squirrel mascot, matching the reference character's cinnamon fur, cream belly, fluffy tail, green neck scarf and gold pin. The squirrel is crouching beside her imaginary woodland hiding spot, facing right in a three-quarter side view, gently placing an acorn down with her front paws. Show the entire squirrel including tail and feet, centered with comfortable clear margin. Keep the same polished 3D storybook illustration style and friendly expression. Transparent background. Only the squirrel character and the acorn in her paws, no scenery and no text.

## Validation

Existing financial checks remain in place. Additional tests verify that all six seasonal assets are served intact using read-only methods, that an acorn enters the stash only after release, that the winter stash stays intact, and that pose opacity remains continuous through the complete loop. Desktop and 390px browser checks cover scene rendering, season selection, image loading and horizontal overflow.

## Mobile viewport follow-up

The woodland hero now sizes against the small viewport height (`svh`) instead of a fixed 650px stage. Its four season controls sit within the first mobile screen with space above browser chrome; the caption and character remain part of the same continuous forest scene. The header entry is labelled “Open app” on mobile and desktop and uses a native dashboard link so navigation also works without client-side interception.

## Winter payoff — Sandy’s earned rest

In winter Sandy reclines on a rustic wooden lounger, feet up, holding an acorn, beside the full six-acorn store. The dedicated transparent asset is `sites/assets/seasons/sandy-winter-rest.webp`. It crossfades into the snowy woodland, replacing the standing pose only in winter, and respects reduced-motion preferences. The wooden lounger stays still; snowfall provides ambient movement. Winter copy: “A little saved. A little well-earned rest.”

Generated with the built-in image-generation tool using the existing curious Sandy as the character reference. Prompt: “Create a new full-body pose of this same cinnamon-furred squirrel Sandy, preserving her cream belly, fluffy curled tail, round expressive face, dark green neck scarf and gold acorn pin. Reclining on a small rustic wooden chaise longue, back supported, feet stretched out, peaceful half-closed eyes, holding an acorn near her chest. Backrest left, feet right, three-quarter front view. Complete squirrel and bench in frame, transparent background, no scenery, premium detailed 3D storybook render, warm fur lighting and cool soft fill.”

Choosing a season keeps that season selected while its local scene animation continues; the default untouched hero still cycles through the year. This lets visitors linger on winter’s resting scene.

## Animated winter Sandy and golden acorn

Winter now uses `sites/assets/seasons/sandy-winter-gold.webp`, derived with the built-in image-generation tool from the reclining pose. Prompt: “Change ONLY the acorn held between Sandy’s front paws to polished champagne gold, including cap and stem, with metallic highlights. Keep its exact size, angle, position and paw grip. Preserve squirrel identity, expression, fur, scarf, tail, wooden lounger, framing and transparent background. No scenery or added objects.”

`WinterSandy.tsx` reuses the existing GPU renderer and premultiplied CPU fallback. An eight-second regional rig gives her a relaxed head nod, two slow breaths and a fluffy tail sway. The chair and paws are anchored; there is no whole-image rocking or isolated arm stretching. A small occasional glint highlights the actual golden acorn. Complete canvas frames replace the fallback image atomically. Animation pauses outside winter, offscreen and in hidden tabs; reduced-motion users see the gold-acorn still. Tests protect the chair/grip anchors, bound displacement and verify a continuous loop.

## Woodland framing and simplified navigation

The landing header now contains only the Acorra brand and Open app. Its opaque green strip and divider are removed; the forest extends behind it on mobile and desktop. Seasonal shading uses a cooler woodland tone in winter, retaining green for the brand. The story image fills the stage behind a single translucent season panel, combining the caption and all four controls in one readable surface. The scene no longer fades into an empty green band above the controls. Winter Sandy’s position is adjusted to clear the mobile panel.

## Interactive preview response and count-ups

Sandy’s check-in now reveals characters at a readable streaming pace with a temporary caret. Bills and Wealth totals and row amounts count up over 1.25 seconds, ending at the original exact SGD cents. These are presentation-only animations over deterministic synthetic records; no generative-AI claim or record mutation is introduced. Final content reserves the layout space and is exposed once to assistive technology; changing intermediate text is hidden from screen readers. Animation starts when the preview is visible, pauses offscreen and in hidden tabs, and shows completed content immediately for reduced-motion preferences. Switching tabs restarts the relevant preview; completed scenes do not endlessly replay. Tests cover monotonic bounded amounts, exact endpoints and complete text reveal.


### Responsive seasonal timeline

The desktop stage now follows the available viewport height instead of forcing a
650/680px minimum. Short windows use tighter headline, paragraph and action
spacing; narrow landscape windows give the timeline its own bottom row. The
four season buttons retain 44px tap targets and the mobile hero remains unchanged.
Browser checked 1100×670, 1440×720, 1024×768, 820×620, 1366×600,
1920×1080, 1100×500, 700×400, 390×650 and 320×568. All four season
controls fit, with no horizontal overflow or action/timeline overlap; winter's
longer caption was also checked. No financial data or calculations changed.


### Compact public footer

Replaced the oversized navigation grid and decorative wordmark with a small
brand/tagline row, public demo anchor, explicit app entry, copyright and back-to-top.
Internal account, transactions, budgets, wealth, Sandy chat and settings links
are no longer exposed as landing-page footer navigation. App navigation remains
inside the app. Mobile stacks the brand above the two public actions.
