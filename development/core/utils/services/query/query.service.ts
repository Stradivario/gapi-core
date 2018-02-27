import { Service } from "typedi";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Service()
export class GapiQueryService {
    queries: Map<any, any> = new Map();

    get(name: string) {
        if (this.queries.has(name)) {
            return this.queries.get(name);
        } else {
            return {};
        }
    }

    set(name: string, config: any) {
        this.queries.set(name, config);
    }
}