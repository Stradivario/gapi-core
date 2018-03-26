import { GapiModuleArguments } from "../../../decorators/gapi-module/gapi-module.decorator.interface";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
export declare class ModuleMapping {
    _module_name: string;
    _injectables: GapiModuleArguments;
    _handlers: BehaviorSubject<Array<any>>;
    constructor(name: string, injectables: GapiModuleArguments);
    registerDependencyHandler(module: any): Promise<boolean>;
    resolveDependencyHandlers(): Promise<any>;
}
export declare class ModuleContainerService {
    modules: Map<string, ModuleMapping>;
    getModule(name: string): ModuleMapping;
    createModule(name: string, injectables: GapiModuleArguments): ModuleMapping;
}
