export function setupControls({ onViewChange, onParamChange, onSimChange, onScaleChange }) {
    const updateLabel = (id, value) => {
        const label = document.getElementById(`${id}-val`);
        if (label) label.textContent = value;
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