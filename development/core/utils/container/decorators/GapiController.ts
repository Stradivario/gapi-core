import { ServiceMetadata } from "../types/ServiceMetadata";
import { ServiceOptions } from "../types/ServiceOptions";
import { ControllerMappingSettings, ControllerContainerService } from "../../services/controller-service/controller.service";
import { Token } from "../Token";
import {Container} from "../Container";

export function GapiController<T, K extends keyof T>(optionsOrServiceName?: ControllerMappingSettings): Function {
    return function (target) {
        const original = target;
        Object.assign(original.prototype, new original())
        const service: ServiceMetadata<T, K> = {
            type: original
        };

        if (typeof optionsOrServiceName === "string" || optionsOrServiceName instanceof Token) {
            service.id = optionsOrServiceName;
            service.multiple = (optionsOrServiceName as ServiceOptions<T, K>).multiple;
            service.global = (optionsOrServiceName as ServiceOptions<T, K>).global || false;
            service.transient = (optionsOrServiceName as ServiceOptions<T, K>).transient;

        } else if (optionsOrServiceName) { // ServiceOptions
            service.id = (optionsOrServiceName as ServiceOptions<T, K>).id;
            service.factory = (optionsOrServiceName as ServiceOptions<T, K>).factory;
            service.multiple = (optionsOrServiceName as ServiceOptions<T, K>).multiple;
            service.global = (optionsOrServiceName as ServiceOptions<T, K>).global || false;
            service.transient = (optionsOrServiceName as ServiceOptions<T, K>).transient;
        }
        Container.set(service);
    };
}