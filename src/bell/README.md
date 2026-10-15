# Hairline concierge bell

`bell.js` at the project root is the figure source. It builds the bell from a
rounded base, a domed shell, a guide collar, and a spring-loaded plunger. Edit
that file to change the drawing; the kernel, bench, and build script in
`hairline/` are unchanged copies from the hairline-create skill.

`BellFigure.tsx` mounts the figure through `hairline/loadBell.ts`. Hairline owns
its SVG, pointer hit testing, and sleeping animation loop; React owns the
accessible ring button, synthesized sound, and sound toggle. The ring callback
opens the contained Base UI drawer only once the plunger has finished returning.
The backdrop fades in on completion, with the drawer entrance following 100ms
later. Repeated strikes replace the pending completion, so an earlier strike
cannot open the drawer during a later press.

The WANDER wordmark is an SVG text-on-path layer in the React component.
The figure projects a latitude on the dome and updates that path during recoil,
so the lettering follows the shell's perceived curvature and movement. The
standalone Hairline preview retains the unbranded figure.

Static hit areas use the bell's resting geometry. The subtle hover depresses
the plunger by one world unit; the main motion is a 70ms strike, followed by a
Motion spring return with a visible rebound and a small damped shell recoil.
The return spring is configured in `BellFigure.tsx` (stiffness 420, damping 14,
mass 0.65); the standalone preview falls back to a 440ms eased return. The kernel handles offscreen
sleep and reduced motion. The hover is intentionally quiet: the action is a
press, rather than a large transformation on pointer movement.

Run `npm run bell:build` to rebuild `hairline-bell.html`, a standalone preview.
Open it with `?play=1` to follow the tour: plunger, shell, plunger, then leave.
The Hairline look tool validates rest/answer, narrow views, intensity extremes,
both themes, read-outs, frame bounds, console output, and settling behavior.
