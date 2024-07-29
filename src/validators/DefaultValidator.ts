import { Validator } from "../Validator";

export type DefaultValueCallback<Input> = () => Input;

function isDefaultValueInput<Input>(value: Input | DefaultValueCallback<Input>): value is DefaultValueCallback<Input> {
    return typeof value === "function";
}

/**
 * Returns the default value if the value is null or undefined.
 * @param defaultValue
 * @returns
 */
export function defaultValidator<Input>(defaultValue: Input | DefaultValueCallback<Input>): Validator<Input, Input> {
    return (key, value) => {
        if (value == null) {
            return isDefaultValueInput(defaultValue ) ? defaultValue() : defaultValue;
        }
        return value;
    }
}