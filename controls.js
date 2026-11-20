export function setupControls({ onViewChange, onParamChange, onSimChange, onScaleChange }) {
    const updateLabel = (id, value) => {
        const label = document.getElementById(`${id}-val`);
        if (label) label.textContent = value;
    };

    const PRESETS = {
        classic:   { sigma: 10, rho: 28,    beta: 8 / 3 },
        wide:      { sigma: 10, rho: 45,    beta: 8 / 3 },
        wolf:      { sigma: 16, rho: 45.92, beta: 4     },
        transient: { sigma: 10, rho: 24.5,  beta: 8 / 3 },
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

    document.querySelectorAll("[data-preset]").forEach(btn => {
        btn.onclick = () => {
            const preset = PRESETS[btn.dataset.preset];
            if (!preset) return;

            // Update each slider's value, its text readout, and notify main.js
            const mapping = [
                ["lorenz-sigma", "sigma", preset.sigma],
                ["lorenz-rho",   "rho",   preset.rho],
                ["lorenz-beta",  "beta",  preset.beta],
            ];

            mapping.forEach(([id, key, val]) => {
                const slider = document.getElementById(id);
                slider.value = Math.round(val * 1000);
                updateLabel(id, Number(val.toFixed(3)));
                onParamChange(key, val);
            });
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