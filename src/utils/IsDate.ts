/**
 * Returns true if the value is a valid date.
 * @param value
 */
export function isDate(value: unknown): value is number | string | Date {
    try {
        new Date(value as string).toISOString();
        return true;
    } catch (e) {
        return false
    }
}