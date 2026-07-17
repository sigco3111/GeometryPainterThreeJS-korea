import GUI from 'lil-gui';
import type { App, ModeName } from './app';
import type { CrystalPaletteName } from './modes/crystals';

export function buildGui(app: App): GUI {
  const gui = new GUI({ title: 'Geometry Painter' });
  const s = app.settings;
  const c = app.crystal;

  // Crystal edits update existing strokes IN PLACE (no regeneration) — matrices and
  // colors recompose on the live instanced meshes as you drag.
  const live = () => app.updateCrystals();

  gui.add(s, 'mode', ['Crystals'] satisfies ModeName[]).name('Painting mode');

  const fDraw = gui.addFolder('Drawing');
  fDraw.add(s, 'drawMode').name('Paint mode (D)').listen().onChange(() => app.applyModes());
  fDraw.add({ undo: () => app.undoLast() }, 'undo').name('Undo last stroke');
  fDraw.add({ clear: () => app.clearAll() }, 'clear').name('Clear all');

  const fCrystal = gui.addFolder('Crystals (live)');
  const palettes: CrystalPaletteName[] = ['Amethyst', 'Ice', 'Emerald', 'Citrine', 'Rose', 'Prism'];
  fCrystal.add(c, 'palette', palettes).name('Palette').onChange(live);
  fCrystal.add(c, 'clusterDensity', 1, 16).name('Clusters / unit').onChange(live);
  fCrystal.add(c, 'crystalSize', 0.06, 0.4).name('Crystal size').onChange(live);
  fCrystal.add(c, 'shards', 0, 16, 1).name('Shards / cluster').onChange(live);
  fCrystal.add(c, 'spread', 0.3, 2.5).name('Cluster spread').onChange(live);
  fCrystal.add(c, 'tilt', 0, 1).name('Lean / wildness').onChange(live);
  fCrystal.add(c, 'sizeJitter', 0, 1).name('Size variety').onChange(live);
  fCrystal.add(c, 'clearMix', 0, 1).name('Clear crystal mix').onChange(live);
  // Glow retints shared materials in place — instant, no regrow.
  fCrystal.add(c, 'glow', 0, 2).name('Inner glow').onChange((v: number) => app.setGlow(v));

  const fLook = gui.addFolder('Light & look (live)');
  fLook.add(s, 'exposure', 0.4, 2.2).name('Exposure').onChange((v: number) => app.setExposure(v));
  fLook.add(s, 'envIntensity', 0, 2.5).name('Studio light').onChange((v: number) => app.setEnvIntensity(v));
  fLook.add(s, 'backlight', 0, 2.5).name('Backlight').onChange((v: number) => app.setBacklight(v));
  fLook.add(s, 'bloomStrength', 0, 1.5).name('Bloom').onChange((v: number) => app.setBloomStrength(v));
  fLook.add(s, 'bloomThreshold', 0.2, 1.5).name('Bloom threshold').onChange((v: number) => app.setBloomThreshold(v));
  // Reseeding genuinely regenerates (new randoms), so it goes through the rebuild path.
  fLook.add(s, 'seed', 0, 999, 1).name('Seed').onChange(() => app.scheduleRegrow('instant'));

  const fGrowth = gui.addFolder('Growth animation');
  fGrowth.add(c, 'growthSpeed', 0.2, 4).name('Speed').onChange(live);
  fGrowth.add({ replay: () => app.scheduleRegrow('animate') }, 'replay').name('▶ Replay growth');

  return gui;
}
