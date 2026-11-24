<p align="center">
  <img src="/assets/logo.png" alt="my-avatar" width="480">
</p>

<p align="center">
  An interactive 3D strange attractor visualizer that exports the drawing as an SVG.
</p>

<p align="center">
  Try it at <a href="https://aaronpiipponen.github.io/my-avatar/">aaronpiipponen.github.io/my-avatar</a>.
</p>

<p align="center">
  <a href="/LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
</p>

---

**Contents**

- [Why it exists](#why-it-exists)
- [Features](#features)
- [Run locally](#run-locally)
- [Limits](#limits)
- [License](#license)

## Why it exists

I made it to generate my GitHub profile picture. I wrote the maths and the 3D rendering by hand as
an exercise, and used AI to help with the page styling.

The page shows the same controls I used to pick the picture: which system to draw, the viewing
angle, the parameters and how long to simulate. **Export SVG** saves the result as a vector file, so
it stays sharp at any size.

## Features

![The visualizer with the Lorenz attractor in the canvas, the View, System and Simulation control panels below it, and the Lorenz, Rössler, Chen, Aizawa and Export SVG buttons](/assets/overview.png)

### Four attractors

Lorenz, Rössler, Chen and Aizawa. Each button loads a preset for that system.

| Attractor | Equations | Preset parameters | Step | Interval | Scale |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Lorenz | `dx/dt = a(y - x)`, `dy/dt = x(b - z) - y`, `dz/dt = xy - cz` | `a = 10`, `b = 28`, `c = 8/3` | `0.01` | `0` to `100` | `10` |
| Rössler | `dx/dt = -y - z`, `dy/dt = x + ay`, `dz/dt = b + z(x - c)` | `a = 0.2`, `b = 0.2`, `c = 5.7` | `0.05` | `0` to `400` | `14` |
| Chen | `dx/dt = a(y - x)`, `dy/dt = (c - a)x - xz + cy`, `dz/dt = xy - bz` | `a = 35`, `b = 3`, `c = 28` | `0.003` | `0` to `60` | `10` |
| Aizawa | `dx/dt = (z - b)x - dy`, `dy/dt = dx + (z - b)y`, `dz/dt = c + az - z^3/3 - (x^2 + y^2)(1 + ez) + fzx^3` | `a = 0.95`, `b = 0.7`, `c = 0.6` | `0.01` | `0` to `120` | `12` |

The Aizawa system uses fixed constants `d = 3.5`, `e = 0.25` and `f = 0.1`, and multiplies its
coordinates by 15.

### Change the view and the simulation

The view sliders rotate the attractor around the X, Y and Z axes and set the scale. The other
sliders change the parameters `a`, `b` and `c`, the Euler timestep, and the start and stop of the
time interval that gets drawn.

The simulation always runs from `t = -500` to `t = 500`. The points before the interval start are
skipped so the trajectory has settled onto the attractor before drawing begins.

### Shaded curves

The trajectory is drawn as Catmull-Rom splines. Color and brightness follow how far along the
trajectory a segment is and how deep it lies in the view.

### Export to SVG

**Export SVG** downloads `attractor.svg`, a 600 by 600 pixel image centered on the projected
trajectory. It has two path groups, `glow-layer` and `core-layer`, so the glow and the lines can be
edited separately.

![Two exported SVG attractors side by side, Chen on the left and Aizawa on the right, each drawn in violet on a dark background](/assets/examples.png)

## Run locally

The page uses browser ES modules, so it has to be served over HTTP.

1. Clone the repository and open its root folder.
2. Start a static server:

   ```bash
   python -m http.server 5500
   ```

3. Open `http://localhost:5500`. The canvas shows the Lorenz attractor.

## Limits

- The canvas stays blank when the stop value is not greater than the start value, or when the
  trajectory diverges. The simulation stops at the first value that is not a finite number. Pick a
  preset or reload the page to recover.
- The view sliders add rotations one after another, and 3D rotations depend on their order, so
  moving a slider back to `0` does not always restore the original view. Reload the page to reset.
- The export is the central 600 by 600 square of the canvas, so anything outside that square is
  cropped.

## License

This project is released under the [MIT License](/LICENSE).
