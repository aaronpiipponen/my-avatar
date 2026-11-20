export function drawCatmullRomSpline(ctx, points, stroke_count) {
    if (points.length < 3) return;

    ctx.lineWidth = 3;

    let gradient = (() => {
        let list = [];
        for (let i = points.length/stroke_count; i > 0; i--) {
            list.push(i * stroke_count / points.length);
        }
        return list;
    })();

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

        if(i % stroke_count === 0)
        {
            if(i === 0) {
                ctx.beginPath();
            }
            ctx.moveTo(p1.x, p1.y);
            ctx.strokeStyle = `rgba(0,0,120,${gradient[i/stroke_count]})`;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);

            if(i !== 0) {
                ctx.stroke();
                ctx.beginPath();
            } else if(i == points.length - 1) {
                ctx.stroke();
            }
        } else {
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
    }

}

export function centerScaleRender(points, centerX, centerY, scale) {

    // Scale
    points = points.map(p => ({x: p.x*scale, y: p.y*scale}));

    // Translate
    const mean = (points => {
        let x_total = 0;
        let y_total = 0;
        points.forEach(p => {x_total += p.x; y_total += p.y});
        return {x: x_total/points.length, y: y_total/points.length};
    })(points);

    console.log(mean);

    return points.map(p => ({x: p.x - mean.x + centerX, y: p.y - mean.y + centerY}));
}