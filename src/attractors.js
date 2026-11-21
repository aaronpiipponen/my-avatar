import { Vector3D } from './math3d.js';

export function attractorPoints(type, a, b, c, dt, interval) {
    let t = -500;
    let x = 1, y = 1, z = 1;

    if (type === "rossler") { x = 0; y = 1; z = 0; }
    if (type === "chen")    { x = -10; y = 0; z = 37; }
    if (type === "aizawa")  { x = 0.1; y = 0; z = 0; }

    let points = [];

    // Loop from -500 to 500 to "warm up" the attractor
    while (t < 500) {
        let dx = 0, dy = 0, dz = 0;

        switch (type) {
            case "rossler":
                dx = (-y - z) * dt;
                dy = (x + a * y) * dt;
                dz = (b + z * (x - c)) * dt;
                break;

            case "chen":
                dx = (a * (y - x)) * dt;
                dy = ((c - a) * x - x * z + c * y) * dt;
                dz = (x * y - b * z) * dt;
                break;

            case "aizawa": {
                const d = 3.5, e = 0.25, f = 0.1;
                dx = ((z - b) * x - d * y) * dt;
                dy = (d * x + (z - b) * y) * dt;
                dz = (c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * x * x * x) * dt;
                break;
            }

            case "lorenz":
            default:
                dx = (a * (y - x)) * dt;
                dy = (x * (b - z) - y) * dt;
                dz = (x * y - c * z) * dt;
                break;
        }

        x += dx;
        y += dy;
        z += dz;

        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) break;

        // Record only between the selected interval
        if (t >= interval[0] && t <= interval[1]) {
            const norm = type === "aizawa" ? 15 : 1;
            points.push(new Vector3D(x * norm, y * norm, z * norm));
        }

        t += dt;
    }

    return points;
}