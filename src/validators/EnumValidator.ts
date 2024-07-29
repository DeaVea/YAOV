import { Validator } from "../Validator";
import { throwErrorIfErrors } from "../ValidationError";

export function enumValidator<T extends number | string>(...acceptableValues: T[]): Validator<T> {
    return (key, value) => {
        if (value == null) {
            return value;
        }
        const errors: string[] = [];
        if (!acceptableValues.includes(value)) {
            errors.push(`${String(key)}: Invalid value - Expected: "${joinValues(acceptableValues)}"; Received: "${value}"`);
        }
        throwErrorIfErrors(errors);
        return value;
    }
}

function joinValues(values: unknown[]) {
    if (values.length < 2) {
        return `${values.join('", "')}`;
    }
    const slicedValues = values.slice(0, values.length - 1);
    return `${slicedValues.join('", "')}` + `", or "${values[values.length - 1]}`
}