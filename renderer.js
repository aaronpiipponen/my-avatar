import { Vector3D } from "./math3d.js";

export function drawCatmullRomSpline(ctx, points, stroke_count) {
    if (points.length < 3) return;

    ctx.lineWidth = 3;
    ctx.shadowColor = "rgba(120, 40, 200, 0.35)";
    ctx.shadowBlur = 4;

    let gradient = (() => {
        let list = [];
        for (let i = 1; i <= points.length/stroke_count; i++) {
            list.push(i * stroke_count / points.length);
        }
        return list;
    })();

    let minZ = Infinity;
    let maxZ = -Infinity;
    for (const p of points) {
        if (p.z < minZ) minZ = p.z;
        if (p.z > maxZ) maxZ = p.z;
    }
    const zRange = maxZ - minZ || 1;

    // Draw spline segments
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(i - 1, 0)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(i + 2, points.length - 1)];

        // Calculate control points for cubic Bezier curve
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        if (i % stroke_count === 0) {
            if (i !== 0) {
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);

            // Line style
            const g = gradient[i / stroke_count];
            const depth = (p1.z - minZ) / zRange;
            ctx.lineWidth = Math.max(0.5, (1.5 + depth * 2) * g);
            ctx.strokeStyle = `hsla(${265 + g * 20}, 75%, ${18 + g * 22 + depth * 18}%, ${g * (0.45 + depth * 0.55)})`;

            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        } else {
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
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

    console.log(mean);

    return points.map(p => ({
        x: p.x - mean.x + centerX,
        y: p.y - mean.y + centerY,
        z: p.z
    }));
}

export function updateViewAngle(da, db, dc, u, v, n) 
{
    if (da !== 0) {
        const u_new = u.multiply(Math.cos(da)).add(n.multiply(-Math.sin(da)));
        const n_new = u.multiply(Math.sin(da)).add(n.multiply(Math.cos(da)));
        u = u_new;
        n = n_new;
    }  
    if (db !== 0) {
        const v_new = v.multiply(Math.cos(db)).add(n.multiply(-Math.sin(db)));
        const n_new = v.multiply(Math.sin(db)).add(n.multiply(Math.cos(db)));
        v = v_new;
        n = n_new;
    }
    if (dc !== 0) {
        const u_new = u.multiply(Math.cos(dc)).add(v.multiply(Math.sin(dc)));
        const v_new = u.multiply(-Math.sin(dc)).add(v.multiply(Math.cos(dc)));
        u = u_new;
        v = v_new;
    }
    
    return { u, v, n };
}