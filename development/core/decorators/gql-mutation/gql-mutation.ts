import { ControllerContainerService } from "../../utils/services/controller-service/controller.service";
import Container from '../../utils/container/index';
import { GenericGapiResolversType } from "../../utils/services/controller-service/controller.service";
export function Mutation(options) {
    return (t: any, propKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const originalMethod = descriptor.value;
        const target = t;
        const propertyKey = propKey;
        descriptor.value = function (...args: any[]) {
            this.resolve = originalMethod.bind(target);
            this.args = options ? options : null;
            this.method_type = 'mutation';
            this.method_name = propertyKey;
            this.target = target;
            return this;
        };
        Container.get(ControllerContainerService)
            .createController(target.constructor.name)
            .setDescriptor(propertyKey, descriptor);
        return descriptor;
    }
}