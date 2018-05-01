import { PluginBase, PluginNameVersion, PluginPackage } from 'hapi';
export declare class HapiPluginService {
    private plugins;
    register(plugin: any): void;
    getPlugins(): ((PluginBase<any> & PluginNameVersion) | (PluginBase<any> & PluginPackage))[];
}
