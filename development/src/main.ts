import { Bootstrap } from '../core/utils/services/bootstrap/bootstrap.service';
import { GapiModule, Query, Type, Injector, Public } from '../core/decorators/index';
import { GapiController } from '../core/utils/container';
import { GraphQLNonNull, GraphQLInt, GraphQLScalarType } from 'graphql';
import { GapiObjectType } from '../core/decorators/gapi-object-type';
import { ConfigService } from '../core/utils';
import { readFileSync } from 'fs';

@GapiObjectType()
export class UserType {
    readonly id: number | GraphQLScalarType = GraphQLInt;
}

export const UserObjectType = new UserType();

@GapiController()
export class UserQueriesController {

    @Type(UserObjectType)
    @Query({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    findUser(root, { id }, context) {
        return 1;
    }

}

@GapiModule({
    imports: [
        UserQueriesController
    ],
    services: [
        ConfigService.forRoot({
            APP_CONFIG: {
                port: 9000,
                cert: readFileSync('./cert.key')
            }
        })
    ]
})
export class AppModule { }


Bootstrap(AppModule);