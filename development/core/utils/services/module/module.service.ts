import { Service } from "typedi";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Service()
export class ModuleService {

    modules: Map<any, any> = new Map();

    get(name: string) {
        if (this.modules.has(name)) {
            return this.modules.get(name);
        } else {
            throw new Error(`Missing module: ${name}`);
        }
    }

    set(name: string, config: any) {
        if (!this.modules.has(name)) {
            this.modules.set(name, config);
        }
        
    }
}
