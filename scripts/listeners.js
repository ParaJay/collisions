import * as Constants from "./constants.js";
import { instance, start } from "./script.js";

addModifyListener("entityCount", "entityLabel", "entities");
addModifyListener("varietyCount", "varietyLabel", "variety");
addModifyListener("size", "sizeLabel");

function addModifyListener(id, labelId, displayId = id) {
    let element = document.getElementById(id);
    let label = document.getElementById(labelId);

    element.addEventListener("input", (e) => {
        label.textContent = displayId + ": " + e.target.value;
        instance.set(id, parseFloat(e.target.value));
        instance.reset();
    });
}

Constants.startBtn.addEventListener("click", () => {
	if(!instance.running) {
		start();
	}
});

Constants.stopBtn.addEventListener("click", () => {
	instance.running = false;
});

Constants.resetBtn.addEventListener("click", () => {
	instance.reset();
});

Constants.speedUp.addEventListener("click", () => {
	instance.setScale(instance.getScale() * 2);
});

Constants.speedDown.addEventListener("click", () => {
	instance.setScale(instance.getScale() / 2);
});

window.addEventListener("keyup", (e) => {
	if(e.key == "Escape") {
		if(!instance.running) {
			start();
		} else {
			instance.running = false;
		}
	}
});