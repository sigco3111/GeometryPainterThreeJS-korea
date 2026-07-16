import * as THREE from 'three';
import { mulberry32, type PaintMode, type StrokeInstance, type SurfaceSample } from './mode';

/**
 * Crystal painting mode. Each stroke seeds clusters of quartz-like points along the painted
 * path: one dominant crystal per cluster surrounded by smaller shards and rubble, all leaning
 * off the surface normal at natural angles. Crystals are transmissive (refractive glass with
 * colored absorption), lightly iridescent, and grow in with an elastic pop as the growth
 * front sweeps along the stroke.
 */

export type CrystalPaletteName = 'Amethyst' | 'Ice' | 'Emerald' | 'Citrine' | 'Rose' | 'Prism';

export interface CrystalSettings {
  palette: CrystalPaletteName;
  clusterDensity: number; // clusters per world unit of stroke
  crystalSize: number;    // height of a cluster's main crystal (world units)
  shards: number;         // secondary crystals per cluster
  spread: number;         // cluster footprint, as a multiple of crystalSize
  tilt: number;           // 0..1 — how far crystals lean away from the surface normal
  sizeJitter: number;     // 0..1 — per-crystal size variation
  glow: number;           // emissive intensity (feeds the bloom pass)
  growthSpeed: number;    // world units of stroke length grown per second
}

export const defaultCrystalSettings: CrystalSettings = {
  palette: 'Amethyst',
  clusterDensity: 7,
  crystalSize: 0.17,
  shards: 7,
  spread: 1.0,
  tilt: 0.4,
  sizeJitter: 0.55,
  glow: 0.3,
  growthSpeed: 1.4,
};

// ---------- palettes ----------

interface Palette {
  base: THREE.Color;        // surface tint
  attenuation: THREE.Color; // color light turns while passing through (the "body" color)
  emissive: THREE.Color;    // faint inner light, amplified by the glow slider + bloom
  hueJitter: number;        // per-crystal hue variation (0..1 of the full wheel)
}

const PALETTES: Record<CrystalPaletteName, Palette> = {
  Amethyst: {
    base: new THREE.Color(0xa878e8),
    attenuation: new THREE.Color(0x7a2fd6),
    emissive: new THREE.Color(0x8a5cff),
    hueJitter: 0.045,
  },
  Ice: {
    base: new THREE.Color(0xcfe8ff),
    attenuation: new THREE.Color(0x5aa6e8),
    emissive: new THREE.Color(0x7fc4ff),
    hueJitter: 0.03,
  },
  Emerald: {
    base: new THREE.Color(0x74e8a0),
    attenuation: new THREE.Color(0x0f9c4a),
    emissive: new THREE.Color(0x3cf58a),
    hueJitter: 0.04,
  },
  Citrine: {
    base: new THREE.Color(0xf5c76a),
    attenuation: new THREE.Color(0xd68a1e),
    emissive: new THREE.Color(0xffb84d),
    hueJitter: 0.035,
  },
  Rose: {
    base: new THREE.Color(0xf5a8c8),
    attenuation: new THREE.Color(0xd6488a),
    emissive: new THREE.Color(0xff7ab8),
    hueJitter: 0.03,
  },
  Prism: {
    base: new THREE.Color(0xe8ecf5),
    attenuation: new THREE.Color(0x9aa8c4),
    emissive: new THREE.Color(0xbCC8ff),
    hueJitter: 1.0, // full rainbow spread per crystal
  },
};

// ---------- shared geometry variants ----------

/**
 * A quartz point: hexagonal prism with jittered facet columns, a slight taper, and an
 * off-axis pyramidal termination. Non-indexed so every facet is flat-shaded — the hard
 * planar faces are what read as "crystal" under an environment map.
 * Normalized to height 1 with the base at y=0.
 */
function makeCrystalGeometry(rnd: () => number): THREE.BufferGeometry {
  const sides = 6;
  const baseR = 0.16 + rnd() * 0.1;
  const shaftH = 0.55 + rnd() * 0.2;   // where the termination starts
  const taper = 0.78 + rnd() * 0.16;   // shaft narrows slightly toward the tip
  const apex = new THREE.Vector3((rnd() - 0.5) * 0.14, 1, (rnd() - 0.5) * 0.14);

  // Jitter each facet column once so the prism edges stay straight top to bottom.
  const angles: number[] = [];
  const radii: number[] = [];
  for (let i = 0; i < sides; i++) {
    angles.push(((i + (rnd() - 0.5) * 0.34) / sides) * Math.PI * 2);
    radii.push(baseR * (0.8 + rnd() * 0.4));
  }

  const lower: THREE.Vector3[] = [];
  const upper: THREE.Vector3[] = [];
  for (let i = 0; i < sides; i++) {
    const c = Math.cos(angles[i]);
    const s = Math.sin(angles[i]);
    lower.push(new THREE.Vector3(c * radii[i], 0, s * radii[i]));
    upper.push(new THREE.Vector3(c * radii[i] * taper, shaftH, s * radii[i] * taper));
  }

  const positions: number[] = [];
  const push = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): void => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  };
  const bottom = new THREE.Vector3(0, -0.02, 0); // tiny below-base apex closes tilted crystals
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides;
    push(lower[i], upper[i], upper[j]); // shaft facet (two tris)
    push(lower[i], upper[j], lower[j]);
    push(upper[i], apex, upper[j]);     // termination facet
    push(lower[j], bottom, lower[i]);   // base cap
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals(); // non-indexed → true flat facets
  return geo;
}

/** A few cached shape variants; instances mix them so no two clusters look stamped. */
const VARIANTS = 5;
let variantGeos: THREE.BufferGeometry[] | null = null;

function getVariantGeometries(): THREE.BufferGeometry[] {
  if (!variantGeos) {
    const rnd = mulberry32(0xc0ffee);
    variantGeos = Array.from({ length: VARIANTS }, () => makeCrystalGeometry(rnd));
  }
  return variantGeos;
}

// ---------- shared materials (one per palette, so glow edits hit every stroke) ----------

const materials = new Map<CrystalPaletteName, THREE.MeshPhysicalMaterial>();

function getMaterial(name: CrystalPaletteName, glow: number): THREE.MeshPhysicalMaterial {
  let mat = materials.get(name);
  if (!mat) {
    const p = PALETTES[name];
    // The palette tint lives in the PER-INSTANCE colors and the colored absorption —
    // the base color stays white. (Tinting both multiplies the tint into itself and
    // the crystals go dark and opaque-looking.)
    mat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.05,
      // Partially transmissive: full transmission over the dark sphere reads as flat
      // black glass. Keeping ~35% diffuse gives facet-by-facet shading (the milky,
      // translucent read of a real amethyst cluster) while the glass depth remains.
      transmission: 0.65,
      ior: 1.55,
      thickness: 0.4,
      attenuationColor: p.attenuation,
      attenuationDistance: 0.6,
      dispersion: 0.25, // chromatic fringing inside the glass — the "gem fire"
      iridescence: 0.4,
      iridescenceIOR: 1.3,
      clearcoat: 0.5,
      clearcoatRoughness: 0.12,
      specularIntensity: 1,
      emissive: p.emissive,
      emissiveIntensity: glow,
      envMapIntensity: 1.6,
    });
    materials.set(name, mat);
  }
  mat.emissiveIntensity = glow;
  return mat;
}

/** Live glow slider: retint every palette material in place — no rebuild. */
export function setCrystalGlow(glow: number): void {
  for (const mat of materials.values()) mat.emissiveIntensity = glow;
}

// ---------- per-stroke instance ----------

interface CrystalInstance {
  variant: number;
  pos: THREE.Vector3;    // anchor-local base position
  quat: THREE.Quaternion;
  scale: THREE.Vector3;  // final (fully grown) non-uniform scale
  birth: number;         // stroke distance at which this crystal starts growing
  color: THREE.Color;
}

const GROW_WINDOW = 0.45;  // stroke-distance span over which one crystal scales in
const _m = new THREE.Matrix4();
const _s = new THREE.Vector3();
const _zero = new THREE.Matrix4().makeScale(0, 0, 0);

/** Elastic-ish pop: overshoots ~8% then settles, like a crystal snapping into being. */
function easeOutBack(t: number): number {
  const c1 = 1.20158;
  const c3 = c1 + 1;
  const u = t - 1;
  return 1 + c3 * u * u * u + c1 * u * u;
}

class CrystalStroke implements StrokeInstance {
  readonly group = new THREE.Group();

  private meshes: THREE.InstancedMesh[] = [];
  private byVariant: CrystalInstance[][];
  private grown = 0;
  private readonly total: number;
  private done = false;

  constructor(samples: SurfaceSample[], seed: number, settings: CrystalSettings) {
    const rnd = mulberry32(seed);
    const instances = this.scatter(samples, rnd, settings);

    // Bucket instances per geometry variant → one InstancedMesh per variant.
    this.byVariant = Array.from({ length: VARIANTS }, () => []);
    for (const inst of instances) this.byVariant[inst.variant].push(inst);

    const geos = getVariantGeometries();
    const mat = getMaterial(settings.palette, settings.glow);
    for (let v = 0; v < VARIANTS; v++) {
      const list = this.byVariant[v];
      const mesh = new THREE.InstancedMesh(geos[v], mat, Math.max(list.length, 1));
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = false; // grows over time; cheap enough to always draw
      for (let i = 0; i < list.length; i++) {
        mesh.setMatrixAt(i, _zero);
        mesh.setColorAt(i, list[i].color);
      }
      mesh.count = list.length;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      this.meshes.push(mesh);
      this.group.add(mesh);
    }

    this.total = this.strokeLength(samples);
  }

  // ----- generation -----

  private strokeLength(samples: SurfaceSample[]): number {
    let d = 0;
    for (let i = 1; i < samples.length; i++) d += samples[i].local.distanceTo(samples[i - 1].local);
    return d;
  }

  /** Walk the stroke and drop a crystal cluster every 1/density world units. */
  private scatter(samples: SurfaceSample[], rnd: () => number, s: CrystalSettings): CrystalInstance[] {
    const out: CrystalInstance[] = [];
    const spacing = 1 / Math.max(s.clusterDensity, 0.25);
    const palette = PALETTES[s.palette];

    let travelled = 0;
    let nextAt = 0;
    for (let i = 0; i < samples.length; i++) {
      if (i > 0) travelled += samples[i].local.distanceTo(samples[i - 1].local);
      if (travelled < nextAt) continue;
      nextAt = travelled + spacing * (0.75 + rnd() * 0.5);
      this.cluster(out, samples[i], travelled, rnd, s, palette);
    }
    return out;
  }

  /** One cluster: a dominant point, a ring of shards, and a dusting of rubble. */
  private cluster(
    out: CrystalInstance[],
    sample: SurfaceSample,
    dist: number,
    rnd: () => number,
    s: CrystalSettings,
    palette: Palette,
  ): void {
    const n = sample.localNormal;
    // Tangent basis for offsetting shards around the main point.
    const t1 = new THREE.Vector3(1, 0, 0);
    if (Math.abs(n.x) > 0.9) t1.set(0, 1, 0);
    t1.cross(n).normalize();
    const t2 = new THREE.Vector3().crossVectors(n, t1);

    const jitter = (base: number): number => base * (1 - s.sizeJitter * 0.5 + rnd() * s.sizeJitter);
    const footprint = s.crystalSize * s.spread;

    const add = (offR: number, height: number, tiltScale: number, birthLag: number): void => {
      const az = rnd() * Math.PI * 2;
      const off = new THREE.Vector3()
        .addScaledVector(t1, Math.cos(az) * offR)
        .addScaledVector(t2, Math.sin(az) * offR);

      // Lean direction: surface normal tipped by a random angle around a random azimuth.
      const lean = s.tilt * tiltScale * (0.25 + rnd() * 0.75) * 0.9; // radians-ish, capped < ~52°
      const la = rnd() * Math.PI * 2;
      const dir = new THREE.Vector3()
        .copy(n)
        .multiplyScalar(Math.cos(lean))
        .addScaledVector(t1, Math.cos(la) * Math.sin(lean))
        .addScaledVector(t2, Math.sin(la) * Math.sin(lean))
        .normalize();

      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      const spin = new THREE.Quaternion().setFromAxisAngle(dir, rnd() * Math.PI * 2);
      spin.multiply(quat);

      const h = jitter(height);
      const w = h * (0.8 + rnd() * 0.45); // width varies independently → chunky vs needle mix

      // Sink the base slightly so crystals sit rooted in the curved surface, never hovering.
      const pos = sample.local.clone().add(off).addScaledVector(n, -0.05 * h);

      const color = new THREE.Color().copy(palette.base);
      const hsl = { h: 0, s: 0, l: 0 };
      color.getHSL(hsl);
      color.setHSL(
        (hsl.h + (rnd() - 0.5) * palette.hueJitter + 1) % 1,
        THREE.MathUtils.clamp(hsl.s * (1.15 + rnd() * 0.35), 0, 1),
        THREE.MathUtils.clamp(hsl.l * (0.8 + rnd() * 0.45), 0, 1),
      );

      out.push({
        variant: Math.floor(rnd() * VARIANTS),
        pos,
        quat: spin,
        scale: new THREE.Vector3(w, h, w),
        birth: dist + birthLag + rnd() * 0.12,
        color,
      });
    };

    // Dominant point — tallest, most upright, born first.
    add(footprint * 0.15 * rnd(), s.crystalSize * (1.1 + rnd() * 0.5), 0.55, 0);
    // Shards — the supporting ring.
    const shards = Math.round(s.shards * (0.7 + rnd() * 0.6));
    for (let k = 0; k < shards; k++) {
      add(footprint * (0.25 + rnd() * 0.75), s.crystalSize * (0.35 + rnd() * 0.4), 1, 0.05 + rnd() * 0.1);
    }
    // Rubble — tiny chips at the skirt that ground the cluster visually.
    const rubble = 2 + Math.floor(rnd() * 3);
    for (let k = 0; k < rubble; k++) {
      add(footprint * (0.6 + rnd() * 0.7), s.crystalSize * (0.12 + rnd() * 0.12), 1.3, 0.12 + rnd() * 0.15);
    }
  }

  // ----- StrokeInstance -----

  update(dt: number, _time: number): void {
    if (this.done) return;
    this.grown += dt * this.speed;
    this.pose();
  }

  /** Growth speed is captured at build time via setSpeed (settings snapshot). */
  private speed = defaultCrystalSettings.growthSpeed;
  setSpeed(v: number): void {
    this.speed = v;
  }

  finishGrowth(): void {
    this.grown = this.total + GROW_WINDOW + 1;
    this.pose();
  }

  /** Recompose matrices for crystals inside the growth window; freeze once all are grown. */
  private pose(): void {
    let allDone = this.grown >= this.total + GROW_WINDOW + 0.3;
    for (let v = 0; v < VARIANTS; v++) {
      const list = this.byVariant[v];
      const mesh = this.meshes[v];
      let dirty = false;
      for (let i = 0; i < list.length; i++) {
        const inst = list[i];
        const t = (this.grown - inst.birth) / GROW_WINDOW;
        if (t <= 0) {
          allDone = false;
          continue; // still unborn — matrix stays zero
        }
        const k = t >= 1 ? 1 : easeOutBack(t);
        if (t < 1.2) {
          // Crystals emerge slightly narrower than tall, then relax — reads as mineral growth.
          _s.set(inst.scale.x * k * (0.6 + 0.4 * k), inst.scale.y * k, inst.scale.z * k * (0.6 + 0.4 * k));
          _m.compose(inst.pos, inst.quat, _s);
          mesh.setMatrixAt(i, _m);
          dirty = true;
          if (t < 1) allDone = false;
        }
      }
      if (dirty) mesh.instanceMatrix.needsUpdate = true;
    }
    if (allDone) this.done = true;
  }

  dispose(): void {
    this.group.removeFromParent();
    for (const mesh of this.meshes) mesh.dispose(); // instanced buffers only; geo + mat are shared
  }
}

// ---------- the mode ----------

export const crystalMode: PaintMode<CrystalSettings> = {
  id: 'Crystals',
  createStroke(samples, seed, settings): StrokeInstance {
    const stroke = new CrystalStroke(samples, seed, settings);
    stroke.setSpeed(settings.growthSpeed);
    return stroke;
  },
};
