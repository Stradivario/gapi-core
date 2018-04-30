import { AppConfigInterface } from '../../utils/services/config/config.interface';
import { GraphQLSchema } from 'graphql';
export interface Config {
    port: string;
    cert: any;
    schema: GraphQLSchema;
}
export declare class GapiServerModule {
    start(): Promise<{}>;
    static forRoot(config: AppConfigInterface): typeof GapiServerModule;
    stop(): Promise<void>;
}
