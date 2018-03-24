export declare class ConnectionHookService {
    modifyHooks: {
        onSubConnection?: Function;
        onSubOperation?: Function;
    };
    onSubOperation(message: any, params: any, webSocket: any): any;
    onSubConnection(connectionParams: any): {
        id: number;
        userId: number;
        user: {
            id: number;
            type: string;
        };
    };
}
