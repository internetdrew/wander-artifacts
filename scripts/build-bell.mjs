import { writeFileSync } from 'node:fs';
import * as k from './anatomy-kit/iso-kit.mjs';
import * as G from './anatomy-kit/lathe.mjs';
import * as A from './anatomy-kit/audit.mjs';

// World units approximate millimeters. The bell stands alone, without a plinth.
const PLAN = { x: -65, y: -74, w: 130, d: 130, r: 65 };
const P = k.fitProjection([...k.boxCorners(PLAN, 0, 8), [0, -9, 85]], 600, 400, { pad: 58, azimuth: 42, elevation: 27 });
const F = G.frameAlong([0, -9, -22], [0, 0, 1]);
const R = A.recorder(P);
const items = [];
function add(name, paths, shape, material, extra = '', moving = false) {
  const svg = k.solidSvg(paths, { tone: 'mid', crease: 'faint', inner: extra });
  const item = R.put({ name, piece: moving ? 'plunger' : 'fixed', move: moving ? [0, 0, -4] : [0, 0, 0], at: [0, 0, 0], svg, shapes: [R.solid(shape)] });
  Object.assign(item, { paths, material, extra, moving });
  items.push(item);
}
function disc(name, x, y, r, z, h, material, extra = '') {
  const frame = G.frameAlong([x, y, 0], [0, 0, 1]);
  add(name, G.disc(z, z+h, r, frame, P), A.disc(frame, z, z+h, r, { name, ground: z === 0 }), material, extra);
}
const line = d => k.lineSvg(d, { tone: 'faint' });
const cy = -9;
disc('bell.felt', 0, cy, 65, 0, 1, 'rubber');
disc('bell.base', 0, cy, 65, 1, 5, 'dark', line(k.sideArc(0, cy, 65, 3, P, 96)));
disc('bell.base-bead', 0, cy, 62, 6, 2, 'brass');
disc('bell.rim', 0, cy, 58, 8, 3, 'brass');
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
  const extra = name === 'grip' ? line(k.knurl(0,cy,r,z-23,z+h-23,64,P)) : name === 'cap' ? line(k.ring(0,cy,10,z+h-23,P,80)) : '';
  add(`plunger.${name}`, G.disc(z,z+h,r,F,P), A.disc(F,z,z+h,r,{name:`plunger.${name}`}), 'brass', extra, true);
}
A.settle(R,P, {states:[0,.25,.5,.75,1]});
R.items.sort((a,b)=>a.key-b.key);
const art = {
  width:600,height:400, projection:P,
  shaftClip:rod.clip, pressVector:k.axisVector(P,[0,0,-4]),
  parts:R.items.map(({name,svg,material,moving})=>({name,svg,material,moving})),
};
writeFileSync(new URL('../src/bell/geometry.json',import.meta.url),JSON.stringify(art));
console.log(`Built ${art.parts.length} parts; ${Math.round(JSON.stringify(art).length/1024)} KB static geometry.`);
A.auditOrExit(R,P,{frames:[0,.25,.5,.75,1],apart:false});
