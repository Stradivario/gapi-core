import { Server, ServerOptions } from 'hapi';
export declare class ServerUtilService {
    serverConnectionOptions: ServerOptions;
    server: Server;
    registerEndpoints(endpoints: Array<any>): Promise<void>;
    initGraphQl(): Promise<void>;
    connect(options: any): Promise<void>;
    onRequest(): void;
    startServer(): Promise<{}>;
    stopServer(): Promise<void>;
}
