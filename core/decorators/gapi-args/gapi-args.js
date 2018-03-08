"use strict";
// const test = {
//     scope: [ENUMS.USER_TYPE.ADMIN.key, ENUMS.USER_TYPE.USER.key],
//     type: RelationshipType,
//     args: {
//       message: {
//         type: new GraphQLNonNull(GraphQLString)
//       },
//       userId: {
//         type: new GraphQLNonNull(GraphQLInt)
//       },
//       friendId: {
//         type: new GraphQLNonNull(GraphQLInt)
//       },
//       email: {
//         type: new GraphQLNonNull(GraphQLString)
//       }
//     },
//     resolve: (root, { userId, friendId, email }, context: Credential) => {
//       return Relationship.create({
//         userId: userId,
//         friendId: friendId,
//         lastEditedBy: context.user.id,
//         status: ENUMS.STATUS.PENDING.key,
//         email: email || ''
//       });
//     }
//   };
// ;
Object.defineProperty(exports, "__esModule", { value: true });
function Args(arg) {
    Object.keys(arg).forEach(a => {
        arg[a] = { type: arg[a] };
    });
    const originalDecoratorArguments = { args: arg };
    return (t, propertyName, descriptor) => {
        const target = t;
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            let result = originalMethod.apply(args);
            result = Object.assign({}, originalDecoratorArguments, result);
            return result;
        };
        return descriptor;
    };
}
exports.Args = Args;
