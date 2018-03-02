# @gapi

![Build Status](http://gitlab.youvolio.com/open-source/gapi/badges/branch/build.svg)

#### @StrongTyped @GraphQL @API 

##### For questions/issues you can write ticket [here](http://gitlab.youvolio.com/open-source/gapi/issues)

## Installation and basic examples:
##### To install this library, run:

```bash
$ npm install @Stradivario/gapi --save
```

## Consuming gapi


### Install gapi-cli globally using npm

```
npm install gapi-cli -g
```


### Next create folder structure like this root/src/app



#### Create AppModule like the example above
#### Inject this UserModule into imports inside AppModule
### Folder root/src/app/app.module.ts

```typescript

import { GapiModule, GapiServerModule } from 'gapi';
import { UserModule } from './user/user.module';
import { UserService } from './user/services/user.service';

@GapiModule({
    imports: [
        UserModule
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

@GapiModule({
    controllers: [
        UserQueriesController,
        UserMutationsController
    ]
})
export class UserModule {}
```


#### Query
### Folder root/src/user/query.controller.ts
```typescript
import { Query, GraphQLNonNull, Scope, Type, GraphQLObjectType, Mutation, GapiController, Service, GraphQLInt, Inject } from "gapi";
import { UserService } from './services/user.service';

export const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: {
        id: {
            type: GraphQLInt
        },
    }
});

@GapiController()
export class UserQueriesController {
    @Inject() userService: UserService;

    @Scope('ADMIN')
    @Type(UserType)
    @Query({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    findUser(root, { id }, context) {
        console.log(this);
        return UserService.findUser(id);
    }

}


```


#### Mutation
### Folder root/src/user/mutation.controller.ts
```typescript
import { Query, GraphQLNonNull, Scope, Type, GraphQLObjectType, Mutation, GapiController, Service, GraphQLInt } from "gapi";
import { UserService } from './services/user.service';

export const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: {
        id: {
            type: GraphQLInt
        },
    }
});

@GapiController()
export class UserMutationsController {

    @Scope('ADMIN')
    @Type(UserType)
    @Mutation({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    deleteUser(root, { id }, context) {
        return UserService.deleteUser(id);
    }

    @Scope('ADMIN')
    @Type(UserType)
    @Mutation({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    updateUser(root, { id }, context) {
        return UserService.updateUser(id);
    }

    @Scope('ADMIN')
    @Type(UserType)
    @Mutation({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    addUser(root, { id }, context) {
        return UserService.addUser(id);
    }

}

```

#### Create Service with @Service decorator somewhere
### Folder root/src/user/services/user.service.ts
```typescript
import { Service } from "gapi";

@Service()
export class UserService {

    public static findUser(id: number) {
        return { id: 1 };
    }

    public static addUser(id: number) {
        return { id: 1 };
    }

    public static deleteUser(id: number) {
        return { id: 1 };
    }

    public static updateUser(id) {
        return { id: 1 };
    }

    public static subscribeToUserUpdates() {
        return { id: 1 };
    }

}
```


#### Finally Bootstrap your application
### Folder root/src/main.ts
```typescript

import { AppModule } from './app/app.module';
import { Bootstrap } from 'gapi';

Bootstrap(AppModule);

```


#### Start your application using following command inside root folder of the repo
## Important the script will search main.ts inside root/src/main.ts where we bootstrap our module bellow

```
gapi-cli start
```


Enjoy ! :)