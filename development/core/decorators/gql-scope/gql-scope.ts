import { ControllerContainerService } from "../../utils/services/controller-service/controller.service";
import Container from '../../utils/container/index';

export function Scope<T>(...arg: string[]): Function {
    let scope = {scope: arg};
    // TypedPropertyDescriptor<(id: T) => T>
    return (t: any, propKey: string, desc: TypedPropertyDescriptor<any>) => {
        const descriptor = desc;
        const originalMethod = descriptor.value;
        const propertyKey = propKey;
        const self = t;
        descriptor.value = function (...args: any[]) {
            let returnValue = originalMethod.apply(this, args);
            Object.assign(returnValue, scope);
            Container.get(ControllerContainerService).createController(self.constructor.name).setQuery(propertyKey, returnValue);
            return returnValue;
        };
        descriptor.value();
        return descriptor;
    };
  }