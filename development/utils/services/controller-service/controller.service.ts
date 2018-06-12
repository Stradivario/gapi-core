import { Service } from '../../../utils/container/index';
import { ControllerMapping } from './controller-mapping';

@Service()
export class ControllerContainerService {
    controllers: Map<string, ControllerMapping> = new Map();
    getController(name: string): ControllerMapping {
        if (!this.controllers.has(name)) {
            return this.createController(name);
        } else {
            return this.controllers.get(name);
        }
    }
    createController(name: string): ControllerMapping {
        if (this.controllers.has(name)) {
            return this.controllers.get(name);
        } else {
            this.controllers.set(name, new ControllerMapping(name));
            return this.controllers.get(name);
        }

    }

    controllerReady(name: string) {
        this.getController(name)._ready.next(true);
    }

}