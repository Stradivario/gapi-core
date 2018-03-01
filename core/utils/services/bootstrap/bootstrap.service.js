"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../utils/container/index");
const controller_service_1 = require("../../services/controller-service/controller.service");
const graphql_1 = require("graphql");
const config_service_1 = require("../../services/config/config.service");
const schema_service_1 = require("../../services/schema/schema.service");
const server_module_1 = require("../../../modules/server/server.module");
function getAllFields() {
    return __awaiter(this, void 0, void 0, function* () {
        const controllerContainerService = index_1.default.get(controller_service_1.ControllerContainerService);
        return new Promise((resolve, reject) => {
            const schemaService = index_1.default.get(schema_service_1.SchemaService);
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
                Array.from(queries).forEach(key => Fields.query[key] = currentCtrl.getQuery(key));
                Array.from(mutations).forEach(key => Fields.mutation[key] = currentCtrl.getMutation(key));
                Array.from(subscriptions).forEach(key => Fields.subscription[key] = currentCtrl.getSubscription(key));
            });
            function generateType(query, name, description) {
                if (!Object.keys(query).length) {
                    return;
                }
                return new graphql_1.GraphQLObjectType({
                    name: name,
                    description: description,
                    fields: query
                });
            }
            const schema = schemaService.generateSchema(generateType(Fields.query, 'Query', 'Query type for all get requests which will not change persistent data'), generateType(Fields.mutation, 'Mutation', 'Mutation type for all requests which will change persistent data'), generateType(Fields.subscription, 'Subscription', 'Subscription type for all rabbitmq subscriptions via pub sub'));
            // console.log(schema);
            resolve(schema);
        });
    });
}
function onExitProcess(server) {
    process.on('cleanup', () => {
        console.log('App stopped');
        server.stop();
    });
    process.on('exit', function () {
        process.emit('cleanup');
    });
    process.on('SIGINT', function () {
        process.exit(2);
    });
    process.on('uncaughtException', function (e) {
        console.log(e.stack);
        process.exit(99);
    });
}
exports.Bootstrap = (App) => {
    index_1.default.get(App);
    getAllFields()
        .then((schema) => {
        const configService = index_1.default.get(config_service_1.ConfigService);
        configService.APP_CONFIG.schema = schema;
        const server = index_1.default.get(server_module_1.GapiServerModule.forRoot(configService.APP_CONFIG));
        server.start()
            .then((data) => {
            onExitProcess(server);
            console.log('App started');
        })
            .catch(e => console.log(e));
    });
    return App;
};
