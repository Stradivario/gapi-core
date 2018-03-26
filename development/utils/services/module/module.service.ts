import { GraphQLObjectType, GraphQLNonNull } from "graphql";
import { Service } from '../../../utils/container/index';
import { Subject } from "rxjs/Subject";
import { GapiModuleArguments } from "../../../decorators/gapi-module/gapi-module.decorator.interface";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Container } from "../../container";

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
            return originalFactory(...module.deps);
        }
        Container.set(module.provide, module.useFactory());
        this._handlers.next([...this._handlers.getValue(), module]);

        return await true;
    }

    async resolveDependencyHandlers(): Promise<any> {
        this._handlers.getValue().forEach(handler => {
            let injectables = [...handler.deps];
            let resolvedInjectables = [];
            injectables.forEach(i => {
                if (i.constructor === Function) {
                    // resolvedInjectables = [...resolvedInjectables, Container.get(i)];
                } else {
                    resolvedInjectables = [...resolvedInjectables, i];
                }
            })
            const originalFactory = handler.useFactory;
            handler.useFactory = function () {
                console.log(resolvedInjectables)
                return originalFactory(...resolvedInjectables);
            }
            Container.set(handler.provide, handler.useFactory())
            console.log(Container.get(handler.provide))
        });
        return await true;
    }
}

@Service()
export class ModuleContainerService {
    modules: Map<string, ModuleMapping> = new Map();
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


}