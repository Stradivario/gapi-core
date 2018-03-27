"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
function GapiObjectType(options) {
    return function (target, propertyName, index) {
        const userTypes = new target();
        const type = Object.create({ fields: {}, name: options && options.name ? options.name : target.name });
        const metadata = {};
        const rawFields = {};
        Object.keys(userTypes).forEach(key => {
            if (options && options.model) {
                return rawFields[key] = '';
            }
        });
        Object.keys(userTypes).forEach(field => {
            type.fields[field] = { type: userTypes[field] };
        });
        if (options && !options.model && target.prototype._metadata && target.prototype._metadata.length) {
            target.prototype._metadata.forEach(meta => type.fields[meta.key].resolve = meta.resolve.bind(target.prototype));
        }
        // console.log(options);
        if (options && options.raw) {
            return target;
        }
        else if (options && options.model) {
            return function () {
                console.log(rawFields);
                return rawFields;
            };
        }
        else {
            return function () {
                return options && options.input ? new graphql_1.GraphQLInputObjectType(type) : new graphql_1.GraphQLObjectType(type);
            };
        }
    };
}
exports.GapiObjectType = GapiObjectType;
