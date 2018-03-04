import { Server } from 'hapi';
export declare class ServerUtilService {
    server: Server;
    validateToken(token: string): Promise<{
        id: number;
        user: {
            id: number;
            type: string;
        };
    }>;
    registerEndpoints(endpoints: Array<any>): void;
    initGraphQl(): Promise<void>;
    connect(options: any): void;
    onRequest(): void;
    startServer(): Promise<{}>;
    stopServer(): Promise<Error>;
}
