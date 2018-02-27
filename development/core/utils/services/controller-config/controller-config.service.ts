import { Service } from 'typedi';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Service()
export class ControllerConfigService {

    config: Map<any, {scope: string[], type: any}> = new Map();

    get(name: string) {
        if (this.config.has(name)) {
            return this.config.get(name);
        } else {
            return {};
        }
    }

    set(name: string, config: any) {
        this.config.set(name, config);
    }
}
