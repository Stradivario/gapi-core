import { Inject, Service, GapiController, Bootstrap } from "../index";
import { Token } from "../";
import { GraphQLScalarType, GraphQLInt, GraphQLNonNull } from "graphql";
import { GapiObjectType, Type, Query, GapiModule } from '../index';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

TimerObservable
@GapiObjectType()
export class UserType {
    readonly id: number | GraphQLScalarType = GraphQLInt;
}

export class Test {
    id = 666
}

export const UserObjectType = new UserType();

const UserToken = new Token<UserType>('UserId');

@Service()
export class TestService {
    constructor(
        @Inject(UserToken) public userType: UserType
    ) {
        console.log(this);
    }
}


@GapiController()
export class UserQueriesController {


    constructor(
        private testService: TestService
    ) {
        console.log(this);
    }

    @Type(UserObjectType)
    @Query({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    findUser(root, { id }, context) {
        return {
            id: this.testService.userType.id
        };
    }

}

@GapiModule({
    imports: [
        UserQueriesController,
    ],
    services: [
        {
            provide: UserToken,
            useValue: {id: 5}
        }
    ]
})
export class AppModule { }


Bootstrap(AppModule);


