import { Vector3D, projectPointToPlane } from './math3d.js';
import { attractorPoints } from './attractors.js';
import { centerScaleRender, drawCatmullRomSpline, updateViewAngle } from './renderer.js';
import { setupControls } from './controls.js';
import { exportCatmullRomSVG } from './export.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// View state
let u = new Vector3D(0, 0, 1);
let v = new Vector3D(0, 1, 0);
let n = new Vector3D(1, 0, 0);
const sensitivity = 0.05;
const strokeCount = 500;

let points = [];
let currentAttractor = "lorenz";

// Simulation and Lorenz parameters
const params = setupControls({
    onViewChange(axis, delta) {
        const d = delta * sensitivity;
        const da = axis === "da" ? d : 0;
        const db = axis === "db" ? d : 0;
        const dc = axis === "dc" ? d : 0;

        ({ u, v, n } = updateViewAngle(da, db, dc, u, v, n));
        draw();
    },
    onParamChange(key, value) {
        params[key] = value;
        updateAttractor();
        draw();
    },
    onSimChange(key, value) {
        params[key] = value;
        updateAttractor();
        draw();
    },
    onScaleChange(value) {
        params["scale"] = value;
        draw();
    },
    onAttractorChange(type, cfg) {
        currentAttractor = type;
        Object.assign(params, cfg);
        updateAttractor();
        draw();
    }
});

function updateAttractor() {
    if (params.step <= 0 || params.stop <= params.start) {
        points = [];
        return;
    }

    points = attractorPoints(
        currentAttractor,
        params.a,
        params.b,
        params.c,
        params.step,
        [params.start, params.stop]
    );
}

function draw() {
    ctx.fillStyle = "#0b0914";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (points.length < 3) return;

    let projected = points.map(p => projectPointToPlane(p, u, v, n));
    projected = centerScaleRender(projected, canvas.width / 2, canvas.height / 2, params.scale);

    drawCatmullRomSpline(ctx, projected, strokeCount);
}

document.getElementById("export-svg").onclick = () => {
    if (points.length < 3) return;

    const size = Math.min(canvas.width, canvas.height);

    let projected = points.map(p => projectPointToPlane(p, u, v, n));
    projected = centerScaleRender(projected, size / 2, size / 2, params.scale);

    const svgContent = exportCatmullRomSVG(projected, strokeCount, size, size);
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "attractor.svg";
    link.click();

    URL.revokeObjectURL(url);
};
// Initial simulation and render
updateAttractor();
draw();