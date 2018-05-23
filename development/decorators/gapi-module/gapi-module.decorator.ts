import { GapiModuleArguments, GapiServiceArguments, GapiModuleWithServices } from './gapi-module.decorator.interface';
import { GapiModuleSymbol } from './gapi-module.symbol';
import 'reflect-metadata';
import Container from '../../utils/container/index';
import { ServiceMetadata } from '../../utils/container';
import { ModuleContainerService } from '../../utils/services/module/module.service';
import { HapiPluginService } from '../../utils/services/plugin/plugin.service';
import { PluginBase, PluginNameVersion, PluginPackage } from 'hapi';

const moduleContainerService = Container.get(ModuleContainerService);
const hapiPluginService = Container.get(HapiPluginService);

function getInjectables(module) {
    const injectables = [];
    module.deps.forEach(i => {
        if (i.name) {
            return injectables.push(Container.get(i));
        } else if (i.constructor === Function) {
            return injectables.push(Container.get(i));
        } else {
            return injectables.push(i);
        }
    });
    return injectables;
}

function importPlugins(plugins: Array<PluginBase<any> & (PluginNameVersion | PluginPackage) | Function>, original, status) {
    plugins.forEach(plugin => {
        if (plugin.constructor === Function) {
            hapiPluginService.register(Container.get(plugin));
        } else {
            hapiPluginService.register(plugin);
        }
    });
}

function importModules(modules, original, status) {
    modules.forEach((module) => {
        if (!module) {
            throw new Error(`Incorrect importing '${status}' inside ${original.name}`);
        }
        if (module.constructor === Object) {
            if (module.provide && module.useClass) {
                const original = module.useClass;
                const f: any = () => new original(...getInjectables(module));
                Container.set(module.provide, new f.constructor());
            } else if (module.provide && module.useFactory) {
                if (module.useFactory.constructor === Function) {
                    if (module.deps && module.deps.length) {
                        const originalFactory = module.useFactory;
                        module.useFactory = () => originalFactory(...getInjectables(module));
                    }
                    moduleContainerService.createModule(original.name, null).registerDependencyHandler(module);
                    Container.set(module.provide, module.useFactory());
                } else {
                    throw new Error(`Wrong Factory function ${module.provide ? JSON.stringify(module.provide) : ''} inside module: ${original.name}`);
                }
            } else if (module.provide && module.useValue) {
                Container.set(module.provide, module.useValue);
            } else {
                throw new Error(`Wrong Injectable '${status}' ${module.provide ? JSON.stringify(module.provide) : ''} inside module: ${original.name}`);
            }
        } else {
            let name = module.name;
            if (name === 'f') {
                name = module.constructor.name;
            }
            Object.defineProperty(module, 'name', { value: name, writable: true });
            Container.get(module);
        }

    });
}

export function GapiModule<T, K extends keyof T>(module?: GapiModuleArguments) {
    return (target) => {
        const original = target;
        function construct(constructor, args) {
            const c: any = function () {
                if (!module) {
                    return new constructor();
                }
                if (module.types) {
                    importModules(module.types, original, 'types');
                }
                if (module.effects) {
                    importModules(module.effects, original, 'effects');
                }
                if (module.services) {
                    importModules(module.services, original, 'services');
                }
                if (module.imports) {
                    importModules(module.imports, original, 'imports');
                }
                if (module.controllers) {
                    importModules(module.controllers, original, 'controllers');
                }
                if (module.plugins) {
                    importPlugins(module.plugins, original, 'plugins');
                }
                this.injectables = module;
                moduleContainerService.createModule(original.name, this.injectables);
                return new constructor();
            };

            c.prototype = constructor.prototype;
            Object.defineProperty(c, 'name', { value: constructor.name, writable: true });
            return Container.get(c);

        }
        const f: any = function (...args) {
            console.log('Loaded Module: ' + original.name);
            return construct(original, args);
        };
        f.prototype = original.prototype;
        if (original.forRoot) {
            f.forRoot = original.forRoot;
            const originalForRoot = f.forRoot;
            f.forRoot = function (args) {
                const result: GapiModuleWithServices = originalForRoot(args);
                if (!result.services) {
                    console.info(`Consider return ${original.name}; if you dont want to use GapiModuleWithServices interface to return Pre initialized configuration services`);
                    console.info(`Your Gapi module loaded as regular import please remove ${original.name}.forRoot() and instead import just ${original.name}`);
                } else {
                    importModules(result.services, original, 'services');
                }
                return result.gapiModule ? result.gapiModule : result;
            };
        }
        return f;
    };
}