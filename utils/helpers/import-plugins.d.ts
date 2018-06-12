import { PluginBase, PluginNameVersion, PluginPackage } from 'hapi';
export declare function importPlugins(plugins: Array<PluginBase<any> & (PluginNameVersion | PluginPackage) | Function>, original: any, status: any): Promise<void>;
