import { Subject } from 'rxjs/Subject';
import { ControllerMappingSettings } from './controller-config';
import { GenericGapiResolversType } from './controller-types';
export declare class ControllerMapping {
    _controller_name: string;
    _settings: ControllerMappingSettings;
    _type: string;
    _descriptors: Map<string, TypedPropertyDescriptor<() => GenericGapiResolversType>>;
    _ready: Subject<boolean>;
    constructor(name: string, type?: string);
    setSettings(settings: ControllerMappingSettings): void;
    setDescriptor(name: string, descriptor: TypedPropertyDescriptor<() => GenericGapiResolversType>): void;
    getDescriptor(name: string): TypedPropertyDescriptor<() => GenericGapiResolversType>;
    getAllDescriptors(): string[];
}
