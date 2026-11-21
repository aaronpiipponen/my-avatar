import { buildStrokeChunks } from './spline.js';

export function exportCatmullRomSVG(points, strokeCount, width, height) {
    const chunks = buildStrokeChunks(points, strokeCount);
    if (chunks.length === 0) return "";

    const f = n => n.toFixed(2);
    const glowPaths = [];
    const corePaths = [];

    for (const { start, curves, style } of chunks) {
        const d = `M ${f(start.x)} ${f(start.y)}` + curves
            .map(c => ` C ${f(c.cp1x)} ${f(c.cp1y)}, ${f(c.cp2x)} ${f(c.cp2y)}, ${f(c.x)} ${f(c.y)}`)
            .join("");

        const hue = style.hue.toFixed(1);
        const light = style.light.toFixed(1);

        glowPaths.push(`<path d="${d}" fill="none" stroke="hsla(${hue}, 80%, ${(style.light + 10).toFixed(1)}%, ${(style.alpha * 0.25).toFixed(3)})" stroke-width="${f(style.width * 3)}" stroke-linecap="round" stroke-linejoin="round" />`);
        corePaths.push(`<path d="${d}" fill="none" stroke="hsla(${hue}, 75%, ${light}%, ${style.alpha.toFixed(3)})" stroke-width="${f(style.width)}" stroke-linecap="round" stroke-linejoin="round" />`);
    }

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