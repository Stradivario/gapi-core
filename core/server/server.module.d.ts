export interface Factory {
    config: any;
    setConfig(config: any): void;
}
export declare class ConfigFactory implements Factory {
    config: any;
    setConfig(config: any): void;
}
export declare class GapiServerModule {
    config: any;
    constructor();
    start(): number;
    static forRoot(config?: {
        port: string;
    }): typeof GapiServerModule;
}
