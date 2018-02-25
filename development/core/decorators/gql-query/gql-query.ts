
export function Query<T>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<(id: T) => T>) {
    const originalMethod = <any>descriptor.value || {};
    descriptor.value = function (...args: any[]) {
        const result = originalMethod.apply(this, args);
        console.log(result)
        return result;
    };
    return descriptor;
}
