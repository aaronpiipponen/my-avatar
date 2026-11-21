export function exportCatmullRomSVG(points, stroke_count, width, height) {
    if (points.length < 3) return "";

    let gradient = [];
    for (let i = 1; i <= points.length / stroke_count; i++) {
        gradient.push(i * stroke_count / points.length);
    }

    let minZ = Infinity, maxZ = -Infinity;
    for (const p of points) {
        if (p.z < minZ) minZ = p.z;
        if (p.z > maxZ) maxZ = p.z;
    }
    const zRange = (maxZ - minZ) || 1;

    let glowPaths = [];
    let corePaths = [];
    let d = "";
    let strokeWidth = 1;
    let hue = 265, light = 30, alpha = 1;

    const flushChunk = () => {
        if (!d) return;
        // vector wizardry
        glowPaths.push(`<path d="${d}" fill="none" stroke="hsla(${hue}, 80%, ${light + 10}%, ${(alpha * 0.25).toFixed(3)})" stroke-width="${(strokeWidth * 3).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`);
        corePaths.push(`<path d="${d}" fill="none" stroke="hsla(${hue}, 75%, ${light}%, ${alpha.toFixed(3)})" stroke-width="${strokeWidth.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`);
    };

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(i - 1, 0)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(i + 2, points.length - 1)];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        if (i % stroke_count === 0) {
            if (i !== 0) flushChunk();

            const g = gradient[Math.min(Math.floor(i / stroke_count), gradient.length - 1)] ?? 1;
            const depth = Number.isFinite(p1.z) ? (p1.z - minZ) / zRange : 0.5;

            strokeWidth = Math.max(0.5, (1.5 + depth * 2) * g);
            hue = +(265 + g * 20).toFixed(1);
            light = +(18 + g * 22 + depth * 18).toFixed(1);
            alpha = g * (0.45 + depth * 0.55);

            d = `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
        }

        d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }
    flushChunk();

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#0b0914" />
  <g id="glow-layer">
    ${glowPaths.join("\n    ")}
  </g>
  <g id="core-layer">
    ${corePaths.join("\n    ")}
  </g>
</svg>`;
}