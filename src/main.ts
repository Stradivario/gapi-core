import { Inject, Service, GapiController, Bootstrap, Resolve } from "../index";
import { InjectionToken } from "../";
import { GraphQLScalarType, GraphQLInt, GraphQLNonNull } from "graphql";
import { GapiObjectType, Type, Query, GapiModule, Effect } from "../index";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { InjectType, GapiModuleWithServices } from "../decorators";
import { OfType } from "../";
import { EffectTypes } from "./app/core/api-introspection/EffectTypes";
import { GapiEffect } from "../";

@GapiObjectType()
export class UserType2 {
  readonly id9: number | GraphQLScalarType = GraphQLInt;
}

@Service()
export class TestServ {
  test() {return 1;}
}

@GapiEffect()
class UserEffectsService {

  constructor(
    private test: TestServ
  ) { }

  @OfType<EffectTypes>(EffectTypes.myevent)
  findUser(result, payload, context, info) {
    console.log(this, result, payload, context, info);
  }
}

@GapiObjectType()
export class UserType {
  readonly gosho: UserType2 = InjectType(UserType2);
  readonly gosho2: UserType2 = InjectType(UserType2);
  readonly id: number | GraphQLScalarType = GraphQLInt;
  readonly id5: number | GraphQLScalarType = GraphQLInt;
}

@GapiController()
export class UserQueriesController {
  constructor(private userType: UserType) { }

  @Type(UserType)
  @Effect(EffectTypes.myevent)
  @Query({
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  })
  findUser(root, { id }, context) {
    console.log('AAADADAA', context);
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

  @Type(UserType)
  @Query({
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  })
  findUser5(root, { id }, context) {
    return {
      // id: this.testService.userType.id
    };
  }
}

class Pesho {
  id = 1;
}

@Service()
export class TestService {
  testMethod() {
    return 1;
  }
}

@Service()
class MyPlugin {
  name = 'MyPlugin';
  version = '1.0.0';
  constructor(
    @Inject('dada') private dada: string,
    private test: TestService
  ) {
    console.log(this.dada);
  }

  async register(server, options) {
    server.route({
      method: 'GET',
      path: '/test',
      handler: this.handler.bind(this)
    });
  }

  async handler(request, h) {
    console.log(this.test.testMethod());
    return 'Hello world';
  }

}


@GapiModule({
  imports: []
})
export class ProbaModule {
  public static forRoot(): GapiModuleWithServices {
    return {
      gapiModule: ProbaModule,
      services: [{
        provide: 'dada',
        useValue: '5'
      }]
    }
  }
}

@GapiModule({
  imports: [
    ProbaModule.forRoot(),
    UserQueriesController],
  services: [
    UserEffectsService,
    TestServ,
    {
      provide: "Pesho",
      useClass: Pesho
    }
  ],
  plugins: [MyPlugin]
})
export class AppModule {

}

Bootstrap(AppModule);
