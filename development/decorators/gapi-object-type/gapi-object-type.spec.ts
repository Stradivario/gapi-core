import { Container, GapiController } from '../../utils//container/index';
import { Scope, Mutation, Type, GapiObjectType, InjectType } from '../index';
import { GraphQLInt, GraphQLScalarType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

interface TestingMutation {
    args: {[key: string]: {type: any}};
}

@GapiObjectType()
class TestType {
    readonly value: number | GraphQLScalarType = GraphQLInt;
}

@GapiObjectType()
class UserType {
    readonly id: number | GraphQLScalarType = GraphQLInt;
    readonly name: string | GraphQLScalarType = GraphQLString;
    readonly testType: string | GraphQLScalarType = InjectType(TestType);
}

describe('Decorators: @GapiObjectType', () => {
    it('Should decorate Class to be UserType with prototype GraphQLObjectType', (done) => {
        expect(GraphQLObjectType.name).toBe(Container.get(UserType).constructor.name);
        done();
    });
    it('Should get raw object value ', (done) => {
        @GapiObjectType({raw: true, input: false})
        class UserType2 {
            readonly id: number | GraphQLScalarType = GraphQLInt;
            readonly name: string | GraphQLScalarType = GraphQLString;
            readonly testType: string | GraphQLScalarType = InjectType(TestType);
        }
        const mutation: {[key: string]: {type: any}} = <any>Container.get(UserType2);
        expect(JSON.stringify(mutation.id)).toBe(JSON.stringify(GraphQLInt));
        expect(JSON.stringify(mutation.name)).toBe(JSON.stringify(GraphQLString));
        expect(`${mutation.testType}`).toBe(`${Container.get(TestType)}`);
        done();
    });
});