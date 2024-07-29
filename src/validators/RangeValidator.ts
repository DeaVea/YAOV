import { ValidationError } from "../ValidationError";
import { Validator } from "../Validator";

export function rangeValidator(props: {lowestAllowedValue?: number, highestAllowedValue?: number}): Validator<unknown> {
    return (key, value) => {
        if (typeof value !== "number" || isNaN(value as number)) {
            return value;
        }
        const { lowestAllowedValue, highestAllowedValue } = props;
        const errorMsg: string[] = [];
        let isError = false;
        if (lowestAllowedValue) {
            errorMsg.push(`must be greater than or equal to ${lowestAllowedValue}`);
            if (value < lowestAllowedValue) {
                isError = true;
            }
        }
        if (highestAllowedValue) {
            errorMsg.push(`must be less than or equal to ${highestAllowedValue}`);
            if (value > highestAllowedValue) {
                isError = true;
            }
        }
        if (isError && errorMsg.length) {
            throw new ValidationError([`${String(key)}: Value ${errorMsg.join(" and value ")}.`])
        }
        return value;
    };
}