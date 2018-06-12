import { PluginBase, PluginNameVersion, PluginPackage } from 'hapi';
import Container from '../../utils/container/index';
import { HapiPluginService } from '../../utils/services/plugin/plugin.service';
const hapiPluginService = Container.get(HapiPluginService);

export function importPlugins(plugins: Array<PluginBase<any> & (PluginNameVersion | PluginPackage) | Function>, original, status) {
    plugins.forEach(plugin => {
        if (plugin.constructor === Function) {
            hapiPluginService.register(Container.get(plugin));
        } else {
            hapiPluginService.register(plugin);
        }
    });
    return Promise.resolve();
}
