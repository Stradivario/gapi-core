import { Inject, Service, GapiController, Bootstrap, Resolve } from '../index';
import { Token } from '../';
import { GraphQLScalarType, GraphQLInt, GraphQLNonNull } from 'graphql';
import { GapiObjectType, Type, Query, GapiModule } from '../index';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { InjectType } from '../decorators';
import { Container } from '../utils';

@GapiObjectType()
export class UserType2 {
    readonly id9: number | GraphQLScalarType = GraphQLInt;
}

@Service()
class Gosho {
    pesho() {
        return 1111;
    }
}

@GapiObjectType({name: 'pesho'})
export class UserType {
    readonly gosho: UserType2 = InjectType(UserType2);
    readonly gosho2: UserType2 = InjectType(UserType2);
    readonly id4: number | GraphQLScalarType = GraphQLInt;
    readonly id5: number | GraphQLScalarType = GraphQLInt;
}

@GapiObjectType({model: true})
export class Test extends UserType {}

// console.log(Container.get(Test));

@GapiController()
export class UserQueriesController {
    constructor(
    ) {
        console.log(this);
    }

    @Type(UserType)
    @Query({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    findUser(root, { id }, context) {
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
        {
            provide: 'Pesho',
            useClass: Pesho
        }
    ]
})
export class AppModule { }


Bootstrap(AppModule);