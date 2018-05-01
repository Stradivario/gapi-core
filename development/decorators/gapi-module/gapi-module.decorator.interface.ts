import { Token } from '../../utils/container/Token';
import { ServerRegisterPluginObject, PluginBase , Plugin, PluginNameVersion, PluginPackage } from 'hapi';

export interface GapiModuleWithServices { gapiModule; services: GapiServiceArguments[]; }
export type GapiServiceArguments = Array<{provide: string; useValue?: any, useFactory?: Function, useClass: Function} | any>;
export interface GapiModuleArguments {
    imports?: Array<Function | any>;
    services?: Array<Function | any>;
    controllers?: Array<Function | any>;
    types?: Array<Function | any>;
    effects?: Array<Function | any>;
    plugins?: Array<PluginBase<any> & (PluginNameVersion | PluginPackage) | Function | any>;
}