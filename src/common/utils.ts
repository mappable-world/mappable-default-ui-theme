export function createMMapElement(className?: string): HTMLElement {
    const el = document.createElement('mappable');
    if (className) {
        el.className = className;
    }
    return el;
}
