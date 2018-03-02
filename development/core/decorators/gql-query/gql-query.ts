import { ControllerContainerService } from "../../utils/services/controller-service/controller.service";
import Container from '../../utils/container/index';
import { GenericGapiResolversType } from "../../utils/services/controller-service/controller.service";
export function Query<T>(options) {
    return (target: any, propKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const originalMethod = descriptor.value;
        const self = target;
        const propertyKey = propKey;
        descriptor.value = function (...args: any[]) {
            let returnValue: GenericGapiResolversType = Object.create({});
            returnValue.resolve = originalMethod.bind(self);
            returnValue.args = options ? options : null;
            returnValue.method_type = 'query';
            returnValue.method_name = propertyKey;
            return returnValue;
        };
        Container.get(ControllerContainerService)
            .createController(self.constructor.name)
            .setDescriptor(propertyKey, descriptor);
        return descriptor;
    }
}
