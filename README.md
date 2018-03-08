# @gapi

![Build Status](http://gitlab.youvolio.com/gapi/gapi/badges/branch/build.svg)

#### @StrongTyped @GraphQL @API @Hapi @Apollo

##### For questions/issues you can write ticket [here](http://gitlab.youvolio.com/gapi/gapi/issues)
##### Video starting tutorial with some explanation [here](https://www.youtube.com/watch?v=J8WeVfXR_us&feature=youtu.be)

#### Integrated external modules:

##### [@Gapi-Typescript-Sequelize](https://github.com/Stradivario/gapi-sequelize)

## Installation and basic examples:
##### To install this library, run:

```bash
$ npm install Stradivario/gapi --save
```

## Consuming gapi

##### First we need to install ts-node and nodemon globally
```bash
npm install -g nodemon ts-node
```

##### Next install gapi-cli globally using npm

```bash
npm install gapi-cli -g
```
##### Next create project using CLI or read above how to bootstrap your custom application

## With CLI

##### To skip the following steps creating project and bootstraping from scratch you can type the following command:
It may take 20 seconds because it will install project dependencies.

###### [Basic project](https://github.com/Stradivario/gapi-starter) 
```bash
gapi-cli new my-project
```

###### [Advanced Project](https://github.com/Stradivario/gapi-starter-postgres-sequelize)
```bash
gapi-cli new my-project --advanced
```

Enter inside my-project and type: 

```bash
npm start
```

##### Open browser to 
```bash
http://localhost:9200/graphiql
```


## Without CLI

### Next create folder structure like this root/src/app


#### Create AppModule like the example above
#### Inject UserModule into imports inside AppModule
### Folder root/src/app/app.module.ts

```typescript

import { GapiModule, GapiServerModule, ConfigService } from 'gapi';
import { UserModule } from './user/user.module';

@GapiModule({
    imports: [
        UserModule
    ],
    services: [
        ConfigService.forRoot({
            APP_CONFIG: {
                port: 9200
            }
        })
    ]
})
export class AppModule {}


```

#### Create module UserModule in where we will Inject our created controllers
### Folder root/src/app/user/user.module.ts
```typescript

import { GapiModule } from 'gapi';
import { UserQueriesController } from './user.queries.controller';
import { UserMutationsController } from './user.mutations.controller';
import { UserService, AnotherService } from './user/services/user.service';

@GapiModule({
    controllers: [
        UserQueriesController,
        UserMutationsController
    ],
    services: [
        UserService,
        AnotherService
    ]
})
export class UserModule {}
```


#### Define UserType schema
### Folder root/src/user/type/user.type.ts
##### You can customize every resolver from schema and you can create nested schemas with @GapiObjectType decorator


## User Schema
##### Note that you can modify response result via @Resolve('key for modifier defined inside constructor') 
##### Root is the value of previews resolver so for example root.id = '1';
##### When you return some value from @Resolve decorator root.id will be replaced with returned value so it will be 5 in the example
##### If you remove @Resolve decorator it will be passed value returned from the first root resolver

```typescript
import { GraphQLObjectType, GraphQLString, GraphQLInt, GapiObjectType, Type, Resolve, GraphQLScalarType } from "gapi";
import { UserSettingsObjectType } from './user-settings.type';

@GapiObjectType()
export class UserType {
    id: number | GraphQLScalarType = GraphQLInt;
    settings: string | UserSettings = UserSettingsObjectType;
    
    @Resolve('id')
    getId?(root, payload, context) {
        return 5;
    }
}

export const UserObjectType = new UserType();
```

## UserSettings Schema

```typescript
import { GraphQLObjectType, GraphQLString, GraphQLInt, GapiObjectType, Type, Resolve, GraphQLScalarType } from "gapi";


@GapiObjectType()
export class UserSettings {

    @Injector(AnotherService) private anotherService?: AnotherService;

    readonly username: string | GraphQLScalarType = GraphQLString;
    readonly firstname: string | GraphQLScalarType = GraphQLString;

    @Resolve('username')
    async getUsername?(root, payload, context) {
        return await this.anotherService.trimFirstLetterAsync(root.username);
    }

    @Resolve('firstname')
    getFirstname?(root, payload, context) {
        return 'firstname-changed';
    }

}

export const UserSettingsObjectType = new UserSettings();
```


## UserMessage Schema for Subscriptions

```typescript
import { GapiObjectType, GraphQLScalarType, GraphQLString } from 'gapi';

@GapiObjectType()
export class UserMessage {
    readonly message: number | GraphQLScalarType = GraphQLString;
}

export const UserMessageType = new UserMessage();
```


## Query
##### Folder root/src/user/query.controller.ts
```typescript
import { Query, GraphQLNonNull, Scope, Type, GraphQLObjectType, Mutation, GapiController, Service, GraphQLInt, Injector } from "gapi";
import { UserService } from './services/user.service';
import { UserObjectType } from './services/type/user.type';
import { UserMessageType } from './user.subscription.controller';

@GapiController()
export class UserQueriesController {

    @Injector(UserService) userService: UserService;

    @Scope('ADMIN')
    @Type(UserObjectType)
    @Query({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    findUser(root, { id }, context) {
        return this.userService.findUser(id);
    }

}


```


## Mutation
##### Folder root/src/user/mutation.controller.ts
```typescript
import { Query, GraphQLNonNull, Scope, Type, GraphQLObjectType, Mutation, GapiController, Service, GraphQLInt, Container, Injector, GapiPubSubService, GraphQLString } from "gapi";
import { UserService } from './services/user.service';
import { UserObjectType, UserType } from './types/user.type';
import { UserMessageType, UserMessage } from "./types/user-message.type";

@GapiController()
export class UserMutationsController {

    @Injector(UserService) private userService: UserService;
    @Injector(GapiPubSubService) private pubsub: GapiPubSubService;

    @Scope('ADMIN')
    @Type(UserObjectType)
    @Mutation({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    deleteUser(root, { id }, context): UserType  {
        return this.userService.deleteUser(id);
    }

    @Scope('ADMIN')
    @Type(UserObjectType)
    @Mutation({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    updateUser(root, { id }, context): UserType {
        return this.userService.updateUser(id);
    }

    @Scope('ADMIN')
    @Type(UserObjectType)
    @Mutation({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    addUser(root, { id }, context): UserType  {
        return this.userService.addUser(id);
    }


    @Scope('ADMIN')
    @Type(UserMessageType)
    @Mutation({
        message: {
            type: new GraphQLNonNull(GraphQLString)
        },
        signal: {
            type: new GraphQLNonNull(GraphQLString)
        },
    })
    publishSignal(root, { message, signal }, context): UserMessage  {
        this.pubsub.publish(signal, `Signal Published message: ${message} by ${context.email}`);
        return {message};
    }

}

```

## Subscription
##### Folder root/src/user/user.subscription.controller.ts
```typescript

import {
    GapiObjectType, GraphQLScalarType, GraphQLString, GapiController,
    GapiPubSubService, Type, Injector, Subscribe, Subscription, withFilter, Scope, GraphQLInt, GraphQLNonNull
} from 'gapi';
import { UserService } from './services/user.service';
import { UserMessageType, UserMessage } from './types/user-message.type';

@GapiController()
export class UserSubscriptionsController {

    @Injector(UserService) private userService: UserService;
    @Injector(GapiPubSubService) private static pubsub: GapiPubSubService;

    @Scope('USER')
    @Type(UserMessageType)
    @Subscribe(() => UserSubscriptionsController.pubsub.asyncIterator('CREATE_SIGNAL_BASIC'))
    @Subscription()
    subscribeToUserMessagesBasic(message): UserMessage {
        return { message };
    }

    @Scope('ADMIN')
    @Type(UserMessageType)
    @Subscribe(
        withFilter(
            () => UserSubscriptionsController.pubsub.asyncIterator('CREATE_SIGNAL_WITH_FILTER'),
            (payload, {id}, context) => {
                console.log('Subscribed User: ', id, JSON.stringify(context));
                return id !== context.id;
            }
        )
    )
    @Subscription({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    subscribeToUserMessagesWithFilter(message): UserMessage {
        return { message };
    }

}


```

##### Example subscription query Basic

```typescript
subscription {
  subscribeToUserMessagesBasic(id:1)  {
    message
  }
}
```

##### Example subscription query Basic

```typescript
subscription {
  subscribeToUserMessagesWithFilter(id:1)  {
    message
  }
}
```

## Create Service with @Service decorator somewhere
##### Folder root/src/user/services/user.service.ts
```typescript
import { Service } from "gapi";

@Service()
class AnotherService {
    trimFirstLetter(username: string) {
        return username.charAt(1);
    }

    trimFirstLetterAsync(username): Promise<string> {
        return Promise.resolve(this.trimFirstLetter(username));
    }
}

@Service()
export class UserService {
    constructor(
        private anotherService: AnotherService
    ) {}

    findUser(id: number) {
        return { id: 1 };
    }

    addUser(id: number) {
        const username = this.anotherService.trimFirstLetter('username');
        return { id: 1, username };
    }

    deleteUser(id: number) {
        return { id: 1 };
    }

    updateUser(id) {
        return { id: 1 };
    }

    subscribeToUserUpdates() {
        return { id: 1 };
    }

}
```


## Finally Bootstrap your application
##### Folder root/src/main.ts
```typescript

import { AppModule } from './app/app.module';
import { Bootstrap } from 'gapi';

Bootstrap(AppModule);

```


## Start your application using following command inside root folder of the repo
##### Important the script will search main.ts inside root/src/main.ts where we bootstrap our module bellow

```
gapi-cli start
```


## Basic authentication


#### Create Core Module

##### Folder root/src/app/core/core.module.ts

```typescript

import { GapiModule, ConfigService } from 'gapi';
import { AuthPrivateService } from './services/auth/auth.service';
import { readFileSync } from 'fs';

@GapiModule({
    services: [
        ConfigService.forRoot({
            APP_CONFIG: {
                port: 9200,
                cert: readFileSync('./cert.key'),
                graphiqlToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtyaXN0aXFuLnRhY2hldkBnbWFpbC5jb20iLCJpZCI6MSwic2NvcGUiOlsiQURNSU4iXSwiaWF0IjoxNTIwMjkxMzkyfQ.9hpIDPkSiGvjTmUEyg_R_izW-ra2RzzLbe3Uh3IFsZg'
            },
        }),
        AuthPrivateService
    ]
})
export class CoreModule {}

```

#### Create PrivateAuthService @Service() this is complete Subscriptions Query Mutation Authentication via single method "validateToken()"
#### Above there are example methods from GapiAuth module which are provided on air for encrypting and decrypting user password

##### Folder root/src/app/core/services/auth/auth.service

```typescript

import { Service, ConnectionHookService, AuthService, Injector, Container, TokenData } from "gapi";
import * as Boom from 'boom';


interface UserInfo extends TokenData {
    scope: ['ADMIN', 'USER']
    type: 'ADMIN' | 'USER';
}

@Service()
export class AuthPrivateService {

    @Injector(AuthService) private authService: AuthService
    @Injector(ConnectionHookService) private connectionHookService: ConnectionHookService

    constructor() {
        this.connectionHookService.modifyHooks.onSubConnection = this.onSubConnection.bind(this);
        this.authService.modifyFunctions.validateToken = this.validateToken.bind(this);
    }

    onSubConnection(connectionParams): UserInfo {
        if (connectionParams.token) {
            return this.validateToken(connectionParams.token, 'Subscription');
        } else {
            throw Boom.unauthorized();
        }
    }

    validateToken(token: string, requestType: 'Query' | 'Subscription' = 'Query'): UserInfo {
        const user = <UserInfo>this.verifyToken(token);
        user.type = user.scope[0];
        console.log(`${requestType} from: ${JSON.stringify(user)}`)
        if (user) {
            return user;
        } else {
            throw Boom.unauthorized();
        }
    }

    verifyToken(token: string): TokenData {
        return this.authService.verifyToken(token);
    }

    signJWTtoken(): string {
        const jwtToken = this.authService.sign({
            email: '',
            id: 1,
            scope: ['ADMIN', 'USER']
        });
        return jwtToken;
    }

    decryptPassword(password: string): string {
        return this.authService.decrypt(password)
    }

    encryptPassword(password: string): string {
        return this.authService.encrypt(password)
    }

}

```

##### Final import CoreModule inside AppModule

```typescript
import { GapiModule, GapiServerModule } from 'gapi';
import { UserModule } from './user/user.module';
import { UserService } from './user/services/user.service';
import { CoreModule } from './core/core.module';

@GapiModule({
    imports: [
        UserModule,
        CoreModule
    ]
})
export class AppModule { }
```



##### Complex schema object with nested schemas of same type

```typescript
import { GraphQLObjectType, GraphQLString, GraphQLInt, GapiObjectType, Type, Resolve, GraphQLList, GraphQLBoolean } from "gapi";
import { GraphQLScalarType } from "graphql";

@GapiObjectType()
export class UserSettingsType {
    readonly id: number | GraphQLScalarType = GraphQLInt;
    readonly color: string | GraphQLScalarType = GraphQLString;
    readonly language: string | GraphQLScalarType = GraphQLString;
    readonly sidebar: boolean | GraphQLScalarType = GraphQLBoolean;
}

export const UserSettingsObjectType = new UserSettingsType();

@GapiObjectType()
export class UserWalletSettingsType {
    readonly type: string | GraphQLScalarType = GraphQLString;
    readonly private: string | GraphQLScalarType = GraphQLString;
    readonly security: string | GraphQLScalarType = GraphQLString;
    readonly nested: UserSettingsType = UserSettingsObjectType;
    readonly nested2: UserSettingsType = UserSettingsObjectType;
    readonly nested3: UserSettingsType = UserSettingsObjectType;

    // If you want you can change every value where you want with @Resolve decorator
    @Resolve('type')
    changeType(root, args, context) {
        return root.type + ' new-type';
    }

    // NOTE: you can name function methods as you wish can be Example3 for example important part is to define 'nested3' as a key to map method :)
    @Resolve('nested3')
    Example3(root, args, context) {
        // CHANGE value of object type when returning
        // UserSettingsType {
        //     "id": 1,
        //     "color": "black",
        //     "language": "en-US",
        //     "sidebar": true
        // }
        // root.nested3.id
        // root.nested3.color
        // root.nested3.language
        // root.nested3.sidebar
        return root.nested3;
    }
}

export const UserWalletSettingsObjectType = new UserWalletSettingsType();


@GapiObjectType()
export class UserWalletType {
    readonly id: number | GraphQLScalarType = GraphQLInt;
    readonly address: string | GraphQLScalarType = GraphQLString;
    readonly settings: string | UserWalletSettingsType = UserWalletSettingsObjectType;
}

export const UserWalletObjectType = new UserWalletType();


@GapiObjectType()
export class UserType {
    readonly id: number | GraphQLScalarType = GraphQLInt;
    readonly email: string | GraphQLScalarType = GraphQLString;
    readonly firstname: string | GraphQLScalarType = GraphQLString;
    readonly lastname: string | GraphQLScalarType = GraphQLString;
    readonly settings: string | UserSettingsType = UserSettingsObjectType;
    readonly wallets: UserWalletType = new GraphQLList(UserWalletObjectType);
}

export const UserObjectType = new UserType();

```



##### When you create such a query from graphiql dev tools

```typescript
query {
  findUser(id:1) {
    id
    email
     firstname
     lastname
    settings {
      id
      color
      language
      sidebar
    }
    wallets {
      id
      address
      settings {
        type
        private
        security
        nested {
          id
          color
          language
          sidebar
        }
        nested2 {
          id
          color
          language
          sidebar
        }
        nested3 {
          id
          color
          language
          sidebar
        }
      }
    }
  }
}

```

##### This query respond to chema above
```typescript

   findUser(id: number): UserType {
        return {
            id: 1,
            email: "kristiqn.tachev@gmail.com",
            firstname: "Kristiyan",
            lastname: "Tachev",
            settings: {
                id: 1,
                color: 'black',
                language: 'en-US',
                sidebar: true
            },
            wallets: [{
                id: 1, address: 'dadadada', settings: {
                    type: "ethereum",
                    private: false,
                    security: "TWO-STEP",
                    nested: {
                        id: 1,
                        color: 'black',
                        language: 'en-US',
                        sidebar: true
                    },
                    nested2: {
                        id: 1,
                        color: 'black',
                        language: 'en-US',
                        sidebar: true
                    },
                    nested3: {
                        id: 1,
                        color: 'black',
                        language: 'en-US',
                        sidebar: true
                    },
                    nested4: {
                        id: 1,
                        color: 'black',
                        language: 'en-US',
                        sidebar: true
                    },
                    
                }
            }]
        };
    }
```


##### The return result from graphql QL will be 

```typescript
{
  "data": {
    "findUser": {
      "id": 1,
      "email": "kristiqn.tachev@gmail.com",
      "firstname": "Kristiyan",
      "lastname": "Tachev",
      "settings": {
        "id": 1,
        "color": "black",
        "language": "en-US",
        "sidebar": true
      },
      "wallets": [
        {
          "id": 1,
          "address": "dadadada",
          "settings": {
            "type": "ethereum new-type",
            "private": "false",
            "security": "TWO-STEP",
            "nested": {
              "id": 1,
              "color": "black",
              "language": "en-US",
              "sidebar": true
            },
            "nested2": {
              "id": 1,
              "color": "black",
              "language": "en-US",
              "sidebar": true
            },
            "nested3": {
              "id": 1,
              "color": "black",
              "language": "en-US",
              "sidebar": true
            }
          }
        }
      ]
    }
  }
}
```



TODO: Better documentation...

Enjoy ! :)
