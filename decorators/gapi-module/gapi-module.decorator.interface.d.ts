import { PluginBase, PluginNameVersion, PluginPackage } from 'hapi';
export interface GapiModuleWithServices {
    gapiModule: any;
    services: Array<GapiServiceArguments | Function>;
}
export interface GapiServiceArguments {
    provide: any;
    useValue?: any;
    useFactory?: Function;
    useClass?: Function;
}
export interface GapiModuleArguments {
    imports?: Array<Function | GapiModuleWithServices>;
    services?: Array<Function | GapiServiceArguments>;
    controllers?: Array<Function>;
    types?: Array<Function>;
    effects?: Array<Function>;
    plugins?: Array<PluginBase<any> & (PluginNameVersion | PluginPackage) | Function>;
}
