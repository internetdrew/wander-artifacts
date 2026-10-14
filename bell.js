/** A front-desk bell: a rounded dome, rolled rim, and spring-loaded plunger. */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, proj, prism, ringAt, run,
  solid, put, tween, tset, tval, tdone, spring, stepS, mk, pointer, register, disposer,
} = HL;

function mount({ stage, svg, read, onSurfacePath, animatePlunger }, value) {
  const bag = disposer();
  let travel = value, active = -1, pressing = false;
  let onSettled, releaseAnimation, releasing = false;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-65, -65, 0], [65, 65, 0], [-65, 65, 0], [65, -65, 0], [0, 0, 90]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk('g', {}, svg);
  const foot = solid(g), rim = solid(g), shell = solid(g), collar = solid(g);
  const stem = solid(g), button = solid(g);
  let press = tween(0);
  // A physical strike is brisk; its release is slower than the press.
  const resonance = spring(0);
  let lastPress = NaN, lastResonance = NaN;

  function cylinder(part, radius, z0, z1, inset = 1) {
    put(part, prism(P, front, circ(radius, 96), circ(radius - inset, 96), z0, z1));
  }
  cylinder(foot, 65, 0, 3, 1.4);
  cylinder(rim, 62, 3, 8, 1.6);
  cylinder(collar, 6, 63, 68, .8);

  function projectSurface(x, y, z, angle) {
    const a = angle * Math.PI / 180;
    return P(x * Math.cos(a) + (z - 8) * Math.sin(a), y, 8 - x * Math.sin(a) + (z - 8) * Math.cos(a));
  }
  // The host can follow a latitude on the shell without owning its animation.
  function faceCurve(angle) {
    const z = 34, radius = Math.sqrt(56 ** 2 - (z - 8) ** 2);
    return open(Array.from({ length: 49 }, (_, i) => {
      const a = (95 - i / 48 * 100) * Math.PI / 180;
      return projectSurface(radius * Math.cos(a), radius * Math.sin(a), z, angle);
    }));
  }
  function dome(angle) {
    const points = [];
    const transform = (x, y, z) => projectSurface(x, y, z, angle);
    for (let level = 0; level <= 36; level++) {
      const theta = level / 36 * Math.PI / 2;
      const r = 56 * Math.cos(theta), z = 8 + 56 * Math.sin(theta);
      for (let i = 0; i < 96; i++) {
        const a = i / 96 * Math.PI * 2;
        points.push(transform(r * Math.cos(a), r * Math.sin(a), z));
      }
    }
    return {
      sil: poly(hull(points)),
      crease: open(run(circ(54, 96), front).map(q => transform(q.u, q.v, 10))),
    };
  }
  const restShell = dome(0);
  put(shell, restShell);
  onSurfacePath?.(faceCurve(0));
  function plunger(amount) {
    cylinder(stem, 2.6, 68, 81 - amount, .5);
    cylinder(button, 12, 81 - amount, 86 - amount, 1.3);
  }
  plunger(0);
  button.sil.classList.add('hi');

  // These outlines are from the resting pose, never the animated geometry.
  const capHit = hull(ringAt(P, circ(17, 64), 80).concat(ringAt(P, circ(17, 64), 90)));
  const bodyHit = hull(ringAt(P, circ(65, 64), 0).concat(ringAt(P, circ(56, 64), 8), [P(0, 0, 64)]));
  function contains([x, y], polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[i], b = polygon[j];
      if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
    }
    return inside;
  }
  function hit(p) { return contains(p, capHit) ? 1 : contains(p, bodyHit) ? 0 : -1; }
  function highlight() {
    shell.sil.classList.toggle('hi', active === 0 && !pressing);
    button.sil.classList.toggle('hi', active !== 0 || pressing);
  }

  const amountAtRest = () => Number.isFinite(lastPress) ? lastPress : 0;
  function releaseTo(target, now) {
    releaseAnimation?.stop();
    releasing = false;
    const from = amountAtRest();
    if (animatePlunger && !HL.reducedMotion()) {
      // Motion owns the physical return; no React render is needed per frame.
      press = tween(target, 0);
      releasing = true;
      releaseAnimation = animatePlunger(from, target, amount => {
        plunger(amount);
        lastPress = amount;
      }, () => { releasing = false; loop.wake(); });
    } else {
      press = tween(from, 440);
      tset(press, target, now, 0);
    }
  }
  const loop = register(stage, (dt, now) => {
    if (pressing && tdone(press, now)) {
      lastPress = tval(press, now);
      plunger(lastPress);
      pressing = false;
      releaseTo(active === 1 ? 1 : 0, now);
      resonance.x = .9;
      resonance.v = -8;
      highlight();
    }
    const amount = tval(press, now);
    const vibrating = stepS(resonance, dt);
    if (!releasing && amount !== lastPress) { plunger(amount); lastPress = amount; }
    if (resonance.x !== lastResonance) {
      const angle = clamp(resonance.x, -1, 1);
      put(shell, dome(angle));
      onSurfacePath?.(faceCurve(angle));
      lastResonance = resonance.x;
    }
    if (!pressing && !releasing && tdone(press, now) && onSettled) {
      const complete = onSettled;
      onSettled = undefined;
      complete();
    }
    return pressing || !tdone(press, now) || vibrating;
  });
  bag.add(loop.unregister);
  function select(next) {
    if (next === active) return;
    active = next;
    read.textContent = next === 1 ? 'plunger' : next === 0 ? 'bell' : 'rest';
    if (!pressing) {
      if (releasing) releaseTo(next === 1 ? 1 : 0, performance.now());
      else {
        press = tween(amountAtRest());
        tset(press, next === 1 ? 1 : 0, performance.now(), 0);
      }
    }
    highlight();
    loop.wake();
  }
  function ring(complete) {
    onSettled = complete;
    releaseAnimation?.stop();
    releasing = false;
    pressing = true;
    press = tween(amountAtRest(), 70);
    tset(press, travel, performance.now(), 0);
    highlight();
    loop.wake();
  }
  bag.add(pointer(stage, {
    move: p => select(hit(p)),
    down: p => { if (hit(p) >= 0) ring(); },
    leave: () => select(-1),
  }));
  bag.add(() => { releaseAnimation?.stop(); onSettled = undefined; svg.replaceChildren(); });
  read.textContent = 'rest';
  return { set: next => { travel = next; }, ring, destroy: bag.dispose };
}

hairline({
  name: 'bell',
  means: 'A front-desk bell: touch the plunger, press to ring, and watch its shell settle.',
  rules: [1, 4, 6, 7, 9],
  range: [3, 5, 7],
  tour: [[200, 74], [229, 166], [200, 74], null],
  mount,
});
