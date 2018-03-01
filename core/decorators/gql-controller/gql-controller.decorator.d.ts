import 'reflect-metadata';
import { ControllerMappingSettings, GenericGapiResolversType } from '../../utils/services/controller-service/controller.service';
export interface GapiController {
    _controller_name: string;
    _settings: ControllerMappingSettings;
    _queries: Map<string, GenericGapiResolversType>;
    _subscriptions: Map<string, GenericGapiResolversType>;
    _mutations: Map<string, GenericGapiResolversType>;
}
export declare function GapiController<T, K extends keyof T>(settings?: ControllerMappingSettings): (target: any) => any;
