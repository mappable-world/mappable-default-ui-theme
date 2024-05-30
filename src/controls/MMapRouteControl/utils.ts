const SEC_TO_DAYS = 24 * 3600;
const SEC_TO_HOURS = 3600;
const SEC_TO_MIN = 60;

export function formatDistance(length: number): string {
    if (length < 1000) {
        return `${length.toFixed(0)} m`;
    }
    return `${(length / 1000).toFixed(2)} km`;
}

export function formatDuration(durationS: number): string {
    const days = Math.floor(durationS / SEC_TO_DAYS);
    const hours = Math.floor((durationS % SEC_TO_DAYS) / SEC_TO_HOURS);
    const min = Math.floor(((durationS % SEC_TO_DAYS) % SEC_TO_HOURS) / SEC_TO_MIN);
    const sec = Math.floor(((durationS % SEC_TO_DAYS) % SEC_TO_HOURS) % SEC_TO_MIN);

    if (days === 0 && hours === 0 && min === 0) {
        return `${sec} s`;
    }

    let result = '';
    if (days !== 0) {
        result += ` ${days} d.`;
    }
    if (hours !== 0) {
        result += ` ${hours} hr`;
    }
    if (min !== 0) {
        result += ` ${min} min`;
    }
    return result;
}
