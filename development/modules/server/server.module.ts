import { Service, Container } from '../../utils/container/index';
import { Observable } from 'rxjs/Observable';
import { AppConfigInterface } from '../../utils/services/config/config.interface';
import { GraphQLSchema } from 'graphql';
import { ConfigService } from '../../utils/services/config/config.service';
import { ServerUtilService } from '../../utils/services/server/server.service';
import { Server } from 'hapi';

export interface Config {
    port: string;
    cert: any;
    schema: GraphQLSchema;
}

const utilService: ServerUtilService = Container.get(ServerUtilService);
@Service()
export class GapiServerModule {

    hapiServer: Server = utilService.server;

    start(): Promise<boolean> {
        return utilService.startServer();
    }

    public static forRoot(config: AppConfigInterface) {
        Container.get(ConfigService).setAppConfig(config);
        return GapiServerModule;
    }

    stop() {
        return utilService.stopServer();
    }

}
