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

const UserToken = new Token<Test>('UserId');

@Service()
export class TestService {
    constructor(
        @Inject(UserToken) public userType: Test
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
            // id: this.testService.userType.id
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
            deps: [TestService, 5, 6, 7, 7],
            useFactory: (d, a,b,v) => {
                console.log('Stana li ?', d,a,b,v);
                return {id: 6};
            }
        }
    ]
})
export class AppModule { }


Bootstrap(AppModule);


