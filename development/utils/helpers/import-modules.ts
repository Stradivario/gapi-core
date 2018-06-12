import { getInjectables } from './get-injectables';
import Container from '../../utils/container/index';
import { ModuleContainerService } from '../services/module/module.service';

const moduleContainerService = Container.get(ModuleContainerService);

export function importModules(injectables, original, status) {
    injectables.map(injectable => {
        if (!injectable) {
            throw new Error(`Incorrect importing '${status}' inside ${original.name}`);
        }
        if (injectable.constructor === Object) {
            if (injectable.provide && injectable.useClass) {
                const original = injectable.useClass;
                const f: any = () => new original(...getInjectables(injectable));
                Container.set(injectable.provide, new f.constructor());
            } else if (injectable.provide && injectable.useFactory) {
                moduleContainerService.setLazyFactory(injectable, original);
            } else if (injectable.provide && injectable.useValue) {
                Container.set(injectable.provide, injectable.useValue);
            } else {
                throw new Error(`Wrong Injectable '${status}' ${injectable.provide ? JSON.stringify(injectable.provide) : ''} inside module: ${original.name}`);
            }
        } else {
            let name = injectable.name;
            if (name === 'f') {
                name = injectable.constructor.name;
            }
            Object.defineProperty(injectable, 'name', { value: name, writable: true });
            Container.get(injectable);
        }

    });
}