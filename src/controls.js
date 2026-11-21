export function setupControls({ onViewChange, onParamChange, onSimChange, onScaleChange, onAttractorChange }) {
    const updateLabel = (id, value) => {
        const label = document.getElementById(`${id}-val`);
        if (label) label.textContent = value;
    };

    // Presets
    const ATTRACTORS = {
        lorenz:  { a: 10,   b: 28,  c: 8 / 3, step: 0.01,  start: 0, stop: 100, scale: 10 },
        rossler: { a: 0.2,  b: 0.2, c: 5.7,   step: 0.05,  start: 0, stop: 400, scale: 14 },
        chen:    { a: 35,   b: 3,   c: 28,    step: 0.003, start: 0, stop: 60,  scale: 10 },
        aizawa:  { a: 0.95, b: 0.7, c: 0.6,   step: 0.01,  start: 0, stop: 120, scale: 12 },
    };

    const viewAxes = [
        { id: "view-x", axis: "da" },
        { id: "view-y", axis: "db" },
        { id: "view-z", axis: "dc" },
    ];

    viewAxes.forEach(({ id, axis }) => {
        const el = document.getElementById(id);
        let prev = Number(el.value);
        updateLabel(id, prev);

        el.oninput = () => {
            const curr = Number(el.value);
            const delta = curr - prev;
            prev = curr;
            updateLabel(id, curr);
            onViewChange(axis, delta);
        };
    });

    const bindSlider = (id, scale, handler) => {
        const el = document.getElementById(id);
        const initial = Number(el.value) / scale;
        updateLabel(id, initial);

        el.oninput = () => {
            const val = Number(el.value) / scale;
            updateLabel(id, val);
            handler(val);
        };

        return initial;
    };

    document.querySelectorAll("[data-attractor]").forEach(btn => {
        btn.onclick = () => {
            const type = btn.dataset.attractor;
            const cfg = ATTRACTORS[type];
            if (!cfg) return;

            const updates = [
                ["attractor-a",  cfg.a * 1000,      cfg.a],
                ["attractor-b",  cfg.b * 1000,      cfg.b],
                ["attractor-c",  cfg.c * 1000,      cfg.c],
                ["sim-step",     cfg.step * 10000,  cfg.step],
                ["sim-start",    cfg.start * 10,    cfg.start],
                ["sim-stop",     cfg.stop * 10,     cfg.stop],
                ["view-scale",   cfg.scale,         cfg.scale],
            ];

            updates.forEach(([id, rawVal, displayVal]) => {
                const slider = document.getElementById(id);
                slider.value = Math.round(rawVal);
                updateLabel(id, Number(displayVal.toFixed(3)));
            });

            onAttractorChange(type, cfg);
        };
    });

    return {
        a:     bindSlider("attractor-a",  1000,  val => onParamChange("a", val)),
        b:     bindSlider("attractor-b",  1000,  val => onParamChange("b", val)),
        c:     bindSlider("attractor-c",  1000,  val => onParamChange("c", val)),
        step:  bindSlider("sim-step",     10000, val => onSimChange("step", val)),
        start: bindSlider("sim-start",    10,    val => onSimChange("start", val)),
        stop:  bindSlider("sim-stop",     10,    val => onSimChange("stop", val)),
        scale: bindSlider("view-scale",   1,     val => onScaleChange(val))
    };
}