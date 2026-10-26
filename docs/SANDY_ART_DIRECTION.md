# Sandy — rendered character direction

Sandy is Acorra’s empathetic squirrel companion. This revision replaces the rejected primitive 3D rig with original rendered character artwork, preserving all seven states and the Settings reference library.

## Visual identity

- Warm cinnamon and caramel fur with a cream muzzle and belly.
- Expressive hazel eyes, short squirrel muzzle, small tufted ears and discreet front teeth.
- A large fluffy plume tail with an S-shaped curl; no tubular or ring-shaped tail.
- Forest-green neckerchief with a champagne-gold acorn clasp.
- Soft studio lighting, detailed groomed fur, friendly cinematic 3D rendering.
- Transparent background; consistent square framing, camera angle and proportions.

## Asset inventory

The optimized production images are in `sites/assets/sandy/`: `curious.webp`, `calm.webp`, `watchful.webp`, `concerned.webp`, `screaming.webp`, `celebrating.webp`, `relieved.webp`. The built-in image-generation tool created the artwork without custom API credentials. PNG outputs were converted to 800×800 WebP for delivery while preserving transparency.

## Generation prompts

Base character prompt:

> Design Sandy, an original lovable squirrel for Acorra, a premium friendly personal-finance app. High quality 3D animated-film character craftsmanship. Full body isolated on transparent background, square framing, entire huge fluffy S-shaped tail, ears and feet visible. Warm cinnamon and caramel fur, soft cream muzzle and belly, delicate groomed fur, large dark hazel eyes with catchlights, small dark brown nose, rounded cheeks, short squirrel muzzle, two tiny front teeth. Small rounded tufted ears, not rabbit ears. A glorious soft plume tail curving beside the body, not a ring or tube. Appealing pear-shaped proportions, moderately large head, nimble hands, substantial hind feet. Forest green neckerchief and discreet champagne-gold acorn clasp. Slight three-quarter front view, eye-level camera, warm soft studio lighting, subtle rim light. Curious mood: slight head tilt, raised eyebrow, inquisitive half-smile, holding an acorn at chest with both paws. Warm, intelligent, empathetic companion for adults. No text, labels, watermarks, logos, environment or pedestal. No plastic low-poly surfaces or giant teeth.

For every variant, the base image is supplied as an identity reference. Preserve the same squirrel’s face, fur, eyes, muzzle, ears, tail, scarf, clasp, lighting, camera and scale. Change only expression and pose. All variants use a transparent background and contain no text or added characters.

| State | Expression and pose prompt |
| --- | --- |
| Curious | Slight head tilt, one raised eyebrow, inquisitive half-smile, both paws holding acorn at chest. |
| Calm | Gently closed smiling eyes, relaxed upright posture, subtle confident smile, paws holding acorn at waist. |
| Watchful | Open attentive eyes, one eyebrow raised, thoughtful closed mouth, one paw at chin and the other holding acorn. Helpful, not angry. |
| Concerned | Raised inner brows, gently worried eyes, slightly downturned mouth, one paw on cheek, other holding acorn. No tears or despair. |
| Screaming | Comedic marmot-inspired alarm; upright head, very wide eyes with smaller pupils, tall oval open mouth, two little upper teeth, both paws against cheeks, startled stance. Funny, not terrifying. No acorn in hands. |
| Celebrating | Both arms raised, one paw holding acorn high, smiling eyes, delighted open grin with tiny teeth. No added confetti. |
| Relieved | Softly closed eyes, relaxed brows, gentle smile, lowered shoulders, one paw on chest and other holding acorn near belly. |

## Motion and limits

The selected artwork now uses a calibrated 2D deformation rig. Each mood has an authored sequence of anticipation, gesture, hold, follow-through and rest. Head tilts, tail swishes, breathing and paw movement have stronger amplitudes and are coordinated with delayed tail follow-through; eye geometry retains its original shape. Blinks use cached eyelid texture from Calm Sandy, registered and feathered over each open eye before posing the head. Upper/lower reveal masks close and reopen roughly every six seconds, with a guaranteed closed pose when rendering drops frames; no pupil or eye geometry is squeezed. Calm and Relieved retain their original closed eyes. Synthetic compression and drawn eyelash strokes remain disabled. Thumbnails remain still. Larger chat/account avatars share the animation. The artwork is not a skeletal 3D model. The alarm reaction settles quickly; celebration has two small hops followed by rest. Exact head rotations preserve face shape, and floating-point displacement removes subpixel stepping. Pause/resume retains the current pose; replay starts the sequence again. Movements remain gentle and silent. Pause preference is browser-local; reduced-motion settings suppress animation and restore the static artwork. Frames are drawn fully into an offscreen bitmap and presented on one persistent canvas; artwork is decoded once, and no image/filter URLs are changed per frame. Offscreen/background animations stop drawing, and observers/frame callbacks are cleaned up on navigation. Automatic selection based on real finances is not enabled.
