import { GraphQLObjectType } from "graphql";

export class ControllerMappingSettings {
    scope?: string[] = ['ADMIN'];
    type?: GraphQLObjectType;
    public?: boolean;
}