import { GraphQLObjectType, GraphQLNonNull } from "graphql";
import { Service } from '../../../utils/container/index';
import { GapiController } from "../../../decorators/gql-controller/gql-controller.decorator";

export class ControllerMappingSettings {
    scope?: string[] = ['ADMIN'];
    type?: GraphQLObjectType;
    public?: boolean;
}

export interface GenericGapiResolversType {
    name: string;
    type: GraphQLObjectType;
    resolve(root: any, args: Object, context: any)
    args: {
        [key: string]: {
            [type: string]: GraphQLObjectType | GraphQLNonNull<any>;
        };
    }
}


export class ControllerMapping implements GapiController {

    _controller_name: string;
    _settings: ControllerMappingSettings = new ControllerMappingSettings();
    _queries: Map<string, GenericGapiResolversType> = new Map();
    _subscriptions: Map<string, GenericGapiResolversType> = new Map();
    _mutations: Map<string, GenericGapiResolversType> = new Map();

    constructor(name: string) {
        this._controller_name = name;
    }

    setMutation(name, value: GenericGapiResolversType): void {
        this._mutations.set(name, value);
    }

    setSubscription(name, value: GenericGapiResolversType): void {
        this._subscriptions.set(name, value);
    }

    setQuery(name: string, value: GenericGapiResolversType): void {
        this._queries.set(name, value);
    }

    setSettings(settings: ControllerMappingSettings) {
        this._settings = settings;
    }

    getQuery(name: string): GenericGapiResolversType {
        return this._queries.get(name);
    }

    getMutation(name: string): GenericGapiResolversType {
        return this._queries.get(name);
    }

    getSubscription(name: string): GenericGapiResolversType {
        return this._queries.get(name);
    }

}

@Service()
export class ControllerContainerService {
    controllers: Map<string, ControllerMapping> = new Map()
    getController(name: string): ControllerMapping {
        if(!this.controllers.has(name)) {
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
}