import { Server } from 'hapi';
export declare class ServerUtilService {
    server: Server;
    registerEndpoints(endpoints: Array<any>): void;
    initGraphQl(): Promise<void>;
    connect(options: any): void;
    onRequest(): void;
    startServer(): Promise<{}>;
    stopServer(): any;
}
