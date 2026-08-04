# Race Intelligence 3D — V10

A flagship interactive vehicle-performance experience built with React, TypeScript, Three.js, and React Three Fiber.

## What changed in V10

- Rebuilt the project as a real application rather than a static visual microsite.
- Added a substantially more detailed procedural Formula-style car with carbon surfaces, glowing wireframe overlays, suspension, tyres, brake discs, wings, floor, diffuser, halo, and energy-system geometry.
- Added manual drag orbit, wheel zoom, auto orbit, five camera presets, and exploded component analysis.
- Added Race, Engineering, and Thermal visualization modes with shader-driven material changes.
- Added live simulated telemetry across speed, RPM, gear, throttle, brake, ERS, G-load, temperatures, fuel, DRS, and lap delta.
- Added a component-level digital twin inspector for seven vehicle systems.
- Added an interactive tyre and pit-window strategy simulator.
- Added a complete telemetry lab, track map, synchronized channel table, infrastructure pipeline, keyboard controls, responsive mobile behavior, reduced-motion handling, and fullscreen command mode.

## Keyboard controls

- `1` / `2` / `3`: Race, Engineering, Thermal modes
- `H` / `F` / `S` / `R` / `T`: Hero, Front, Side, Rear, Top views
- `E`: Toggle exploded analysis
- `Space`: Pause or resume auto orbit

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run verify
```

The sandbox-compatible checks are:

```bash
npm run test
```

## Deployment

The GitHub Pages workflow in `.github/workflows/deploy.yml` installs dependencies, verifies the project, builds `dist`, and deploys on every push to `main`.

Live URL: `https://markofornoliak.github.io/race-intelligence-3d/`

All telemetry and engineering values are representative visualization data.

V10 source installation is executed automatically by the repository workflow.
