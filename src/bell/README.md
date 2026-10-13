# Front-desk bell

An Anatomy-kit SVG figure: a turned brass bell on a beveled walnut plinth.
`BellFigure.tsx` owns the tap, short plunger stroke, quiet synthesized ring,
sound toggle, and ring count. `ConciergeBell.tsx` owns the request disclosure.

- Layout uses Tailwind. Material ramps and SVG-specific rules are formatted in
  `BellFigure.module.css`.
- `geometry.json` is generated, not hand-edited. Change world dimensions and
  parts in `scripts/build-bell.mjs`, then run `npm run bell:build`.
- The build uses vendored Anatomy kit modules under `scripts/anatomy-kit`.
  These build-time geometry/audit tools never enter the browser bundle.
- Forty physical parts are recorded with their true shapes. The audit checks
  support, clearance, and depth order at five plunger positions. The shaft is
  clipped at its guide and the visible length shortens on pressing.
- The dome's external surface is rendered without hidden inner-wall shading;
  the audit records its hollow wall. The tiny visual resonance is an SVG offset.
- The button supports Enter and Space. Closing requests returns focus to it.
  Reduced motion removes physical movement; offscreen motion stops. The bell
  stays silent and still until activated, appropriate for a concierge control.
- Sound is generated with three short decaying sine partials after a user gesture.
  It needs no external audio sample and can be muted. Browser audio failure
  never prevents the request options from opening.
- SVG supplies the complete figure; no WebGL context or rendering loop is needed.
  The concierge component is loaded as a separate chunk.

Validation: `npm run build`, `npm run lint`, `npm run bell:build`; browser checks
at desktop and 390px, four-times close-up, keyboard open/close, reduced motion,
and the Anatomy line-end checker. The request options remain local previews.
