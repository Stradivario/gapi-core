import { Server } from 'hapi';
import { ConnectionHookService } from '../..';
export declare class ServerUtilService {
    private connectionHookService;
    server: Server;
    constructor(connectionHookService: ConnectionHookService);
    registerEndpoints(endpoints: Array<any>): void;
    initGraphQl(): Promise<void>;
    connect(options: any): void;
    onRequest(): void;
    startServer(): Promise<{}>;
    stopServer(): Promise<Error>;
}
