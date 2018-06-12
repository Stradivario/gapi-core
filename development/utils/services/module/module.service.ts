import { GraphQLObjectType, GraphQLNonNull } from 'graphql';
import { Service } from '../../../utils/container/index';
import { Subject } from 'rxjs/Subject';
import { GapiModuleArguments } from '../../../decorators/gapi-module/gapi-module.decorator.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Container } from '../../container';
import { getInjectables, importModules, importPlugins } from '../../helpers';

export class ModuleMapping {
    _module_name: string;
    _injectables: GapiModuleArguments;
    _handlers: BehaviorSubject<Array<any>> = new BehaviorSubject([]);

    constructor(name: string, injectables: GapiModuleArguments) {
        this._module_name = name;
        this._injectables = injectables;
    }

    async registerDependencyHandler(module): Promise<boolean> {
        const originalFactory = module.useFactory;
        module.useFactory = function () {
            if (module.deps && module.deps.length) {
                return originalFactory(...module.deps);
            } else {
                return originalFactory();
            }
        };
        Container.set(module.provide, module.useFactory());
        this._handlers.next([...this._handlers.getValue(), module]);

        return await true;
    }

    async resolveDependencyHandlers(): Promise<any> {
        this._handlers.getValue().forEach(handler => {
            const injectables = [...handler.deps];
            let resolvedInjectables = [];
            injectables.forEach(i => {
                if (i.constructor === Function) {
                    // resolvedInjectables = [...resolvedInjectables, Container.get(i)];
                } else {
                    resolvedInjectables = [...resolvedInjectables, i];
                }
            });
            const originalFactory = handler.useFactory;
            handler.useFactory = function () {
                console.log(resolvedInjectables);
                return originalFactory(...resolvedInjectables);
            };
            Container.set(handler.provide, handler.useFactory());
            console.log(Container.get(handler.provide));
        });
        return await true;
    }
}

@Service()
export class ModuleContainerService {
    modules: Map<string, ModuleMapping> = new Map();
    lazyFactories: Map<string, ModuleMapping> = new Map();
    getModule(name: string): ModuleMapping {
        if (this.modules.has(name)) {
            return this.modules.get(name);
        } else {
            throw new Error('Missing module internal Gapi Error!');
        }
    }

    createModule(name: string, injectables: GapiModuleArguments): ModuleMapping {
        if (this.modules.has(name)) {
            return this.modules.get(name);
        } else {
            this.modules.set(name, new ModuleMapping(name, injectables));
            return this.modules.get(name);
        }
    }

    async testCreateModuleAsync(module, original) {
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
        console.log('Loaded Module: ' + original.name);
        // return Promise.all();
    }

    setLazyFactory(module, original) {
        if (module.useFactory.constructor === Function) {
            if (module.deps && module.deps.length) {
                const originalFactory = module.useFactory;
                module.useFactory = () => originalFactory(...getInjectables(module));
            }
            // moduleContainerService.createModule(original.name, null).registerDependencyHandler(module);

            Container.set(module.provide, module.useFactory());
        } else {
            throw new Error(`Wrong Factory function ${module.provide ? JSON.stringify(module.provide) : ''} inside module: ${original.name}`);
        }
    }


}