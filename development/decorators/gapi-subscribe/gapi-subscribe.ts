import { ControllerContainerService } from '../../utils/services/controller-service/controller.service';
import Container from '../../utils/container/index';
import { ResolverFn, FilterFn } from 'graphql-subscriptions';

export function Subscribe<T>(asyncIteratorFunction: ResolverFn | AsyncIterator<T>, filterFn?: FilterFn): Function {
    const subscribe = {subscribe: asyncIteratorFunction};
    return (t: any, propKey: string, desc: TypedPropertyDescriptor<any>) => {
        const descriptor = desc;
        const originalMethod = descriptor.value;
        const propertyKey = propKey;
        const self = t;
        descriptor.value = function (...args: any[]) {
            const returnValue = originalMethod.apply(args);
            Object.assign(returnValue, subscribe);
            return returnValue;
        };
        Container.get(ControllerContainerService).createController(self.constructor.name).setDescriptor(propertyKey, descriptor);
        return descriptor;
    };
  }