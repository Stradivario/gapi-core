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
const typedi_1 = require("typedi");
const controller_service_1 = require("../../new_services/controller-service/controller.service");
const graphql_1 = require("graphql");
const config_service_1 = require("../../services/config/config.service");
const schema_service_1 = require("../../services/schema/schema.service");
const server_module_1 = require("../../../modules/server/server.module");
function getAllFields() {
    return __awaiter(this, void 0, void 0, function* () {
        const controllerContainerService = typedi_1.default.get(controller_service_1.ControllerContainerService);
        return new Promise((resolve, reject) => {
            const schemaService = typedi_1.default.get(schema_service_1.SchemaService);
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
                Array.from(queries).forEach(key => Object.assign(Fields.query, { [key]: currentCtrl.getQuery(key) }));
                Array.from(mutations).forEach(key => Object.assign(Fields.mutation, { [key]: currentCtrl.getMutation(key) }));
                Array.from(subscriptions).forEach(key => Object.assign(Fields.subscription, { [key]: currentCtrl.getSubscription(key) }));
            });
            console.log('MY SCHEMA INTERNAL', Fields);
            function generateType(query) {
                return new graphql_1.GraphQLObjectType({
                    name: 'Query',
                    description: 'Query type for all get requests which will not change persistent data',
                    fields: Object.assign({}, query)
                });
            }
            const schema = schemaService.generateSchema(generateType(Fields.query));
            resolve(schema);
        });
    });
}
exports.Bootstrap = (App) => {
    const a = typedi_1.default.get(App);
    console.log(a);
    getAllFields()
        .then((schema) => {
        const configService = typedi_1.default.get(config_service_1.ConfigService);
        configService.APP_CONFIG.schema = schema;
        console.log(schema);
        console.log('111');
        const server = server_module_1.GapiServerModule.forRoot(configService.APP_CONFIG);
        typedi_1.default.get(server).start().then((data) => console.log(data)).catch(e => console.log(e));
    });
    return App;
};
