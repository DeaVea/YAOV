import { Validator } from "../Validator";
import { ValidationError } from "../ValidationError";

/**
 * Returns the validator if the condition matches or null or undefined if it does not.
 */
export type ConditionChecker<V, R = V> = (key: string | number | symbol, value: V) => Validator<V, R>;

/**
 * A validator that lets you choose a validator based on the value of the incoming item.
 *
 * If none of the conditions match a validator, then an error will be thrown.
 *
 * If this is undesired then the last condition can simply be "true" which returns a NoValidator.
 *
 * @param converter
 * @returns
 */
export function conditionalValidator<V = unknown, R = V>(...conditions: ConditionChecker<V, R>[]): Validator<V, R> {
    return (key, value) => {
        for (const condition of conditions) {
            const foundValidator = condition(key, value);
            if (foundValidator) {
                return foundValidator(key, value);
            }
        }
        throw new ValidationError([
            `${String(key)}: Value of ${value} is not an acceptable value.`
        ]);
    };
}