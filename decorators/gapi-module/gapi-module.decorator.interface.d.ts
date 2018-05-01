import { Token } from '../../utils/container/Token';
import { PluginBase, PluginNameVersion, PluginPackage } from 'hapi';
export interface Containers {
    token: Token<any>;
    useFactory: () => any;
}
export interface GapiModuleArguments {
    imports?: Array<Containers | any>;
    services?: Array<Containers | any>;
    controllers?: Array<Containers | any>;
    types?: Array<Containers | any>;
    effects?: Array<Containers | any>;
    plugins?: Array<PluginBase<any> & (PluginNameVersion | PluginPackage) | Function>;
}
