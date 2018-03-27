import { Container } from '../../utils/container';
import { GraphQLObjectType, GraphQLInputObjectType } from 'graphql';

interface ResolveMetadata<T> {
    resolve?: () => T;
    key?: string;
}

export function GapiObjectType<T>(options?: { input?: boolean, raw?: boolean, name?: string, model?: boolean }): Function {
    return function (target: any, propertyName: string, index?: number) {
        const userTypes = new target();
        const type = Object.create({ fields: {}, name: options && options.name ? options.name : target.name });
        const metadata: { [key: string]: ResolveMetadata<T> } = {};
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
        } else if (options && options.model) {
            return function () {
                console.log(rawFields);
                return rawFields;
            };
        } else {
            return function () {
                return options && options.input ? new GraphQLInputObjectType(type) : new GraphQLObjectType(type);
            };
        }

    };
}
