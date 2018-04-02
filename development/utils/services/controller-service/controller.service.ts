import { GraphQLObjectType, GraphQLNonNull } from 'graphql';
import { Service } from '../../../utils/container/index';
import { Subject } from 'rxjs/Subject';

export class ControllerMappingSettings {
    scope?: string[] = ['ADMIN'];
    type?: GraphQLObjectType;
    public?: boolean;
}

export interface GenericGapiResolversType {
    scope?: string[];
    target?: any;
    method_name?: string;
    method_type?: 'query' | 'subscription' | 'mutation' | 'event';
    type: GraphQLObjectType;
    resolve?(root: any, args: Object, context: any);
    args?: {
        [key: string]: {
            [type: string]: GraphQLObjectType | GraphQLNonNull<any>;
        };
    };
}


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

@Service()
export class ControllerContainerService {
    controllers: Map<string, ControllerMapping> = new Map();
    getController(name: string): ControllerMapping {
        if (!this.controllers.has(name)) {
            return this.createController(name);
        } else {
            return this.controllers.get(name);
        }
    }
    createController(name: string): ControllerMapping {
        if (this.controllers.has(name)) {
            return this.controllers.get(name);
        } else {
            this.controllers.set(name, new ControllerMapping(name));
            return this.controllers.get(name);
        }

    }

    controllerReady(name: string) {
        this.getController(name)._ready.next(true);
    }

}