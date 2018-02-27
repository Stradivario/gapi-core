import { GraphQLSchema } from "graphql";

export interface AmqpConfigInterface {
    host: string;
    port: string | number;
}

export interface AppConfigInterface {
    cert: Buffer;
    uploadFolder?: string;
    graphiqlToken?: string;
    port: string | number;
    fakeUsers?: boolean;
    force?: boolean;
    schema: GraphQLSchema;
    cyper?: any;
    ethereumApi?: string;
}

export interface SequelizeConfigInterface {
    development: {
        dialect: string;
        host: string;
        port: string;
        username: string;
        password: string;
        name: string;
        logging: boolean;
        storage: string;
        modelPaths: string[];
    };
    testing: {
        dialect: string;
        host: string;
        port: string;
        username: string;
        password: string;
        name: string;
        storage: string;
        logging: boolean;
        modelPaths: string[];
    };
}