import { Server, ServerOptions } from 'hapi';
import { ConfigService } from '../..';
export declare class ServerUtilService {
    serverConnectionOptions: ServerOptions;
    server: Server;
    registerEndpoints(endpoints: Array<any>): Promise<void>;
    initGraphQl(configContainer: ConfigService): Promise<void>;
    connect(options: ConfigService): Promise<void>;
    startServer(): Promise<Server>;
    stopServer(): Promise<void>;
}
