import { ControllerContainerService } from '../../utils/services/controller-service/controller.service';
import Container from '../../utils/container/index';
import { GenericGapiResolversType } from '../../utils/services/controller-service/controller.service';
import { CacheService } from '../../utils/services/events/ngx-events-layer.service';
export function Effect(name: string): Function {
    const type = { effect:  name };
    Container.get(CacheService).getLayer<Array<any>>(name);
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