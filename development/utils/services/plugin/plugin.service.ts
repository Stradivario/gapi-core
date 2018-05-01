import { Service } from '../../../utils/container/index';
import { BehaviorSubject } from 'rxjs';
import { PluginBase, PluginNameVersion, PluginPackage } from 'hapi';

@Service()
export class HapiPluginService {

    private plugins: BehaviorSubject<Array<PluginBase<any> & (PluginNameVersion | PluginPackage)>> = new BehaviorSubject([]);

    register(plugin) {
        this.plugins.next([...this.plugins.getValue(), plugin]);
    }

    getPlugins() {
        return this.plugins.getValue();
    }

}