"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const ngx_cache_layer_service_1 = require("../events/ngx-cache-layer.service");
index_1.default.set(ngx_cache_layer_service_1.CacheService, new ngx_cache_layer_service_1.CacheService());
const events = index_1.default.get(ngx_cache_layer_service_1.CacheService).createLayer({ name: 'gapi_events' });
function OfType(type) {
    return (target, propertyKey, descriptor) => {
        const subscription = events.getItemObservable(type)
            .subscribe((item) => {
            const originalDescriptor = descriptor.value;
            descriptor.value = function () {
                return originalDescriptor.call(...item.data);
            };
            descriptor.value();
        });
    };
}
function strEnum(o) {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
const GapiEffects = strEnum([
    'findUser'
]);
let UserEffectsService = class UserEffectsService {
    findUser(args, context, info) {
        console.log(args, context);
    }
};
__decorate([
    OfType(GapiEffects.findUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], UserEffectsService.prototype, "findUser", null);
UserEffectsService = __decorate([
    index_1.Service()
], UserEffectsService);
index_1.default.get(UserEffectsService);
function getAllFields() {
    return __awaiter(this, void 0, void 0, function* () {
        const controllerContainerService = index_1.default.get(controller_service_1.ControllerContainerService);
        const moduleContainerService = index_1.default.get(module_service_1.ModuleContainerService);
        return new Promise((resolve, reject) => {
            Array.from(moduleContainerService.modules.keys()).forEach(module => {
                const currentModule = moduleContainerService.getModule(module);
                currentModule.resolveDependencyHandlers();
            });
            const Fields = { query: {}, mutation: {}, subscription: {} };
            Array.from(controllerContainerService.controllers.keys())
                .forEach(controller => {
                const currentCtrl = controllerContainerService.getController(controller);
                currentCtrl.getAllDescriptors().forEach(descriptor => {
                    const desc = currentCtrl.getDescriptor(descriptor).value();
                    Fields[desc.method_type][desc.method_name] = desc;
                    const c = controller_hooks_1.controllerHooks.getHook(controller);
                    const originalResolve = desc.resolve.bind(c);
                    desc.resolve = function resolve(...args) {
                        events.putItem({ key: desc.method_name, data: args });
                        return originalResolve.apply(c, args);
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
    console.log(`Bootstrapping application...`);
    Object.defineProperty(App, 'name', { value: 'AppModule', writable: true });
    index_1.default.get(App);
    console.log('Finished!\nStarting application...');
    getAllFields()
        .then((schema) => {
        const configService = index_1.default.get(config_service_1.ConfigService);
        configService.APP_CONFIG.schema = schema;
        const server = index_1.default.get(server_module_1.GapiServerModule.forRoot(configService.APP_CONFIG));
        server.start()
            .then((data) => {
            onExitProcess(server);
            console.log('Application started!');
        })
            .catch(e => console.log(e));
    });
    return App;
};
