"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
function GapiObjectType() {
    return function (target, propertyName, index) {
        const userTypes = new target();
        const type = Object.create({});
        type.fields = {};
        type.name = target.name;
        const metadata = {};
        Object.keys(userTypes).forEach(field => type.fields[field] = { type: userTypes[field] });
        if (target.prototype._metadata && target.prototype._metadata.length) {
            target.prototype._metadata.forEach(meta => type.fields[meta.key].resolve = meta.resolve);
        }
        target.prototype = new graphql_1.GraphQLObjectType(type);
        return target;
    };
}
exports.GapiObjectType = GapiObjectType;
