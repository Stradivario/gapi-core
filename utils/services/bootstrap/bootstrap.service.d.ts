import { GraphQLSchema } from 'graphql';
import { Server } from 'hapi';
export declare const Bootstrap: (App: any) => Promise<{
    server: Server;
    schema: GraphQLSchema;
}>;
