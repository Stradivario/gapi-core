import { Container } from '../../utils/container';
import { GraphQLObjectType, GraphQLInputObjectType } from 'graphql';

interface ResolveMetadata<T> {
    resolve?: () => T;
    key?: string;
}

export function GapiObjectType<T>(options?: { input: boolean, raw: boolean }): Function {
    return function (target: any, propertyName: string, index?: number) {
        const userTypes = new target();
        const type = Object.create({ fields: {}, name: target.name });
        const metadata: { [key: string]: ResolveMetadata<T> } = {};
        Object.keys(userTypes).forEach(field => type.fields[field] = { type: userTypes[field] });
        if (target.prototype._metadata && target.prototype._metadata.length) {
            target.prototype._metadata.forEach(meta => type.fields[meta.key].resolve = meta.resolve.bind(target.prototype));
        }
        if (options && options.raw) {
            return target;
        } else {
            return function () {
                return options && options.input ? new GraphQLInputObjectType(type) : new GraphQLObjectType(type);
            };
        }

    };
}
