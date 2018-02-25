import Container, { Service, Token, Inject } from "typedi";
import { Observable } from 'rxjs/Observable';

export interface Factory {
    config: any;
    setConfig(config: any): void;
}


@Service()
export class ConfigFactory implements Factory {
    config: any;
    setConfig(config: any) {
        this.config = config;
    }
}

@Service()
export class GapiServerModule {
    config: any;
    constructor() {
        Object.assign(this, Container.get(ConfigFactory));
    }
    start() {
        return 1;
    }
    public static forRoot(config?: { port: string }) {
        Container.get(ConfigFactory).setConfig(config);
        return GapiServerModule;
    }

}