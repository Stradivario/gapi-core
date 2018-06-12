import { Container, GapiController } from '../../utils//container/index';
import { Scope, Mutation, Type, GapiObjectType, InjectType, Query, Public } from '../index';
import { GraphQLInt, GraphQLScalarType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

@GapiObjectType()
export class UserType {
    id: number | GraphQLScalarType = GraphQLInt;
}

describe('Decorators: @Type', () => {
    it('Should set resoler type to UserType ', (done) => {
        @GapiController()
        class TestController {

            @Type(UserType)
            @Query()
            findUser() {
                return 1;
            }
        }
        const query: {findUser(): {type: {name: string}}} = <any>Container.get(TestController);
        expect(query.findUser().type.name).toBe('UserType');
        done();
    });
});