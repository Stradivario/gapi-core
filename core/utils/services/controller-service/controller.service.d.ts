import { GraphQLObjectType, GraphQLNonNull } from "graphql";
import { GapiController } from "../../../decorators/gql-controller/gql-controller.decorator";
export declare class ControllerMappingSettings {
    scope?: string[];
    type?: GraphQLObjectType;
    public?: boolean;
}
export interface GenericGapiResolversType {
    name: string;
    type: GraphQLObjectType;
    resolve(root: any, args: Object, context: any): any;
    args: {
        [key: string]: {
            [type: string]: GraphQLObjectType | GraphQLNonNull<any>;
        };
    };
}
export declare class ControllerMapping implements GapiController {
    _controller_name: string;
    _settings: ControllerMappingSettings;
    _queries: Map<string, GenericGapiResolversType>;
    _subscriptions: Map<string, GenericGapiResolversType>;
    _mutations: Map<string, GenericGapiResolversType>;
    constructor(name: string);
    setMutation(name: any, value: GenericGapiResolversType): void;
    setSubscription(name: any, value: GenericGapiResolversType): void;
    setQuery(name: string, value: GenericGapiResolversType): void;
    setSettings(settings: ControllerMappingSettings): void;
    getQuery(name: string): GenericGapiResolversType;
    getMutation(name: string): GenericGapiResolversType;
    getSubscription(name: string): GenericGapiResolversType;
}
export declare class ControllerContainerService {
    controllers: Map<string, ControllerMapping>;
    getController(name: string): ControllerMapping;
    createController(name: string): ControllerMapping;
}
