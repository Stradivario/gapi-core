import { GapiModuleArguments, GapiServiceArguments, GapiModuleWithServices } from './gapi-module.decorator.interface';
import { GapiModuleSymbol } from './gapi-module.symbol';
import 'reflect-metadata';
import Container from '../../utils/container/index';
import { ServiceMetadata } from '../../utils/container';
import { getInjectables, importPlugins, importModules } from '../../utils/helpers';

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
                // const moduleContainerService = Container.get(ModuleContainerService);
                // moduleContainerService.testCreateModuleAsync(module, original);
                console.log('Loaded Module: ' + original.name);
                return new constructor();
            };

            c.prototype = constructor.prototype;
            Object.defineProperty(c, 'name', { value: constructor.name, writable: true });
            return Container.get(c);

        }
        const f: any = function (...args) {
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