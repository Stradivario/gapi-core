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
const utilService: ServerUtilService = Container.get(ServerUtilService);
@Service()
export class GapiServerModule {

    start() {
    
        return utilService.startServer();
    }

    public static forRoot(config: AppConfigInterface) {
        Container.get(ConfigService).setAppConfig(config)
        return GapiServerModule;
    }

}

process.on(<any>'cleanup', () => {
    utilService.stopServer();
});
process.on('exit', function () {
    process.emit(<any>'cleanup');
});
process.on('SIGINT', function () {
    process.exit(2);
});
process.on('uncaughtException', function (e) {
    console.log(e.stack);
    process.exit(99);
});