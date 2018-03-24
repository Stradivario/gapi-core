import { Bootstrap } from '@gapi/core';
import { GapiModule, Query, Type, Injector, Public } from '@gapi/core';
import Container, { GapiController, Inject, Service } from '@gapi/core';
import { GraphQLNonNull, GraphQLInt, GraphQLScalarType } from 'graphql';
import { GapiObjectType } from '@gapi/core';
import { ConfigService } from '@gapi/core';
import { readFileSync } from 'fs';
import { Token } from '@gapi/core/core/utils/container/Token';

@GapiObjectType()
export class UserType {
    readonly id: number | GraphQLScalarType = GraphQLInt;
}

export const UserObjectType = new UserType();



export class Pesho {
    test: string;
}

const InjectionToken = new Token<Pesho>('pesho');

@Service()
export class TestService {
    constructor(
        @Inject(InjectionToken) public factory: Pesho
    ) {
        console.log(this);
    }
}


@GapiController()
export class UserQueriesController {

    constructor(
        private test:TestService
    ) {}

    @Type(UserObjectType)
    @Query({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    findUser(root, { id }, context) {
        console.log(root, this.test.factory, id, context);
        return 1;
    }

}

@GapiModule({
    imports: [
        {
            provide: InjectionToken,
            useFactory: () => {
                return 1;
            }
        },
        UserQueriesController,
    ],
    services: [
        ConfigService.forRoot({
            APP_CONFIG: {
                port: 9000,
                cert: readFileSync('./cert.key')
            }
        }),
        TestService
    ]
})
export class AppModule { }


Bootstrap(AppModule);

















// import { Bootstrap } from '@gapi/core';
// import { GapiModule, Query, Type, Injector, Public } from '@gapi/core';
// import Container, { GapiController, Inject, Service } from '@gapi/core';
// import { GraphQLNonNull, GraphQLInt, GraphQLScalarType } from 'graphql';
// import { GapiObjectType } from '@gapi/core';
// import { ConfigService } from '@gapi/core';
// import { readFileSync } from 'fs';
// import { Token } from '@gapi/core/core/utils/container/Token';

// @GapiObjectType()
// export class UserType {
//     readonly id: number | GraphQLScalarType = GraphQLInt;
// }

// export const UserObjectType = new UserType();



// export class Pesho {
//     test: string;
// }

// const InjectionToken = new Token<Pesho>('pesho');

// @Service()
// export class TestService {
//     constructor(
//         @Inject('pesho') public factory: Pesho
//     ) {
//         console.log(this);
//     }
// }


// @GapiController()
// export class UserQueriesController {

//     constructor(
//         private test:TestService
//     ) {}

//     @Type(UserObjectType)
//     @Query({
//         id: {
//             type: new GraphQLNonNull(GraphQLInt)
//         }
//     })
//     findUser(root, { id }, context) {
//         console.log(root, this.test.factory, id, context);
//         return 1;
//     }

// }

// @GapiModule({
//     imports: [
//         {
//             provide: 'pesho',
//             useClass: Pesho
//         },
//         UserQueriesController,
//     ],
//     services: [
//         ConfigService.forRoot({
//             APP_CONFIG: {
//                 port: 9000,
//                 cert: readFileSync('./cert.key')
//             }
//         }),
//         TestService
//     ]
// })
// export class AppModule { }


// Bootstrap(AppModule);