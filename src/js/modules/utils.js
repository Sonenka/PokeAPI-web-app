import { mainElements } from "../dictionaries/elements";

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function toggleLoader(show) {
    if (mainElements.loader) {
        mainElements.loader.style.display = show ? "flex" : "none";
    }
}