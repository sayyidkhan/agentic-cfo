# Acorra landing direction — 27 October 2026

The hero uses a sculptural brand object as its focal point, oversized editorial typography, and an asymmetric desktop composition. The mobile layout puts the message and call to action first, then the sculpture, then the working finance preview. The existing application, calculations and synthetic-data release lock are preserved.

## References reviewed

- https://stripe.com/ — a clear product proposition against large, dimensional visual work; hierarchy and restrained navigation.
- https://activetheory.net/ — a sculptural focal point, spatial layers and environmental motion.
- https://lusion.co/ — researched its approach to 3D visual storytelling. Its live WebGL hero did not render in the QA browser; no claim of visual inspection of that hero.

These informed the direction; no assets or source were copied from them.

## Brand artwork

Asset: `sites/assets/brand/acorra-sculpture-v1.webp`.

Created with built-in image generation, then encoded as WebP while preserving transparency. It is an original decorative brand illustration, not a financial chart. No paid AI service or runtime AI dependency was added.

Generation prompt:

> Use case: stylized-concept. Asset type: premium personal finance website hero cutout for Acorra. Create an extraordinarily polished photorealistic 3D product sculpture, a large golden acorn with a subtly textured champagne-gold cap and a smooth warm brushed gold seed tapering to a point, sprouting two rich emerald-green leaves with fine gold veins. Acorn floats upright, slightly tilted 10 degrees, within TWO thin elliptical champagne gold metal orbit rings, one diagonally in front and one behind. A tiny emerald sphere sits on one orbit. Below is a low elegant dark forest green circular plinth with a thin gold edge. Studio luxury product photography, exquisite metallic reflections, soft ivory highlights, emerald reflected light, physically credible surfaces, not flat vector, high-fidelity octane/cinema4d rendering. Front three-quarter camera, entire object and all orbit rings fully inside frame with comfortable margin. Strong memorable sculptural silhouette. Transparent background with real alpha, no environment, no floor plane outside plinth, no lettering, no words, no watermark, no dollar signs or coins. Acorn occupies center 55% of frame, surrounding rings within 90%, square composition. Not a logo tile or app icon. Standalone sculpture.

## Motion and delivery

The sculpture is pre-rendered so its finish is consistent on mobile and browsers without WebGL. CSS supplies gentle rigid-object motion; mouse movement supplies restrained perspective. No real-time 3D engine is shipped for this hero. The play/pause button has been removed as requested. OS reduced-motion preferences disable motion, and offscreen/background animation suspension is preserved.

The image is served from a versioned same-origin URL with immutable caching. No third-party image hosts, tracking scripts or fonts are needed. All preview figures still come from the existing deterministic synthetic-data calculations.
