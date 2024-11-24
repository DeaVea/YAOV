# YAOV - Yet Another Object Validator

An object validator that is purely fuctional.

* Allows for full treeshaking and inlining.
* Fully written in Typescript.
* Fully customizable.
* Provides very detailed error messaging.  It provides the exact location of where the object did not meet validation.
* Absolutely no dependencies

## Insructions

The basic premise of this object validator is to put in an object and spit out a mutated, but valid object.

The basic element is the `Validator` class which is simply:

```Typescript
export type Validator<T, R = T> = (key: string | number | symbol, value: T) => R;
```

That is, it is a function that takes in the "key" that the attribute is attached to, and the orignal value that is inserted.  The Return is the mutated object that is created on successsful valdiation.  The default is the original object.

For example:

```Typescript
interface MyObjectKey {
    encoding: string;
    value: string;
}

interface MyObject {
    key: MyObjectKey;
    name: string;
    date: Date;
    imgUrl: URL;
}

const KeyValidator: Validator<string, MyObjectKey> = (key, originalKey) {
    if (originalKey == null) {
        throw new ValidationError([`${String(key)}: The \"key\" provided must be defined. However the \"key\" provided did not exist.`]);
    }
    return {
        key: Buffer.from(String(originalkey)).toString("base64"),
        encoding: "base64"
    };
}

const myObjectValidator: ValidationObject<MyObject> = {
    key: KeyValidator,
    name: stringValidator(),
    date: dateValidator(),
    imgUrl: urlValidator()
}

const myKeyValidator = objectValidator(myObjectValidator);

const validatedObject = myKeyValidator("root", {
    key: "MyKey",
    name: "TestName",
    date: new Date(2024, 11, 23),
    imgUrl: new URL("https://myImgLoc.com/img.png")
});
console.log(JSON.stringify(validatedObject, undefined, 2));
```

The returned object will be

```json
{
    "key": {
        "key": "TXlLZXk=",
        "encoding": "base64"
    },
    "name": "TestName",
    "date": "2024-11-23T00:00:000Z",
    "imgUrl": "https://myImgLoc.com/img.png"
}
```

## Available Validators

### AndValidator

The "andValidator" takes an array of validators and will only pass if all of the validators do *not* throw an error.

```Typescript
const myValidationObj: ValidationObject<{ key: string }> = {
    key: andValidator(
        requiredValidator(),
        stringValidator(),
    )
}
```

### ArrayValidator

This will validate that the incoming item is an array and then run validations on each item in the array. It only passes if every
item is valid.

```Typescript
const myValidationObj: ValidationObject<{ arr: int[] }> = {
    arr: arrayValidator(
        andValidator(
            requiredValidator(),
            stringValidator
        )
    )
}
```

### ContitionalValidator

This will only run validators based on a specific condition that has to be met. It moves down an array of conditions and will
validate the first one that does *not* return null or undefined.

```Typescript
const myValidationObj: ValidationObj<{ payload: { type: string } }> = {
    payload: conditionalValidator([
        (key, value: { type: string }) => type === "payload1" ? payload1Validator() : undefined,
        (key, value: { type: string }) => type === "payload2" ? payload2Validator() : undefined,
        (key, value: { type: string }) => type === "payload3" ? payload3Validator() : noValidator()
    ])
}
```

With the above code, the conditionalValidator will first check if the type is "payload1".  If it receives another validator, then it will execute the validation.  If not, then it will check for "payload2", then "payload3".  If it is neither type, then it will do a "noValidator" which just lets it succeed without any checking. Alternately, you can return undefined which will throw an error as an invalid type found.