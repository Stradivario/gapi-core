import { Token } from '../../utils/container/Token';
import { ServerRegisterPluginObject, PluginBase , Plugin, PluginNameVersion, PluginPackage } from 'hapi';

export interface GapiModuleWithServices {
    gapiModule;
    services: Array<GapiServiceArguments | Function>;
}
export interface GapiServiceArguments {provide: string; useValue?: any; useFactory?: Function; useClass?: Function; }
export interface GapiModuleArguments {
    imports?: Array<Function | GapiModuleWithServices>;
    services?: Array<Function | GapiServiceArguments>;
    controllers?: Array<Function>;
    types?: Array<Function>;
    effects?: Array<Function>;
    plugins?: Array<PluginBase<any> & (PluginNameVersion | PluginPackage) | Function>;
}