export function buildStrokeChunks(points, strokeCount) {
    if (points.length < 3) return [];

    let minZ = Infinity, maxZ = -Infinity;
    for (const p of points) {
        if (p.z < minZ) minZ = p.z;
        if (p.z > maxZ) maxZ = p.z;
    }
    const zRange = (maxZ - minZ) || 1;

    const segmentCount = points.length - 1;
    const chunkCount = Math.ceil(segmentCount / strokeCount);
    const chunks = [];

    for (let k = 0; k < chunkCount; k++) {
        const startIdx = k * strokeCount;
        const endIdx = Math.min(startIdx + strokeCount, segmentCount);

        const g = (k + 1) / chunkCount;
        const start = points[startIdx];
        const depth = (start.z - minZ) / zRange;

        const style = {
            width: Math.max(0.5, (1.5 + depth * 2) * g),
            hue: 265 + g * 20,
            light: 18 + g * 22 + depth * 18,
            alpha: g * (0.45 + depth * 0.55),
        };

        const curves = [];
        for (let i = startIdx; i < endIdx; i++) {
            const p0 = points[Math.max(i - 1, 0)];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[Math.min(i + 2, points.length - 1)];

            curves.push({
                cp1x: p1.x + (p2.x - p0.x) / 6,
                cp1y: p1.y + (p2.y - p0.y) / 6,
                cp2x: p2.x - (p3.x - p1.x) / 6,
                cp2y: p2.y - (p3.y - p1.y) / 6,
                x: p2.x,
                y: p2.y,
            });
        }

        chunks.push({ start: { x: start.x, y: start.y }, curves, style });
    }

    return chunks;
}