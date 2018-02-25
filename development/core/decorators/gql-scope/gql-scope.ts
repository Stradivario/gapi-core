export function Scope(...arg: string[]): Function {
    const scope = {scope: arg};
    return (t: any, propertyName: string, descriptor) => {
        const target = t;
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            let result = originalMethod.apply(this, args);
            result = {...scope, ...result};
            return result;
        };
        return descriptor;
    };
  }