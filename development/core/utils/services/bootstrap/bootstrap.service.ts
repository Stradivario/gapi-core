import Container, {Service} from '../../../utils/container/index';
import { ControllerContainerService } from "../../services/controller-service/controller.service";
import { ServerUtilService } from "../../services/server/server.service";
import { GraphQLSchema, GraphQLObjectType } from "graphql";
import { ConfigService } from "../../services/config/config.service";
import { SchemaService } from "../../services/schema/schema.service";
import { GapiServerModule } from "../../../modules/server/server.module";

async function getAllFields() {
    const controllerContainerService = Container.get(ControllerContainerService);
    return new Promise((resolve, reject) => {
        const schemaService = Container.get(SchemaService)
        let Fields = {
            query: {},
            mutation: {},
            subscription: {}
        };
        Array.from(controllerContainerService.controllers.keys())
            .forEach(controller => {
                const currentCtrl = controllerContainerService.getController(controller);
                const queries = Array.from(currentCtrl._queries.keys());
                const mutations = Array.from(currentCtrl._mutations.keys());
                const subscriptions = Array.from(currentCtrl._subscriptions.keys());
                Array.from(queries).forEach(key => Fields.query[key] = currentCtrl.getQuery(key))
                Array.from(mutations).forEach(key => Fields.mutation[key] = currentCtrl.getMutation(key))
                Array.from(subscriptions).forEach(key => Fields.subscription[key] = currentCtrl.getSubscription(key) )
            });

        function generateType(query, name, description) {
            if (!Object.keys(query).length) {
                return;
            }
            return new GraphQLObjectType({
                name: name,
                description: description,
                fields: query
            })
        }
        
        const schema = schemaService.generateSchema(
            generateType(Fields.query, 'Query', 'Query type for all get requests which will not change persistent data'),
            generateType(Fields.mutation, 'Mutation', 'Mutation type for all requests which will change persistent data'),
            generateType(Fields.subscription, 'Subscription', 'Subscription type for all rabbitmq subscriptions via pub sub')
        );
        // console.log(schema);
        resolve(schema);
    })
}

function onExitProcess(server: GapiServerModule) {
    process.on(<any>'cleanup', () => {
        console.log('App stopped')
        server.stop();
    });
    process.on('exit', function () {
        process.emit(<any>'cleanup');
    });
    process.on('SIGINT', function () {
        process.exit(2);
    });
    process.on('uncaughtException', function (e) {
        console.log(e.stack);
        process.exit(99);
    });
}

export const Bootstrap = (App) => {
    Container.get(App);
    getAllFields()
        .then((schema: GraphQLSchema) => {
            const configService = Container.get(ConfigService);
            configService.APP_CONFIG.schema = schema;
            const server = Container.get(GapiServerModule.forRoot(configService.APP_CONFIG));
            server.start()
                .then((data) => {
                    onExitProcess(server);
                    console.log('App started');
                })
                .catch(e => console.log(e));
        })

    return App;
};

