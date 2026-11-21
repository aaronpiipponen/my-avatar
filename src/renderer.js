import { Vector3D } from "./math3d.js";
import { buildStrokeChunks } from "./spline.js";

export function drawCatmullRomSpline(ctx, points, strokeCount) {
    ctx.shadowColor = "rgba(120, 40, 200, 0.35)";
    ctx.shadowBlur = 4;

    for (const { start, curves, style } of buildStrokeChunks(points, strokeCount)) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        for (const c of curves) {
            ctx.bezierCurveTo(c.cp1x, c.cp1y, c.cp2x, c.cp2y, c.x, c.y);
        }
        ctx.lineWidth = style.width;
        ctx.strokeStyle = `hsla(${style.hue}, 75%, ${style.light}%, ${style.alpha})`;
        ctx.stroke();
    }
}

export function centerScaleRender(points, centerX, centerY, scale) {

    // Scale
    points = points.map(p => ({x: p.x*scale, y: p.y*scale, z: p.z}));

    // Translate
    const mean = (points => {
        let x_total = 0;
        let y_total = 0;
        points.forEach(p => {x_total += p.x; y_total += p.y});
        return {x: x_total/points.length, y: y_total/points.length};
    })(points);

    return points.map(p => ({
        x: p.x - mean.x + centerX,
        y: p.y - mean.y + centerY,
        z: p.z
    }));
}

export function updateViewAngle(da, db, dc, u, v, n) 
{
    // X-axis
    if (da !== 0) {
        const u_new = u.multiply(Math.cos(da)).add(n.multiply(-Math.sin(da)));
        const n_new = u.multiply(Math.sin(da)).add(n.multiply(Math.cos(da)));
        u = u_new.normalize();
        n = n_new.orthogonalize2D(u).normalize();
        v = v.orthogonalize3D(u,n).normalize();
    }
    // Y-axis  
    if (db !== 0) {
        const v_new = v.multiply(Math.cos(db)).add(n.multiply(-Math.sin(db)));
        const n_new = v.multiply(Math.sin(db)).add(n.multiply(Math.cos(db)));
        v = v_new.normalize();
        n = n_new.orthogonalize2D(v).normalize();
        u = u.orthogonalize3D(v,n).normalize();
    }
    // Z-axis
    if (dc !== 0) {
        const u_new = u.multiply(Math.cos(dc)).add(v.multiply(Math.sin(dc)));
        const v_new = u.multiply(-Math.sin(dc)).add(v.multiply(Math.cos(dc)));
        u = u_new.normalize();
        v = v_new.orthogonalize2D(u).normalize();
        n = n.orthogonalize3D(u,v).normalize();
    }
    
    return { u, v, n };
}