
export function Mutation(t: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const target = t;
    const originalMethod = descriptor.value || {};
    descriptor.value = function (...args: any[]) {
        let result = originalMethod.apply(this, args);
        result.resolve = originalMethod;
        return result;
    };
    return descriptor;
}