"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
function GapiObjectType() {
    return function (target, propertyName, index) {
        const userTypes = new target();
        const type = Object.create({});
        type.fields = {};
        type.name = target.name;
        Object.keys(userTypes).forEach(field => {
            type.fields[field] = { type: userTypes[field] };
        });
        target.prototype = new graphql_1.GraphQLObjectType(type);
    };
}
exports.GapiObjectType = GapiObjectType;
