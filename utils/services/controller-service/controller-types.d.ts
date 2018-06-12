import { GraphQLObjectType, GraphQLNonNull } from 'graphql';
export interface GenericGapiResolversType {
    scope?: string[];
    target?: any;
    effect?: string;
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
