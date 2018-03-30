import { Container } from '../../utils';
import { Scope, Type, GapiObjectType, Query } from '../index';
import { GraphQLInt, GraphQLScalarType, GraphQLNonNull, GraphQLObjectType } from 'graphql';


@GapiObjectType()
class UserType {
    readonly id: number | GraphQLScalarType = GraphQLInt;
    name: string;
}


class ClassTestProvider {

    @Scope('ADMIN')
    @Type(UserType)
    @Query({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    findUser(root, { id }, context) {
        return {id: 1};
    }
}


class TestingQuery {
    resolve: <T>(root, payload, context) => T;
    args: {[key: string]: {type: any}};
    method_type: string;
    method_name: string;
    target: ClassTestProvider;
    type: UserType;
    scope: Array<string>;
}


describe('Decorators: @Query', () => {
    it('Should decorate target descriptor with appropriate values', (done) => {
        const query: TestingQuery = <any>Container.get(ClassTestProvider).findUser(null, {id: null}, null);
        expect(JSON.stringify(query.args.id.type)).toBe(JSON.stringify(new GraphQLNonNull(GraphQLInt)));
        expect(query.method_name).toBe('findUser');
        expect(query.method_type).toBe('query');
        expect(query.type.name).toBe('UserType');
        expect(query.scope[0]).toBe('ADMIN');
        const returnResult: {id: number} = query.resolve(null, {}, null);
        expect(returnResult.id).toBe(1);
        done();
    });
});