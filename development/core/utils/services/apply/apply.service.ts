import Container, {Service} from '../../../utils/container/index';
import { GapiModuleArguments } from "../../../decorators/gapi-module/gapi-module.decorator.interface";
import { GapiServerModule } from "../../../modules/server/server.module";

export const ApplyServicesHook = (self, options: GapiModuleArguments) => {
    if (options.imports) {
        options.imports.forEach(m => Container.get(m));
    }
    if (options.services) {
        options.services.forEach(m => Container.get(m));
    }
    if (options.controllers) {
        options.controllers.forEach(m => Container.get(m));
    }
}