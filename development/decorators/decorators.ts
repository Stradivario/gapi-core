import 'reflect-metadata';

const requiredMetadataKey = Symbol('required');

export function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    const existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

export function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
    const method = descriptor.value;
    descriptor.value = function () {
        const requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
        if (requiredParameters) {
            for (const parameterIndex of requiredParameters) {
                if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
                    throw new Error('Missing required argument.');
                }
            }
        }

        return method.apply(this, arguments);
    };
}
export function log(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value; // save a reference to the original method

    // NOTE: Do not use arrow syntax here. Use a function expression in
    // order to use the correct value of `this` in this method (see notes below)
    descriptor.value = function (...args: any[]) {
        // pre
        console.log('The method args are: ' + JSON.stringify(args[0].option.value));
        // run and store result
        const result = originalMethod.apply(this, args);
        // post
        console.log('The return value is: ' + result);
        // return the result of the original method (or modify it before returning)
        return result + 'modified';
    };

    return descriptor;
}
