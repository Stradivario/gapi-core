import { Inject, Service, GapiController, Bootstrap, Resolve } from '../index';
import { InjectionToken } from '../';
import { GraphQLScalarType, GraphQLInt, GraphQLNonNull } from 'graphql';
import { GapiObjectType, Type, Query, GapiModule } from '../index';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { InjectType } from '../decorators';
import { OfType } from '../';

@GapiObjectType()
export class UserType2 {
    readonly id9: number | GraphQLScalarType = GraphQLInt;
}

function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}

const GapiEffects = strEnum([
    'findUser'
]);

type GapiEffects = keyof typeof GapiEffects;

@Service()
export class TestServ {
    test() {
    }
}
@Service()
class UserEffectsService {
    constructor(
        private test: TestServ
    ) {
        this.test.test();
    }

    @OfType<GapiEffects>(GapiEffects.findUser)
    findUser(args, context, info) {
        console.log(args, context);
    }
}


@GapiObjectType()
export class UserType {
    readonly gosho: UserType2 = InjectType(UserType2);
    readonly gosho2: UserType2 = InjectType(UserType2);
    readonly id4: number | GraphQLScalarType = GraphQLInt;
    readonly id5: number | GraphQLScalarType = GraphQLInt;
}

@GapiController()
export class UserQueriesController {
    constructor(
        private userType: UserType
    ) {

    }

    @Type(UserType)
    @Query({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    findUser(root, { id }, context) {
        return {
            id: 1
        };
    }

    @Type(UserType)
    @Query({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    findUser2(root, { id }, context) {
        return {
            // id: this.testService.userType.id
        };
    }

    @Type(UserType)
    @Query({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    findUser3(root, { id }, context) {
        return {
            // id: this.testService.userType.id
        };
    }

}

class Pesho {
    id = 1;
}

@GapiModule({
    imports: [
        UserQueriesController,
    ],
    services: [
        UserEffectsService,
        TestServ,
        {
            provide: 'Pesho',
            useClass: Pesho
        }
    ]
})
export class AppModule { }


Bootstrap(AppModule);