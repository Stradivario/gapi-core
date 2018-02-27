import { GraphQLSchema } from 'graphql';
import { Service } from 'typedi';

@Service()
export class SchemaService {
    generateSchema(Query?: any, Mutation?: any, Subscription?: any) {
        const schema: any = {};
        if (Query) {
            schema.query = Query;
        }
        if (Mutation) {
            schema.mutation = Mutation;
        }
        if (Subscription) {
            schema.subscription = Subscription;
        }
        return new GraphQLSchema(schema)
    }
}