import { ServiceOptions } from '../types/ServiceOptions';
import { Token } from '../Token';
export interface GapiHapiPluginInterface {
    name: string;
    version: string;
    register(server: any, options: any): void;
    handler(request: any, h: any): any;
}
export declare function GapiHapiPlugin<T, K extends keyof T>(optionsOrServiceName?: ServiceOptions<T, K> | Token<any> | string): Function;