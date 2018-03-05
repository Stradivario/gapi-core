import Container, {Service} from '../../utils/container/index';
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

    stop() {
        return utilService.stopServer();
    }

}
