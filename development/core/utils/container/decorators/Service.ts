import { ServiceMetadata } from "../types/ServiceMetadata";
import { Container } from "../Container";
import { ServiceOptions } from "../types/ServiceOptions";
import { Token } from "../Token";
import { ControllerMappingSettings, ControllerContainerService } from "../../services/controller-service/controller.service";

/**
 * Marks class as a service that can be injected using Container.
 */
export function Service(): Function;

/**
 * Marks class as a service that can be injected using Container.
 */
export function Service(name: string): Function;

/**
 * Marks class as a service that can be injected using Container.
 */
export function Service(token: Token<any>): Function;

/**
 * Marks class as a service that can be injected using Container.
 */
export function Service<T, K extends keyof T>(options?: ServiceOptions<T, K>): Function;

/**
 * Marks class as a service that can be injected using container.
 */
export function Service<T, K extends keyof T>(optionsOrServiceName?: ServiceOptions<T, K> | Token<any> | string): Function {
    return function (target: Function) {

        const service: ServiceMetadata<T, K> = {
            type: target
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
    };
}