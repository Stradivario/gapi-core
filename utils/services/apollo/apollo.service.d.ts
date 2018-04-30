import { Server, Request } from 'hapi';
import * as GraphiQL from 'apollo-server-module-graphiql';
import { GraphQLOptions } from 'apollo-server-core';
export interface IRegister {
    (server: Server, options: any): void;
}
export interface IPlugin {
    name: string;
    version?: string;
    register: IRegister;
}
export interface HapiOptionsFunction {
    (req?: Request): GraphQLOptions | Promise<GraphQLOptions>;
}
export interface HapiPluginOptions {
    path: string;
    vhost?: string;
    route?: any;
    graphqlOptions: GraphQLOptions | HapiOptionsFunction;
}
declare const graphqlHapi: IPlugin;
export interface HapiGraphiQLOptionsFunction {
    (req?: Request): GraphiQL.GraphiQLData | Promise<GraphiQL.GraphiQLData>;
}
export interface HapiGraphiQLPluginOptions {
    path: string;
    route?: any;
    graphiqlOptions: GraphiQL.GraphiQLData | HapiGraphiQLOptionsFunction;
}
declare const graphiqlHapi: IPlugin;
export { graphqlHapi, graphiqlHapi };
