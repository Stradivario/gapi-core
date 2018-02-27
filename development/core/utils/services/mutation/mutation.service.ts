import { Service } from "typedi";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Service()
export class GapiMutationsService {
    mutations: Map<any, any> = new Map();

    get(name: string) {
        if (this.mutations.has(name)) {
            return this.mutations.get(name);
        } else {
            return {};
        }
    }

    set(name: string, config: any) {
        this.mutations.set(name, config);
    }
}