import { Container, GapiController } from '../../utils';
import { Scope, Mutation, Type, GapiObjectType, InjectType, Query, Public } from '../index';
import { GraphQLInt, GraphQLScalarType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

describe('Decorators: @Public', () => {
    it('Should get raw object value ', (done) => {
        @GapiController()
        class TestController {
            @Public()
            @Query()
            findUser() {
                return 1;
            }
        }
        const query: {findUser(): {public: string}} = <any>Container.get(TestController);
        expect(query.findUser().public).toBeTruthy();
        done();
    });
});