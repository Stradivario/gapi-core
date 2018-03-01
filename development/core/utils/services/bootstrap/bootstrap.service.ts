import Container from "typedi";
import { ControllerContainerService } from "../../new_services/controller-service/controller.service";
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
            console.log(queries, mutations, subscriptions);
            Array.from(queries).forEach(key => Object.assign(Fields.query, {[key]: currentCtrl.getQuery(key)}))
            Array.from(mutations).forEach(key => Object.assign(Fields.mutation, {[key]: currentCtrl.getMutation(key)}))
            Array.from(subscriptions).forEach(key => Object.assign(Fields.subscription, {[key]: currentCtrl.getSubscription(key)}))
        });
        console.log('MY SCHEMA INTERNAL', Fields);
        function generateType(query) {
            return new GraphQLObjectType({
                name: 'Query',
                description: 'Query type for all get requests which will not change persistent data',
                fields: {
                      ...query,
                }
            })
        }
        const schema = schemaService.generateSchema(generateType(Fields.query));
        resolve(schema);
    }) 
}

export const Bootstrap = (App) => {
    const a = <any>Container.get(App);
    console.log(a);
    getAllFields()
    .then((schema: GraphQLSchema) => {
        const configService = Container.get(ConfigService);
        configService.APP_CONFIG.schema = schema;
        console.log(schema);
            console.log('111')
            const server = GapiServerModule.forRoot(configService.APP_CONFIG);
            Container.get(server).start().then((data) => console.log(data)).catch(e => console.log(e));
    })
    
    return App;
};