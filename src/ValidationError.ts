export class ValidationError extends Error {
    private _errors: string[];

    constructor(errors: string[]) {
        super(errors.join("\n"));
        this._errors = errors;
    }

    get errors(): string[] {
        return this._errors;
    }
}

/**
 * Throws a ValidationError if there are errors presented.
 *
 * Just removes some boilerplate code.
 * @param errors The errors found.
 */
export function throwErrorIfErrors(errors: string[] | undefined): undefined {
    if (errors?.length) {
        throw new ValidationError(errors);
    }
}