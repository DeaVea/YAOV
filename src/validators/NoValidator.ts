import { Validator } from "../Validator";

export function noValidator<Input>(): Validator<Input> {
    return (key, value) => value;
}

export const doNothingValidator = noValidator();