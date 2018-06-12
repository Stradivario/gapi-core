import { Container, GapiController } from '../../utils//container/index';
import { Scope, Mutation, Type, GapiObjectType, InjectType, Query, Public } from '../index';
import { GraphQLInt, GraphQLScalarType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

describe('Decorators: @Scope', () => {
    it('Should decorate findUser to have scope ADMIN type', (done) => {
        @GapiController()
        class TestController {
            @Scope('ADMIN')
            @Query()
            findUser() {
                return 1;
            }
        }
        const query: {findUser(): {scope: string}} = <any>Container.get(TestController);
        expect(query.findUser().scope[0]).toBe('ADMIN');
        done();
    });
});