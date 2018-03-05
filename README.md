# @gapi

![Build Status](http://gitlab.youvolio.com/gapi/gapi/badges/branch/build.svg)

#### @StrongTyped @GraphQL @API @Hapi @Apollo

##### For questions/issues you can write ticket [here](http://gitlab.youvolio.com/gapi/gapi/issues)
##### Video starting tutorial with some explanation [here](https://www.youtube.com/watch?v=J8WeVfXR_us&feature=youtu.be)

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
It may take 20 seconds because it install project dependencies you can check gapi-starter repo here 
https://github.com/Stradivario/gapi-starter

```bash
gapi-cli new my-project
```

Enter inside my-project and type: 

```bash
npm start
```

##### Open browser to 
```bash
http://localhost:8200/graphiql
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
                port: 8200
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
import { GraphQLObjectType, GraphQLString, GraphQLInt, GapiObjectType, Type, Resolve } from "gapi";
import { GraphQLScalarType } from "graphql";
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
import { GraphQLObjectType, GraphQLString, GraphQLInt, GapiObjectType, Type, Resolve } from "gapi";
import { GraphQLScalarType } from "graphql";


@GapiObjectType()
export class UserSettings {
    username: string | GraphQLScalarType = GraphQLString;
    firstname: string | GraphQLScalarType = GraphQLString;

    @Resolve('username')
    getUsername?(root, payload, context) {
        return 'username-changed';
    }
}

export const UserSettingsObjectType = new UserSettings();
```


## Query
##### Folder root/src/user/query.controller.ts
```typescript
import { Query, GraphQLNonNull, Scope, Type, GraphQLObjectType, Mutation, GapiController, Service, GraphQLInt, Injector } from "gapi";
import { UserService } from './services/user.service';
import { UserObjectType } from './services/type/user.type';


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
import { Query, GraphQLNonNull, Scope, Type, GraphQLObjectType, Mutation, GapiController, Service, GraphQLInt, Injector } from "gapi";
import { UserService } from './services/user.service';
import { UserObjectType } from './services/type/user.type';


@GapiController()
export class UserMutationsController {

    @Injector(UserService) userService: UserService;

    @Scope('ADMIN')
    @Type(UserObjectType)
    @Mutation({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    deleteUser(root, { id }, context) {
        return this.userService.deleteUser(id);
    }

    @Scope('ADMIN')
    @Type(UserObjectType)
    @Mutation({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    updateUser(root, { id }, context) {
        return this.userService.updateUser(id);
    }

    @Scope('ADMIN')
    @Type(UserObjectType)
    @Mutation({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    addUser(root, { id }, context) {
        return this.userService.addUser(id);
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

TODO: Better documentation...

Enjoy ! :)
