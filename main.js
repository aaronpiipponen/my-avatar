import { Vector3D, projectPointToPlane } from './math3d.js';
import { lorentzPoints } from './lorenz.js';
import { centerScaleRender, drawCatmullRomSpline, updateViewAngle } from './renderer.js';

// DOM
const xdirection = document.getElementById("xdirection");
const ydirection = document.getElementById("ydirection");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// View controls
let prev_x = Number(xdirection.value);
let prev_y = Number(ydirection.value);
let u = new Vector3D(1, 0, 0);
let v = new Vector3D(0, 1, 0);
let n = new Vector3D(0, 0, 1);
let sensitivity = 0.1;

// Lorenz system parameters
let sigma = 10;
let rho = 28;
let beta = 8/3;

// Lorenz simulation parameters
let timestep = 0.01;
let timeinterval = [0, 100];

// Stroke count for canvas
let stroke_count = 500;

let points3D = lorentzPoints(sigma, rho, beta, timestep, timeinterval);

function updateLorenz() {
    points3D = lorentzPoints(sigma, rho, beta, timestep, timeinterval);
}

function draw() {

    ctx.clearRect(0,0,600,300)
                        
    let points2D = points3D.map(p => projectPointToPlane(p, u, v));
    points2D = centerScaleRender(points2D, 300, 150, 3);

    drawCatmullRomSpline(ctx, points2D, stroke_count);
}
draw();

// Event listeners
xdirection.oninput = () => {
    const x = Number(xdirection.value);
    const da = (x - prev_x) * sensitivity;
    prev_x = x;

    ({u, v, n} = updateViewAngle(da, 0, u, v, n));
    draw();
}

ydirection.oninput = () => {
    const y = Number(ydirection.value);
    const db = (y - prev_y) * sensitivity;
    prev_y = y;

    ({u, v, n} = updateViewAngle(0, db, u, v, n));
    draw();
}