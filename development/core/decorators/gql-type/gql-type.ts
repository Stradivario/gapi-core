import { ControllerContainerService } from "../../utils/services/controller-service/controller.service";
import Container from '../../utils/container/index';

export function Type<T>(type): Function {
    type = { type: type };
    return (t: any, propKey: string, descriptor: TypedPropertyDescriptor<(id: T) => T>) => {
        const self = t;
        const originalMethod = descriptor.value;
        const propertyKey = propKey;
        descriptor.value = function (...args: any[]) {
            let returnValue = originalMethod.apply(this, args);
            Object.assign(returnValue, type);
            Container.get(ControllerContainerService).createController(self.constructor.name).setQuery(propertyKey, returnValue);
            return returnValue;
        };
        return descriptor;
    };
}