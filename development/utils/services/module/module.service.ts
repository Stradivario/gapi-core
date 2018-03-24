import { GraphQLObjectType, GraphQLNonNull } from "graphql";
import { Service } from '../../../utils/container/index';
import { Subject } from "rxjs/Subject";
import { GapiModuleArguments } from "../../../decorators/gapi-module/gapi-module.decorator.interface";

export class ModuleMapping {
    _module_name: string;
    _injectables: GapiModuleArguments;

    constructor(name: string, injectables: GapiModuleArguments) {
        this._module_name = name;
        this._injectables = injectables;
    }

}

@Service()
export class ModuleContainerService {
    controllers: Map<string, ModuleMapping> = new Map()
    getModule(name: string): ModuleMapping {
        if(!this.controllers.has(name)) {
            return this.controllers.get(name);
        } else {
            throw new Error('Missing module controllers internal Gapi Error!');
        }
    }
    createModule(name: string, injectables: GapiModuleArguments): ModuleMapping {
        if (this.controllers.has(name)) {
            return this.controllers.get(name);
        } else {
            this.controllers.set(name, new ModuleMapping(name, injectables));
            return this.controllers.get(name);
        }

    }

}