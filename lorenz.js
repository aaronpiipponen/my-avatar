import { Vector3D } from './math3d.js';

export function lorentzPoints(s, r, b, dt, interval) {
    let t = interval[0];
    let x = 1;
    let y = 1;
    let z = 1;
    let points = [new Vector3D(x,y,z)];

    while(t < interval[1]) {

        let dx = (s*(y - x)) * dt;
        let dy = (x*(r - z) - y) * dt;
        let dz = (x*y - b*z) * dt;

        x += dx;
        y += dy;
        z += dz;

        points.push(new Vector3D(x,y,z));
        
        t += dt;
    }

    return points;
}