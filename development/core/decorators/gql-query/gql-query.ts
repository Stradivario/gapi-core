import { ControllerContainerService } from "../../utils/services/controller-service/controller.service";
import Container from '../../utils/container/index';
import { GenericGapiResolversType } from "../../utils/services/controller-service/controller.service";

  
export function Query<T>(options?: any) {
    return (t: any, propKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const originalMethod = descriptor.value;
        const target = t;
        const propertyKey = propKey;
        // Container.registerHandler({ object: target, propertyName: propKey, value: containerInstance => logger });
        descriptor.value = function (...args: any[]) {
            let returnValue: GenericGapiResolversType = Object.create({});
            Object.assign(returnValue, target);
            returnValue.resolve = originalMethod;
            returnValue.args = options ? options : null;
            returnValue.method_type = 'query';
            returnValue.method_name = propertyKey;
            returnValue.target = target;
            return returnValue;
        };

        Container.get(ControllerContainerService)
            .createController(target.constructor.name)
            .setDescriptor(propertyKey, descriptor);
        return descriptor;
    }
}


export function Logger() {
    return function(object: Object, propertyName: string, index?: number) {
        const logger = new ConsoleLogger();
        Container.registerHandler({ object, propertyName, index, value: containerInstance => logger });
    };
}

export interface LoggerInterface {

    log(message: string): void;

}

export class ConsoleLogger implements LoggerInterface {

    log(message: string) {
        console.log(message);
    }

}


