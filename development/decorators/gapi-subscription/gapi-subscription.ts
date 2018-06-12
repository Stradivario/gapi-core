import { ControllerContainerService } from '../../utils/services/controller-service/controller.service';
import Container from '../../utils/container/index';
import { GapiPubSubService } from '../../utils/services/pub-sub/pub-sub.service';

export function Subscription(options?: any) {
    return (t: any, propKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const originalMethod = descriptor.value;
        const target = t;
        const propertyKey = propKey;
        descriptor.value = function (...args: any[]) {
            const returnValue = Object.create({});
            returnValue.resolve = originalMethod;
            returnValue.args = options ? options : null;
            returnValue.method_type = 'subscription';
            returnValue.method_name = propertyKey;
            returnValue.target = target;
            return returnValue;
        };
        Container.get(ControllerContainerService)
            .createController(target.constructor.name)
            .setDescriptor(propertyKey, descriptor);
        return descriptor;
    };
}