import {Container} from "../../utils/container";
import { GraphQLObjectType } from "graphql";

export function GapiObjectType(): Function {
    return function(target: any, propertyName: string, index?: number) {
        const userTypes = new target();
        const type = Object.create({});
        type.fields = {};
        type.name = target.name;
        Object.keys(userTypes).forEach(field => {
            type.fields[field] = { type: userTypes[field]}
        })
        target.prototype = new GraphQLObjectType(type)
    };
}
