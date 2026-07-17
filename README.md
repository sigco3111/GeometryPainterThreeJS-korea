# 💎 Geometry Painter — three.js WebGPU

Paint geometry directly onto a hyper-real floating sphere. Drag a stroke across the
surface and watch it come alive — the first painting mode grows **crystal veins**:
clusters of refractive quartz points that pop out of the surface along your stroke.

Built on the same surface-painting foundation as
[VegetationGeneratorThreeJS](../VegetationGeneratorThreeJS), redesigned around an
extensible **mode system** — every painting mode consumes the same strokes and returns a
living instance the app grows, animates, undoes and rebuilds uniformly. More modes
(coral, circuitry, feathers, …) plug in without touching the painting plumbing.

## Modes

- **Crystals** — transmissive, iridescent quartz clusters with colored absorption and
  dispersion, six palettes (Amethyst, Ice, Emerald, Citrine, Rose, Prism), a live
  clear-quartz mix, elastic growth animation.
- **Molten fissures** — strokes tear glowing cracks into the surface: a TSL-shaded
  blackbody core with traveling heat pulses and a white-hot propagation front,
  lightning-like side branches (live density/length controls), basalt rock lips, rising
  embers, and flickering orange light spill. Crossing fissures blend additively into
  hotter junctions.
- _more coming…_

## The look

- **WebGPU renderer** (WebGL2 fallback), ACES filmic tone mapping, MSAA post pipeline.
- **Custom studio environment**: a black room with an HDR overhead softbox, cool/warm
  side strips and a violet back wash, prefiltered into the environment map — every
  highlight on the lacquered sphere and the crystals is one of these shapes.
- **Soft-shadow key light**, cool rim, violet underglow lifting the sphere off the floor.
- **Bloom** on the crystals' inner glow, drifting dust motes, slow floating bob.

## Controls

| Input | Action |
| --- | --- |
| **Drag** (paint mode) | Paint a crystal vein on the sphere |
| **D** / mode pill | Toggle paint ↔ orbit |
| Drag / scroll (orbit) | Rotate / zoom |
| GUI | Palette, density, size, lean, glow, lighting, bloom, seed, replay growth |

## Run

```bash
npm install
npm run dev
```

Requires a browser with WebGPU (recent Chrome/Edge) — falls back to WebGL2.
