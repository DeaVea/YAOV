/**
 * Removes duplicate items from the string.
 * @param arr1
 */
export function uniquify(arr1: undefined): undefined;
export function uniquify(arr1: string[]): string[];
export function uniquify(arr1: number[]): number[];
export function uniquify(arr1: string[] | number[]): string[] | number[] {
    if (!arr1?.length) {
        return arr1;
    }

    const valueMap: { [key: string]: boolean } = {};
    const values: unknown[] = [];
    for (const v of arr1) {
        const stringValue = String(v);
        if (valueMap[stringValue]) {
            continue;
        }
        valueMap[stringValue] = true;
        values.push(v);
    }
    return values as string[];
}