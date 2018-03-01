import Container from "typedi";
import { GapiModuleArguments } from "../../../decorators/gql-module/gql-module.decorator.interface";
import { GapiServerModule } from "../../../modules/server/server.module";

export const ApplyServicesHook = (self, options: GapiModuleArguments) => {
    if (options.imports) {
        options.imports.forEach(module => {
            const currentModule = Container.get(module);
            // Object.assign(self, { [currentModule.constructor.name]: currentModule});
            // if (currentModule instanceof GapiServerModule) {
            //     // Object.assign(self, {start: currentModule.start});
            // }
        });
    }
    if (options.services) {
        options.services.forEach(m => {
            const currentService = Container.get(m);
            // Object.assign(self, { [currentService.constructor.name]: currentService});
        });
    }

    if (options.controllers) {
        options.controllers.forEach(m => {
            const currentService = Container.get(m);
            // Object.assign(self, { [currentService.constructor.name]: currentService});
        });
    }
}