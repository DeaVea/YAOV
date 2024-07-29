import { Validator } from "../Validator";

/**
 * A validator that can be copied with different props.
 */
export interface ClonableValidator<T, R, P, V extends Validator<T, R> = Validator<T, R>> extends Validator<T, R> {
    /**
     * A method that clones the original validator with new parameters.
     *
     * Props is optional which means the new validator should be a copy with the original props.
     * @param props
     */
    clone(props?: P): ClonableValidator<T, R, P, V>;
}