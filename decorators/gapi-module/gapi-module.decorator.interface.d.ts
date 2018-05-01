import { PluginBase, PluginNameVersion, PluginPackage } from 'hapi';
export interface GapiModuleWithServices {
    gapiModule: any;
    services: GapiServiceArguments[];
}
export declare type GapiServiceArguments = Array<{
    provide: string;
    useValue?: any;
    useFactory?: Function;
    useClass: Function;
} | any>;
export interface GapiModuleArguments {
    imports?: Array<Function | any>;
    services?: Array<Function | any>;
    controllers?: Array<Function | any>;
    types?: Array<Function | any>;
    effects?: Array<Function | any>;
    plugins?: Array<PluginBase<any> & (PluginNameVersion | PluginPackage) | Function | any>;
}
