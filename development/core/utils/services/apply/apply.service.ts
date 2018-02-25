import Container from "typedi";
import { GapiServerModule } from "../../../server/server.module";
import { GapiModuleArguments } from "../../../decorators/gql-module/gql-module.decorator.interface";

export const ApplyServicesHook = (self, options: GapiModuleArguments) => {
    if (options.imports) {
        options.imports.forEach(module => {
            const currentModule = Container.get(module);
            // Object.assign(self, { [currentModule.constructor.name]: currentModule});
            if (currentModule instanceof GapiServerModule) {
                Object.assign(self, {start: currentModule.start});
                Object.assign(self, {config: currentModule.config});
            }
        });
    }
    if (options.services) {
        options.services.forEach(m => {
            const currentModule = Container.get(m);
            Object.assign(self, { [currentModule.constructor.name]: currentModule});
        });
    }
}