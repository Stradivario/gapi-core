import { ControllerContainerService } from "../../utils/services/controller-service/controller.service";
import Container from '../../utils/container/index';

export function Query<T>(options?: { [key: string]: { [key: string]: any } }) {
    return (target: any, propKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const originalMethod = descriptor.value || {};
        const self = target;
        const propertyKey = propKey;
        
        const currentController = Container.get(ControllerContainerService).createController(self.constructor.name);
        descriptor.value = function (...args: any[]) {
            let returnValue = Object.create({});
            returnValue.resolve = originalMethod.bind(self);
            returnValue.args = options ? options : null;
            currentController.setQuery(propertyKey, returnValue);
            return returnValue;
        };
        descriptor.value();
        return descriptor;
    }
}
