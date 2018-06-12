import { Subject } from 'rxjs/Subject';
import { ControllerMappingSettings } from './controller-config';
import { GenericGapiResolversType } from './controller-types';

export class ControllerMapping {
    _controller_name: string;
    _settings: ControllerMappingSettings = new ControllerMappingSettings();
    _type: string;
    _descriptors: Map<string, TypedPropertyDescriptor<() => GenericGapiResolversType>> = new Map();
    _ready: Subject<boolean> = new Subject();
    constructor(name: string, type?: string) {
        this._controller_name = name;
        this._type = type;
    }

    setSettings(settings: ControllerMappingSettings) {
        this._settings = settings;
    }

    setDescriptor(name: string, descriptor: TypedPropertyDescriptor<() => GenericGapiResolversType>): void {
        this._descriptors.set(name, descriptor);
    }

    getDescriptor(name: string): TypedPropertyDescriptor<() => GenericGapiResolversType> {
        return this._descriptors.get(name);
    }

    getAllDescriptors(): string[] {
        return Array.from(this._descriptors.keys());
    }

}
