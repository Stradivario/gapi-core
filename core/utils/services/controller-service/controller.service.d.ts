import { GraphQLObjectType, GraphQLNonNull } from "graphql";
export declare class ControllerMappingSettings {
    scope?: string[];
    type?: GraphQLObjectType;
    public?: boolean;
}
export interface GenericGapiResolversType {
    scope?: string[];
    method_name?: string;
    method_type?: 'query' | 'subscription' | 'mutation';
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
    _descriptors: Map<string, TypedPropertyDescriptor<() => GenericGapiResolversType>>;
    constructor(name: string);
    setSettings(settings: ControllerMappingSettings): void;
    setDescriptor(name: string, descriptor: TypedPropertyDescriptor<() => GenericGapiResolversType>): void;
    getDescriptor(name: string): TypedPropertyDescriptor<() => GenericGapiResolversType>;
    getAllDescriptors(): string[];
}
export declare class ControllerContainerService {
    controllers: Map<string, ControllerMapping>;
    getController(name: string): ControllerMapping;
    createController(name: any): ControllerMapping;
}
