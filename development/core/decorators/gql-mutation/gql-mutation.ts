
export function Mutation(options?: { [key: string]: { [key: string]: any } }) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const originalMethod = <any>descriptor.value || {};
        const self = target;
        descriptor.value = function (...args: any[]) {
            let result = originalMethod.apply(this, args);
           
            if (options) {
                let mockArgs = {};
                Object.keys(options).forEach(a => {
                    mockArgs[a] = {};
                    mockArgs[a].type = options[a];
                });
                result = { ...{ args: mockArgs }, ...result };
            }

            if (result.scope) {
                result = { ...{ scope: result.scope }, ...result };
            } else {
                if (self.Gconfig.scope) {
                    result = { ...{ scope: self.Gconfig.scope }, ...result };
                }
            }

            if (self.Gconfig.type) {
                result = { ...{ type: self.Gconfig.type }, ...result };
            }
            result.resolve = originalMethod;
            return result;
        };
        return descriptor;
    }
}