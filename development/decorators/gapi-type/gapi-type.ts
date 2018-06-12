import { ControllerContainerService } from '../../utils/services/controller-service/controller.service';
import Container from '../../utils/container/index';

export function Type<T>(type): Function {
    const currentType = new type();
    if (!Container.has(currentType.name)) {
        Container.set(currentType.name, currentType);
    }
    type = { type:  Container.get(currentType.name) };
    return (t: any, propKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const self = t;
        const originalMethod = descriptor.value;
        const propertyKey = propKey;
        descriptor.value = function (...args: any[]) {
            const returnValue = originalMethod.apply(args);
            Object.assign(returnValue, type);
            return returnValue;
        };
        Container.get(ControllerContainerService).createController(self.constructor.name).setDescriptor(propertyKey, descriptor);
        return descriptor;
    };
}