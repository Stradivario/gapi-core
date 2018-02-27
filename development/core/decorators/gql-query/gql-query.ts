
export function Query<T>(options?: { [key: string]: { [key: string]: any } }) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const originalMethod = <any>descriptor.value || {};
        const self = target;
        descriptor.value = function (...args: any[]) {
            let result = originalMethod.apply(this, args);
            let mockArgs = {};
            if (options) {
                Object.keys(options).forEach(a => {
                    mockArgs[a] = {};
                    mockArgs[a].type = options[a];
                });
                result.args = mockArgs;
            }

            if (result.scope) {
                result.scope = result.scope
            } else {
                if (self.Gconfig.scope) {
                    result.scope = self.Gconfig.scope
                }
            }

            if (self.Gconfig.type) {
                result.type = self.Gconfig.type
            }
            // result.resolve = originalMethod.bind(self);
            console.log(result);
            return result;
        };
        return descriptor;
    }
}
