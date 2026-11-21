export function setupControls({ onViewChange, onParamChange, onSimChange, onScaleChange, onAttractorChange }) {
    const updateLabel = (id, value) => {
        const label = document.getElementById(`${id}-val`);
        if (label) label.textContent = value;
    };

    const ATTRACTORS = {
        lorenz:  { sigma: 10,   rho: 28,  beta: 8 / 3, step: 0.01,  start: 0, stop: 100, scale: 10 },
        rossler: { sigma: 0.2,  rho: 0.2, beta: 5.7,   step: 0.05,  start: 0, stop: 400, scale: 14 },
        chen:    { sigma: 35,   rho: 3,   beta: 28,    step: 0.003, start: 0, stop: 60,  scale: 10 },
        aizawa:  { sigma: 0.95, rho: 0.7, beta: 0.6,   step: 0.01,  start: 0, stop: 120, scale: 12 },
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
                ["lorenz-sigma", cfg.sigma * 1000,  cfg.sigma],
                ["lorenz-rho",   cfg.rho * 1000,    cfg.rho],
                ["lorenz-beta",  cfg.beta * 1000,   cfg.beta],
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
        sigma: bindSlider("lorenz-sigma", 1000, val => onParamChange("sigma", val)),
        rho:   bindSlider("lorenz-rho",   1000, val => onParamChange("rho", val)),
        beta:  bindSlider("lorenz-beta",  1000, val => onParamChange("beta", val)),
        step:  bindSlider("sim-step",     10000,  val => onSimChange("step", val)),
        start: bindSlider("sim-start",    10,    val => onSimChange("start", val)),
        stop:  bindSlider("sim-stop",     10,    val => onSimChange("stop", val)),
        scale: bindSlider("view-scale", 1, val => onScaleChange(val))
    };
}