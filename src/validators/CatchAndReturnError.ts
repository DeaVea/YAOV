import { ValidationError } from "../ValidationError";

/**
 * Strips the error message from the error provided.
 *
 * @param error
 * @returns
 */
export function catchAndReturnError(error: Error | ValidationError): string[] {
    if (error instanceof ValidationError) {
        return error.errors;
    } else {
        return [error.message];
    }
}