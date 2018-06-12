import { ControllerContainerService } from '../../utils/services/controller-service/controller.service';
import Container from '../../utils/container/index';

interface ResolveMetadata<T> {
    resolve: () => T;
    key: string;
}

export function Resolve<T>(key) {
    return (t: any, propKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const originalMethod = descriptor.value;
        const target = t;
        const metadata: ResolveMetadata<T>[] = target._metadata || [];
        metadata.push({ key: key, resolve: descriptor.value });
        target.constructor.prototype._metadata = metadata;
        return descriptor;
    };
}


