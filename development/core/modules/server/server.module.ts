import Container, { Service, Token, Inject } from "typedi";
import { Observable } from 'rxjs/Observable';
import { AppConfigInterface } from "../../utils/services/config/config.interface";
import { GraphQLSchema } from "graphql";
import { ConfigService } from "../../utils/services/config/config.service";
import { ServerUtilService } from "../../utils/services/server/server.service";

export interface Config {
    port: string;
    cert: any;
    schema: GraphQLSchema;
};

@Service()
export class ConfigFactory {
    config: Config;
    setConfig(config: any) {
        this.config = config;
    }
}

@Service()
export class GapiServerModule {

    start() {
        const utilService:ServerUtilService = Container.get(ServerUtilService);
        return utilService.startServer();
    }

    public static forRoot(config: AppConfigInterface) {
        Container.get(ConfigService).setAppConfig(config)
        return GapiServerModule;
    }

}