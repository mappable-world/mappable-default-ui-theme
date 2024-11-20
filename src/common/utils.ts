import type {LngLat} from '@mappable-world/mappable-types';

export function createMMapElement(className?: string): HTMLElement {
    const el = document.createElement('mappable');
    if (className) {
        el.className = className;
    }
    return el;
}

export function areFuzzyEqual(a: LngLat, b: LngLat, tolerance = 1e-6): boolean {
    const d = [a[0] - b[0], a[1] - b[1]];
    return -tolerance < d[0] && d[0] < tolerance && -tolerance < d[1] && d[1] < tolerance;
}
