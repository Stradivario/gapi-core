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
const hook_service_1 = require("../../services/hook/hook.service");
const controller_hooks_1 = require("../controller-service/controller-hooks");
const module_service_1 = require("../module/module.service");
const ngx_events_layer_service_1 = require("../events/ngx-events-layer.service");
const file_1 = require("../../services/file");
const graphql_tools_1 = require("graphql-tools");
function getAllFields() {
    return __awaiter(this, void 0, void 0, function* () {
        const events = index_1.default.get(ngx_events_layer_service_1.CacheService);
        const controllerContainerService = index_1.default.get(controller_service_1.ControllerContainerService);
        const moduleContainerService = index_1.default.get(module_service_1.ModuleContainerService);
        // Array.from(moduleContainerService.modules.keys()).forEach(module => {
        //     const currentModule = moduleContainerService.getModule(module);
        //     currentModule.resolveDependencyHandlers();
        // });
        const methodBasedEffects = [];
        const Fields = { query: {}, mutation: {}, subscription: {} };
        Array.from(controllerContainerService.controllers.keys()).forEach(controller => {
            const currentCtrl = controllerContainerService.getController(controller);
            currentCtrl.getAllDescriptors().forEach(descriptor => {
                const desc = currentCtrl.getDescriptor(descriptor).value();
                Fields[desc.method_type][desc.method_name] = desc;
                const effectName = desc.effect ? desc.effect : desc.method_name;
                methodBasedEffects.push(effectName);
                const c = controller_hooks_1.controllerHooks.getHook(controller);
                const originalResolve = desc.resolve.bind(c);
                desc.resolve = function resolve(...args) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const methodEffect = events.map.has(desc.method_name);
                        const customEffect = events.map.has(desc.effect);
                        const result = yield originalResolve.apply(c, args);
                        if (methodEffect || customEffect) {
                            let tempArgs = [result, ...args];
                            tempArgs = tempArgs.filter(i => i && i !== 'undefined');
                            events
                                .getLayer(effectName)
                                .putItem({ key: effectName, data: tempArgs });
                        }
                        return result;
                    });
                };
            });
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
        const query = generateType(Fields.query, 'Query', 'Query type for all get requests which will not change persistent data');
        const mutation = generateType(Fields.mutation, 'Mutation', 'Mutation type for all requests which will change persistent data');
        const subscription = generateType(Fields.subscription, 'Subscription', 'Subscription type for all rabbitmq subscriptions via pub sub');
        hook_service_1.HookService.AttachHooks([query, mutation, subscription]);
        const schema = index_1.default.get(schema_service_1.SchemaService).generateSchema(query, mutation, subscription);
        try {
            index_1.default.get(file_1.FileService).writeEffectTypes(methodBasedEffects);
        }
        catch (e) {
            console.error('Effects are not saved to directory');
        }
        return yield Promise.resolve(schema);
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
exports.Bootstrap = (App) => __awaiter(this, void 0, void 0, function* () {
    console.log(`Bootstrapping application...`);
    Object.defineProperty(App, 'name', { value: 'AppModule', writable: true });
    index_1.default.get(App);
    console.log('Finished!\nStarting application...');
    const schema = yield getAllFields();
    const configService = index_1.default.get(config_service_1.ConfigService);
    if (configService.APP_CONFIG.schema) {
        configService.APP_CONFIG.schema = yield configService.APP_CONFIG.schema;
    }
    else {
        configService.APP_CONFIG.schema = schema;
    }
    const schemas = [configService.APP_CONFIG.schema];
    if (schema.getQueryType() || schema.getMutationType() || schema.getSubscriptionType()) {
        schemas.push(schema);
    }
    configService.APP_CONFIG.schema = yield graphql_tools_1.mergeSchemas({ schemas });
    const gapiServer = index_1.default.get(server_module_1.GapiServerModule.forRoot(configService.APP_CONFIG));
    let server;
    try {
        server = yield gapiServer.start();
    }
    catch (e) {
        console.log(e);
    }
    onExitProcess(gapiServer);
    return Promise.resolve({ server: server, schema: schema });
});
