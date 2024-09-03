export function formatDistance(distance: number): string {
    return distance > 900 ? `${roundDistance(distance / 1000)} km` : `${roundDistance(distance)} m`;
}

export function formatArea(area: number): string {
    return area > 900_000
        ? `${splitNumber(roundDistance(area / 1_000_000))} km²`
        : `${splitNumber(roundDistance(area))} m²`;
}

function roundDistance(distance: number): number {
    if (distance > 100) {
        return Math.round(distance);
    }
    const factor = Math.pow(10, distance > 10 ? 1 : 2);
    return Math.round(distance * factor) / factor;
}

function splitNumber(value: number): string {
    return value.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
}
