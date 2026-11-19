# Sandy — rendered character direction (beaver)

Sandy is Acorra’s calm, capable beaver companion. This revision replaces the earlier squirrel artwork, keeping all seven states, the greeting, the seasonal hero poses and the Settings reference library.

## Visual identity

- Adult anthropomorphic beaver, upright on two legs; stocky pear-shaped body.
- Rich chestnut fur, darker walnut back and limbs, cream-tan muzzle, chin and chest.
- Broad blunt muzzle, wide dark nose, small round ears set low, warm hazel-brown eyes.
- Two bold orange-amber front teeth, visible even with the mouth closed.
- Large flat paddle tail in dark charcoal-brown with a stylised crosshatch, always visible in the outline.
- Honey-brown leather tool belt with a carved wooden acorn buckle. No apron and no neckerchief.
- Friendly 3D animated-film rendering, soft studio light, transparent background, consistent square framing.

Avoid: bushy tails, ear tufts, squirrel poses with an acorn held at the chest, a green apron, wide startled eyes as the default.

## Asset inventory

| File | Size | Pose |
| --- | --- | --- |
| `sites/assets/sandy/curious.webp` | 800×800 | Head tilt, leafy twig at its side |
| `sites/assets/sandy/calm.webp` | 800×800 | Eyes closed, paws on belt (also the eyelid source for blinks) |
| `sites/assets/sandy/watchful.webp` | 800×800 | Paw at chin, one brow raised |
| `sites/assets/sandy/concerned.webp` | 800×800 | Paw on cheek, worried brows |
| `sites/assets/sandy/screaming.webp` | 800×800 | Paws on cheeks, comedic alarm |
| `sites/assets/sandy/celebrating.webp` | 800×800 | Arms up, twig held high, eyes closed |
| `sites/assets/sandy/relieved.webp` | 800×800 | Eyes closed, paw on chest |
| `sites/assets/sandy/greeting.webp` | 800×800 | Waving hello |
| `sites/assets/seasons/sandy-carry.webp` | 800×800 | Walking with a bundle of sticks |
| `sites/assets/seasons/sandy-stash.webp` | 1254×1254 | Crouching, adding a stick to a stack |
| `sites/assets/seasons/sandy-winter-rest.webp` | 1254×1254 | Reclining on a lounger, eyes closed |
| `sites/assets/seasons/sandy-winter-gold.webp` | 1254×1254 | Reclining, holding a gold acorn |

The four seasonal backgrounds are unchanged. In the seasonal hero the stash drawn in code is now six cut sticks that stack into a small lodge (`Stick` in `sites/src/SeasonalHero.tsx`).

## How the artwork was made

1. Identity sheet (front, back, portrait) generated with Seedream 5.5 on Higgsfield (job `3707f4ac-d5ae-449a-a73c-674dfea2dbe6`).
2. Each pose generated with GPT Image 2.6 on Higgsfield (1:1, high quality, transparent background) with the sheet attached as the identity reference, then resized to the sizes above and saved as WebP (quality 88).

Shared prompt (add one POSE line per state):

> The same beaver character as the attached character sheet (use it only for identity: face, chestnut fur, cream-tan muzzle, bold orange-amber front teeth, small round low ears, dark webbed feet, large flat crosshatched paddle tail). Outfit change: no apron at all; it wears only a honey-brown leather tool belt at the waist with a small carved wooden acorn buckle. Stylized 3D animated-film character, soft studio light, warm key from upper left, gentle rim light, fur in large soft groomed clumps. Full body, the whole flat paddle tail visible and angled out to the viewer's left so it shows in the outline, centred in a square frame with small even margins, slight three-quarter front view, eye-level camera. Transparent background, no ground, no shadow, no text.

## Motion calibration

The deformation rig, painted blink and greeting wave are unchanged in behaviour; only their landmarks were re-measured on the beaver artwork (fractions of the 800px image):

- `sites/src/sandy_blink.ts`: eye centres, radii and tilt per open-eyed pose; closed lids sampled from Calm. Celebrating, Calm and Relieved are painted with closed eyes and do not blink.
- `sites/src/sandy_motion.ts`: neck pivot per mood, head region down to the chin, tail region lower left with its root at (0.30, 0.76), belly breathing above the belt.
- `sites/src/winter_motion.ts`: head, paddle tail and belly regions on the lounger pose; lounger and gold-acorn paws stay anchored.
- `sites/src/SandyGreeting.tsx` and `style.css`: forearm cut-out and elbow pivot for the wave.
- `sites/src/SandyExpression.tsx`: vector beaver fallback if the artwork cannot load.

Tests in `sites/tests.mjs` use the same landmarks. If artwork is regenerated, re-measure these points first.
