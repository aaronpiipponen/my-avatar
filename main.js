import { Vector3D, projectPointToPlane } from './math3d.js';
import { lorentzPoints } from './lorenz.js';
import { centerScaleRender, drawCatmullRomSpline } from './renderer.js';

// DOM
const tdirection = document.getElementById("tdirection");
const pdirection = document.getElementById("pdirection");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// View angle
let t = 0;
let p = 0;

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

    // Convert view angle to normal vector of viewing plane
    let dir_vec = new Vector3D(Math.cos(t)*Math.cos(p),
                                Math.sin(t)*Math.cos(p),
                                Math.sin(p));
                        
    let points2D = points3D.map(p => projectPointToPlane(p, dir_vec));
    points2D = centerScaleRender(points2D, 300, 150, 3);

    drawCatmullRomSpline(ctx, points2D, stroke_count);;
}
draw();

// Event listeners
tdirection.oninput = () => {
    t = tdirection.value * Math.PI / 180;
    draw();
}

pdirection.oninput = () => {
    p = pdirection.value * Math.PI / 180;
    draw();
}