import { writeFileSync } from 'node:fs';
import * as k from './anatomy-kit/iso-kit.mjs';
import * as G from './anatomy-kit/lathe.mjs';
import * as A from './anatomy-kit/audit.mjs';

// World units approximate millimeters. A 112 mm bell on a 184 × 166 mm plinth.
// Parts: 12 foot components, 3 plinth layers, 8 corner fixings, 4 bell-base
// components, dome, 2 guide collars, shaft, 3 button parts, 2 plaque layers,
// and 4 plaque fixings: 40 physical parts. Texture belongs to those surfaces.
const PLAN = { x: -92, y: -78, w: 184, d: 166, r: 8 };
const P = k.fitProjection([...k.boxCorners(PLAN, 0, 23), [0, -9, 111]], 600, 400, { pad: 58, azimuth: 42, elevation: 27 });
const F = G.frameAlong([0, -9, 0], [0, 0, 1]);
const R = A.recorder(P);
const items = [];
function add(name, paths, shape, material, extra = '', moving = false) {
  const svg = k.solidSvg(paths, { tone: 'mid', crease: 'faint', inner: extra });
  const item = R.put({ name, piece: moving ? 'plunger' : 'fixed', move: moving ? [0, 0, -4] : [0, 0, 0], at: [0, 0, 0], svg, shapes: [R.solid(shape)] });
  Object.assign(item, { paths, material, extra, moving });
  items.push(item);
}
function slab(name, plan, z, h, material, extra = '', ground = false) {
  add(name, k.slabOf(plan, z, h, P, 8, .65), A.slab(plan, z, h, { name, ground }), material, extra);
}
function disc(name, x, y, r, z, h, material, extra = '') {
  const frame = G.frameAlong([x, y, 0], [0, 0, 1]);
  add(name, G.disc(z, z+h, r, frame, P), A.disc(frame, z, z+h, r, { name, ground: z === 0 }), material, extra);
}
const line = d => k.lineSvg(d, { tone: 'faint' });
for (const [i, [x, y]] of k.corners(PLAN, 18).entries()) {
  disc(`foot.${i}.rubber`, x, y, 7, 0, 2.5, 'rubber');
  disc(`foot.${i}.cup`, x, y, 6.5, 2.5, 2.5, 'dark');
  disc(`foot.${i}.washer`, x, y, 7, 5, 1, 'brass');
}
slab('plinth.lower-bead', PLAN, 6, 2, 'wood');
slab('plinth.walnut', k.insetPlan(PLAN, 1), 8, 13, 'wood', line(k.sideSeam(k.insetPlan(PLAN, 1), 11, P, 8)));
const topPlan = k.insetPlan(PLAN, .4);
let grain = '';
for (let y = -64; y <= 74; y += 5.3) {
  grain += line(k.lineOnTop([topPlan.x, y], [topPlan.x + topPlan.w, y], 22, P));
}
slab('plinth.top-bevel', topPlan, 21, 1, 'wood', grain);
for (const [i, [x, y]] of k.corners(PLAN, 10).entries()) {
  disc(`corner.${i}.washer`, x, y, 2.4, 22, .35, 'brass');
  disc(`corner.${i}.screw`, x, y, 1.55, 22.35, .5, 'brass', line(k.lineOnTop([x-1.55,y], [x+1.55,y], 22.85, P)));
}
const cy = -9;
disc('bell.felt', 0, cy, 65, 22, 1, 'rubber');
disc('bell.base', 0, cy, 65, 23, 5, 'dark', line(k.sideArc(0, cy, 65, 25, P, 96)));
disc('bell.base-bead', 0, cy, 62, 28, 2, 'brass');
disc('bell.rim', 0, cy, 58, 30, 3, 'brass');
// Closed shell meridian: constant 1.2 mm radial wall, not a solid hemisphere.
const radius = s => Math.sqrt(56 * 56 - (s - 33) ** 2);
const outer = Array.from({length: 57}, (_, i) => { const s = 33 + 55*i/56; return [s, radius(s), 1]; });
const inner = [...outer].reverse().map(([s,r]) => [s, r-1.2, 1]);
const meridian = [...outer, ...inner];
add('bell.dome', G.solidOf(outer, F, P, { smooth: { slope: s => -(s-33)/radius(s) }, steps: 128 }), A.lathe(F, meridian, { name: 'bell.dome' }), 'brass');
for (const [name,z,h,r] of [['guide-seat',88,1,10.5], ['guide',89,2,7]]) {
  add(`bell.${name}`, G.ringBand(z,z+h,3,r,F,P), A.ring(F,z,z+h,3,r,{name:`bell.${name}`}), 'brass');
}
const rod = G.rodOut(F,91,102,3,P,{stroke:4});
add('plunger.shaft', rod.paths, A.slide(F,91,102,3,{name:'plunger.shaft'}), 'brass', '', true);
for (const [name,z,h,r] of [['lower',102,1,12], ['grip',103,3,13], ['cap',106,1,12.5]]) {
  const extra = name === 'grip' ? line(k.knurl(0,cy,r,z,z+h,64,P)) : name === 'cap' ? line(k.ring(0,cy,10,z+h,P,80)) : '';
  add(`plunger.${name}`, G.disc(z,z+h,r,F,P), A.disc(F,z,z+h,r,{name:`plunger.${name}`}), 'brass', extra, true);
}
const plaque = {x:-31,y:64,w:62,d:15,r:1.5};
slab('plaque.backing', plaque, 22, .5, 'dark');
slab('plaque.face', k.insetPlan(plaque,.6),22.5,.45,'brass', line(k.planOutline(k.insetPlan(plaque,1.5),22.95,P)));
for (const [i,x] of [-26,26].entries()) {
  disc(`plaque.${i}.washer`,x,71.5,1.45,22.95,.25,'brass');
  disc(`plaque.${i}.screw`,x,71.5,1,23.2,.25,'brass',line(k.lineOnTop([x-1,71.5],[x+1,71.5],23.45,P)));
}
A.settle(R,P, {states:[0,.25,.5,.75,1]});
R.items.sort((a,b)=>a.key-b.key);
const art = {
  width:600,height:400, projection:P,
  shaftClip:rod.clip, pressVector:k.axisVector(P,[0,0,-4]),
  shadow:k.haloOf(PLAN,0,6,P),
  engraving:k.faceTextSvg(k.topMatrix([0,73.5],22.96,P,'x'),'WANDER',{size:4.2,tone:'mid',anchor:'middle'}),
  parts:R.items.map(({name,svg,material,moving})=>({name,svg,material,moving})),
};
writeFileSync(new URL('../src/bell/geometry.json',import.meta.url),JSON.stringify(art));
console.log(`Built ${art.parts.length} parts; ${Math.round(JSON.stringify(art).length/1024)} KB static geometry.`);
A.auditOrExit(R,P,{frames:[0,.25,.5,.75,1],apart:false});
