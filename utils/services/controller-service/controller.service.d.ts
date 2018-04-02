import { GraphQLObjectType, GraphQLNonNull } from 'graphql';
import { Subject } from 'rxjs/Subject';
export declare class ControllerMappingSettings {
    scope?: string[];
    type?: GraphQLObjectType;
    public?: boolean;
}
export interface GenericGapiResolversType {
    scope?: string[];
    target?: any;
    method_name?: string;
    method_type?: 'query' | 'subscription' | 'mutation' | 'event';
    type: GraphQLObjectType;
    resolve?(root: any, args: Object, context: any): any;
    args?: {
        [key: string]: {
            [type: string]: GraphQLObjectType | GraphQLNonNull<any>;
        };
    };
}
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
export declare class ControllerContainerService {
    controllers: Map<string, ControllerMapping>;
    getController(name: string): ControllerMapping;
    createController(name: string): ControllerMapping;
    controllerReady(name: string): void;
}
