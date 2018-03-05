# @gapi

![Build Status](http://gitlab.youvolio.com/open-source/gapi/badges/branch/build.svg)

#### @StrongTyped @GraphQL @API 

##### For questions/issues you can write ticket [here](http://gitlab.youvolio.com/open-source/gapi/issues)

## Installation and basic examples:
##### To install this library, run:

```bash
$ npm install Stradivario/gapi --save
```

## Consuming gapi


### Install gapi-cli globally using npm

```bash
npm install gapi-cli -g
```

## With CLI

### To skip the following steps creating project and bootstraping from scratch you can type the following command:

```bash
gapi-cli new my-project
```

Enter inside my-project and type: 

```bash
npm start
```


## Without CLI

### 

### Next create folder structure like this root/src/app



#### Create AppModule like the example above
#### Inject UserModule into imports inside AppModule
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

    private userService: UserService = Container.get(UserService);

    @Scope('ADMIN')
    @Type(UserType)
    @Query({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    findUser(root, { id }, context) {
        console.log(this);
        return this.userService.findUser(id);
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

    private userService: UserService = Container.get(UserService);

    @Scope('ADMIN')
    @Type(UserType)
    @Mutation({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    deleteUser(root, { id }, context) {
        return this.userService.deleteUser(id);
    }

    @Scope('ADMIN')
    @Type(UserType)
    @Mutation({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    updateUser(root, { id }, context) {
        return this.userService.updateUser(id);
    }

    @Scope('ADMIN')
    @Type(UserType)
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

#### Create Service with @Service decorator somewhere
### Folder root/src/user/services/user.service.ts
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