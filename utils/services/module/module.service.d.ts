import { GapiModuleArguments } from "../../../decorators/gapi-module/gapi-module.decorator.interface";
export declare class ModuleMapping {
    _module_name: string;
    _injectables: GapiModuleArguments;
    constructor(name: string, injectables: GapiModuleArguments);
}
export declare class ModuleContainerService {
    controllers: Map<string, ModuleMapping>;
    getModule(name: string): ModuleMapping;
    createModule(name: string, injectables: GapiModuleArguments): ModuleMapping;
}
