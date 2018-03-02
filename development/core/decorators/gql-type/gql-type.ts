import { ControllerContainerService } from "../../utils/services/controller-service/controller.service";
import Container from '../../utils/container/index';
import { GenericGapiResolversType } from "../../utils/services/controller-service/controller.service";
export function Type<T>(type): Function {
    type = { type: type };
    return (t: any, propKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const self = t;
        const originalMethod = descriptor.value;
        const propertyKey = propKey;
        descriptor.value = function (...args: any[]) {
            let returnValue = originalMethod.apply(this, args);
            Object.assign(returnValue, type);
            return returnValue;
        };
        return descriptor;
    };
}