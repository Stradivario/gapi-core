import { Server, Request } from 'hapi';
import * as GraphiQL from 'apollo-server-module-graphiql';
export interface IRegister {
    (server: Server, options: any, next: any): void;
    attributes?: any;
}
export declare type HapiOptionsFunction = (req?: Request) => any | Promise<any>;
export interface HapiPluginOptions {
    path: string;
    route?: any;
    graphqlOptions: any | HapiOptionsFunction;
}
declare const graphqlHapi: IRegister;
export declare type HapiGraphiQLOptionsFunction = (req?: Request) => GraphiQL.GraphiQLData | Promise<GraphiQL.GraphiQLData>;
export interface HapiGraphiQLPluginOptions {
    path: string;
    route?: any;
    graphiqlOptions: GraphiQL.GraphiQLData | HapiGraphiQLOptionsFunction;
}
declare const graphiqlHapi: IRegister;
export { graphqlHapi, graphiqlHapi };
