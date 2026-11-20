import { Vector3D } from './math3d.js';

export function lorentzPoints(s, r, b, dt, interval) {
    let t = -500;
    let x = 1;
    let y = 1;
    let z = 1;
    let points = [];

    while(t < 500) {

        let dx = (s*(y - x)) * dt;
        let dy = (x*(r - z) - y) * dt;
        let dz = (x*y - b*z) * dt;

        x += dx;
        y += dy;
        z += dz;

        if(t >= interval[0] && t <= interval[1])
        {
            points.push(new Vector3D(x,y,z));
        }
        
        t += dt;
    }

    return points;
}