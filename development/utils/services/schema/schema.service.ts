import { GraphQLSchema } from 'graphql';
import Container, {Service} from '../../../utils/container/index';

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