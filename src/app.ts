import * as THREE from 'three/webgpu';
import { pass } from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { indexForRaycasts } from './bvh';
import { SurfacePainter } from './surfacePainter';
import type { PaintMode, StrokeInstance, SurfaceSample } from './modes/mode';
import {
  crystalMode,
  defaultCrystalSettings,
  setCrystalGlow,
  type CrystalSettings,
} from './modes/crystals';
import { buildGui } from './ui';

export type ModeName = 'Crystals';

const GROUND_Y = -1.55; // the floor the sphere floats above

interface Stroke {
  samples: SurfaceSample[];
  index: number;    // stable per-stroke id; combined with the global seed to vary each stroke
  mode: ModeName;   // which painting mode authored it (strokes rebuild through their own mode)
}

/** Everything the GUI edits. Mode-specific settings live in their own sub-objects. */
export interface AppSettings {
  mode: ModeName;
  drawMode: boolean;
  seed: number;
  exposure: number;
  envIntensity: number;
  bloomStrength: number;
  bloomThreshold: number;
}

export class App {
  readonly settings: AppSettings = {
    mode: 'Crystals',
    drawMode: true,
    seed: 1,
    exposure: 1.15,
    envIntensity: 1.0,
    bloomStrength: 0.35,
    bloomThreshold: 0.8,
  };

  readonly crystal: CrystalSettings = { ...defaultCrystalSettings };

  /** Registry of painting modes — new modes plug in here. */
  private modes: Record<ModeName, PaintMode<CrystalSettings>> = {
    Crystals: crystalMode,
  };

  private renderer!: THREE.WebGPURenderer;
  private post!: THREE.PostProcessing;
  private bloomNode!: ReturnType<typeof bloom>;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  private controls!: OrbitControls;
  private painter!: SurfacePainter;

  /** The floating canvas: sphere + everything painted on it bob and turn together. */
  private floatRoot = new THREE.Group();
  private sphere!: THREE.Mesh;
  private paintRoot = new THREE.Group(); // strokes parent here (child of floatRoot)

  private strokes: Stroke[] = [];
  private live: StrokeInstance[] = [];
  private strokeCounter = 0;

  private dust!: THREE.Points;
  private dustVel: number[] = [];

  private hud = document.getElementById('hud')!;
  private lastTime = 0;
  private hovering = false;
  private toastTimer = 0;
  private regrowPending: { mode: 'instant' | 'animate' } | null = null;
  private lastRegrowAt = 0;
  private regrowCost = 0;

  constructor(private container: HTMLElement) {}

  async start(): Promise<void> {
    const renderer = new THREE.WebGPURenderer({ antialias: true });
    await renderer.init();
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = this.settings.exposure;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(renderer.domElement);
    this.renderer = renderer;

    this.scene.background = new THREE.Color(0x0a0b10);
    this.scene.fog = new THREE.Fog(0x0a0b10, 9, 22);
    this.camera.position.set(2.7, 1.15, 3.3);

    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 1.6;
    this.controls.maxDistance = 10;
    this.controls.target.set(0, -0.05, 0);
    // Keep the camera above the horizon so you can't tumble under the floor.
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02;

    this.setupEnvironment();
    this.setupLights();
    this.setupCanvasSphere();
    this.setupDust();
    this.setupPost();

    this.painter = new SurfacePainter(
      renderer.domElement,
      this.camera,
      this.scene,
      () => [this.sphere],
      this.floatRoot,
    );
    this.painter.onStroke = (samples) => this.addStroke(samples);
    this.painter.onActiveChange = (active) => {
      this.controls.enabled = !active;
    };
    this.painter.onHoverChange = (over) => {
      this.hovering = over;
      this.updateHud();
    };

    buildGui(this);
    this.applyModes();

    document.getElementById('modeBtn')!.addEventListener('click', () => this.toggleMode());
    window.addEventListener('keydown', (e) => {
      if (e.repeat || e.target instanceof HTMLInputElement) return;
      if (e.key.toLowerCase() === 'd') this.toggleMode();
    });

    window.addEventListener('resize', this.onResize);
    this.onResize();

    renderer.setAnimationLoop((t) => this.tick(t));
  }

  // ---------- environment: a dark studio captured into a PMREM env map ----------

  /**
   * The "perfect light set" starts here: crystals and the lacquered sphere are mostly
   * REFLECTION, so what matters most is what there is to reflect. We build a black studio
   * with a huge overhead softbox, a cool strip camera-left, a warm strip camera-right and a
   * violet wash behind — classic three-point product lighting — and prefilter it into the
   * environment map. Every glossy highlight in the scene is one of these shapes.
   */
  private setupEnvironment(): void {
    const env = new THREE.Scene();
    const geo = new THREE.PlaneGeometry(1, 1);

    const panel = (
      color: number,
      intensity: number,
      w: number,
      h: number,
      pos: [number, number, number],
    ): void => {
      const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
      mat.color.set(color).multiplyScalar(intensity); // HDR: >1 colors become light sources
      const m = new THREE.Mesh(geo, mat);
      m.scale.set(w, h, 1);
      m.position.set(...pos);
      m.lookAt(0, 0, 0);
      env.add(m);
    };

    panel(0xffffff, 16, 7, 4.5, [0, 8, 0]);      // overhead softbox — the big soft key
    panel(0x9db8ff, 6, 1.4, 7, [-7, 2, -2]);     // cool strip, camera-left
    panel(0xffd9b0, 4.5, 1.8, 5, [6, 1.5, 3]);   // warm strip, camera-right
    panel(0xa070ff, 2.6, 6, 3, [0, 2.5, -8]);    // violet wash behind the subject
    panel(0x2e3c58, 1.4, 9, 9, [0, -5, 0]);      // dim floor bounce

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(env, 0.04).texture;
    this.scene.environmentIntensity = this.settings.envIntensity;
    pmrem.dispose();
    geo.dispose();
  }

  private setupLights(): void {
    // Analytic lights carry the shadows and shading gradients; the env map carries the look.
    const hemi = new THREE.HemisphereLight(0xbdd0ff, 0x1a1622, 0.25);

    const key = new THREE.DirectionalLight(0xfff0e0, 2.6);
    key.position.set(3.5, 6, 2.5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.camera.left = key.shadow.camera.bottom = -4;
    key.shadow.camera.right = key.shadow.camera.top = 4;
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.02;
    key.shadow.radius = 6; // soft penumbra under the floating sphere

    const rim = new THREE.DirectionalLight(0x7f9dff, 1.1);
    rim.position.set(-4, 2.5, -4);

    // Faint violet underglow: lifts the sphere's shadowed underside off the floor,
    // selling the "floating" read.
    const under = new THREE.PointLight(0x6a4bd6, 0.5, 6, 1.6);
    under.position.set(0, GROUND_Y + 0.25, 0);

    // The floor: near-black satin with a soft radial sheen, mostly there to catch the
    // sphere's soft shadow and the crystals' colored bounce.
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(14, 64),
      new THREE.MeshPhysicalMaterial({
        map: makeFloorTexture(),
        color: 0xffffff,
        roughness: 0.95,
        metalness: 0,
        // The grey wash on a dark floor is SPECULAR (the huge overhead softbox reflected
        // by a rough surface), not albedo — so dim both specular paths hard.
        specularIntensity: 0.15,
        envMapIntensity: 0.15,
      }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = GROUND_Y;
    ground.receiveShadow = true;

    this.scene.add(hemi, key, rim, under, ground);
  }

  /** The canvas itself: a lacquered obsidian sphere, hovering and slowly turning. */
  private setupCanvasSphere(): void {
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x23262f,
      metalness: 0.12,
      roughness: 0.34,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      sheen: 0.25,
      sheenColor: new THREE.Color(0x5a6bb0),
      sheenRoughness: 0.6,
      envMapIntensity: 1.1,
    });
    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), mat);
    this.sphere.castShadow = true;
    this.sphere.receiveShadow = true;

    this.floatRoot.add(this.sphere, this.paintRoot);
    this.scene.add(this.floatRoot);
    indexForRaycasts(this.floatRoot);
  }

  /** A whisper of drifting dust — depth cue and atmosphere, kept deliberately subtle. */
  private setupDust(): void {
    const N = 320;
    const positions = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 1.9 + Math.random() * 4.5;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = GROUND_Y + 0.1 + Math.random() * 4.2;
      positions[i * 3 + 2] = Math.sin(a) * r;
      this.dustVel.push(0.02 + Math.random() * 0.05);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.dust = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0x9db4e8,
        size: 0.02,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    );
    this.dust.frustumCulled = false;
    this.scene.add(this.dust);
  }

  /** Post: MSAA scene pass + bloom, tone-mapped on output. Bloom is what makes glow glow. */
  private setupPost(): void {
    const scenePass = pass(this.scene, this.camera, { samples: 4 });
    const color = scenePass.getTextureNode();
    this.bloomNode = bloom(color, this.settings.bloomStrength, 0.55, this.settings.bloomThreshold);
    this.post = new THREE.PostProcessing(this.renderer);
    this.post.outputNode = color.add(this.bloomNode);
  }

  // ---------- strokes ----------

  addStroke(samples: SurfaceSample[]): void {
    const stroke: Stroke = { samples, index: this.strokeCounter++, mode: this.settings.mode };
    this.strokes.push(stroke);
    this.buildStroke(stroke, true);
    this.showToast('💎 crystals seeded — watch them grow');
  }

  private buildStroke(stroke: Stroke, animate: boolean): void {
    const seed = this.effectiveSeed(stroke.index);
    const instance = this.modes[stroke.mode].createStroke(stroke.samples, seed, { ...this.crystal });
    this.paintRoot.add(instance.group);
    this.live.push(instance);
    if (!animate) instance.finishGrowth();
  }

  private regrow(animate: boolean): void {
    for (const s of this.live) s.dispose();
    this.live = [];
    for (const stroke of this.strokes) this.buildStroke(stroke, animate);
  }

  /**
   * Ask for a rebuild. Requests are coalesced and throttled in the tick (slider drags fire
   * onChange dozens of times a second). 'instant' snaps to fully grown; 'animate' replays
   * the crystal growth.
   */
  scheduleRegrow(mode: 'instant' | 'animate'): void {
    if (this.regrowPending?.mode === 'animate') return; // an animate request always wins
    this.regrowPending = { mode };
  }

  randomizeSeed(): void {
    this.settings.seed = Math.floor(Math.random() * 1000);
    this.scheduleRegrow('instant');
  }

  undoLast(): void {
    this.strokes.pop();
    const s = this.live.pop();
    s?.dispose();
  }

  clearAll(): void {
    for (const s of this.live) s.dispose();
    this.live = [];
    this.strokes = [];
    this.regrowPending = null;
  }

  /** Mix the global seed with a stroke's stable id so strokes stay distinct but reseed together. */
  private effectiveSeed(index: number): number {
    return ((this.settings.seed * 2654435761) ^ (index * 40503 + 1)) >>> 0;
  }

  // ---------- live (no-rebuild) setting paths ----------

  setGlow(v: number): void {
    this.crystal.glow = v;
    setCrystalGlow(v);
  }

  setExposure(v: number): void {
    this.settings.exposure = v;
    this.renderer.toneMappingExposure = v;
  }

  setEnvIntensity(v: number): void {
    this.settings.envIntensity = v;
    this.scene.environmentIntensity = v;
  }

  setBloomStrength(v: number): void {
    this.settings.bloomStrength = v;
    this.bloomNode.strength.value = v;
  }

  setBloomThreshold(v: number): void {
    this.settings.bloomThreshold = v;
    this.bloomNode.threshold.value = v;
  }

  // ---------- modes / hud ----------

  toggleMode(): void {
    this.settings.drawMode = !this.settings.drawMode;
    this.applyModes();
  }

  applyModes(): void {
    const draw = this.settings.drawMode;
    this.painter.setEnabled(draw);
    this.controls.enableRotate = !draw;
    document.body.classList.toggle('draw', draw);
    document.body.classList.toggle('orbit', !draw);

    const btn = document.getElementById('modeBtn')!;
    btn.querySelector('.label')!.textContent = draw ? 'Paint mode' : 'Orbit mode';

    if (!draw) this.hovering = false;
    this.updateHud();
  }

  private updateHud(): void {
    const backend = (this.renderer.backend as { isWebGPUBackend?: boolean }).isWebGPUBackend
      ? 'WebGPU'
      : 'WebGL2 (fallback)';
    let mode: string;
    if (this.settings.drawMode) {
      mode = this.hovering
        ? '<b>Drag now</b> to paint a crystal vein across the sphere — it grows when you let go.'
        : 'Move over the sphere, then <b>drag</b> to paint a crystal vein. Press <b>D</b> to orbit.';
    } else {
      mode = '<b>Orbit mode</b> — drag to rotate, scroll to zoom, right-drag to pan. ' +
        'Press <b>D</b> to paint crystals.';
    }
    this.hud.innerHTML = `${mode}<div class="sub">Mode: ${this.settings.mode} · Renderer: ${backend}</div>`;
  }

  private showToast(msg: string): void {
    const el = document.getElementById('toast')!;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => el.classList.remove('show'), 1800);
  }

  // ---------- frame loop ----------

  private onResize = (): void => {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private tick(time: number): void {
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;
    const tSec = time / 1000;

    if (this.regrowPending) {
      // Adaptive throttle: the heavier the last rebuild, the longer we wait before the
      // next one, so slider drags stay smooth whatever the scene costs.
      const now = performance.now();
      const interval = this.regrowPending.mode === 'animate'
        ? 0
        : THREE.MathUtils.clamp(this.regrowCost * 3, 60, 400);
      if (now - this.lastRegrowAt >= interval) {
        const req = this.regrowPending;
        this.regrowPending = null;
        const t0 = performance.now();
        this.regrow(req.mode === 'animate');
        this.regrowCost = performance.now() - t0;
        this.lastRegrowAt = performance.now();
      }
    }

    // Dust drifts upward and wraps.
    const posAttr = this.dust.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < this.dustVel.length; i++) {
      arr[i * 3 + 1] += this.dustVel[i] * dt;
      if (arr[i * 3 + 1] > GROUND_Y + 4.4) arr[i * 3 + 1] = GROUND_Y + 0.1;
    }
    posAttr.needsUpdate = true;

    this.controls.update();
    this.painter.update(dt);
    for (const s of this.live) s.update(dt, tSec);

    this.post.render();
  }
}

/** Near-black satin floor with a soft radial sheen — a quiet stage for the sphere's shadow. */
function makeFloorTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, '#0f1118');
  g.addColorStop(0.45, '#0b0c12');
  g.addColorStop(1, '#08090d');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
