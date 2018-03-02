"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_service_1 = require("../../services/controller-service/controller.service");
const container_1 = require("../../../../../core/utils/container");
const Token_1 = require("../Token");
function GapiController(optionsOrServiceName) {
    return function (target) {
        const currentController = container_1.default.get(controller_service_1.ControllerContainerService).createController(target.prototype.name);
        this.gapi_settings = currentController._settings;
        this.gapi_mutations = currentController._mutations;
        this.gapi_queries = currentController._queries;
        this.gapi_subscriptions = currentController._subscriptions;
        if (optionsOrServiceName) {
            Object.assign(this.gapi_settings, optionsOrServiceName);
        }
        const service = {
            type: target
        };
        if (typeof optionsOrServiceName === "string" || optionsOrServiceName instanceof Token_1.Token) {
            console.log('1');
            service.id = optionsOrServiceName;
            service.multiple = optionsOrServiceName.multiple;
            service.global = optionsOrServiceName.global || false;
            service.transient = optionsOrServiceName.transient;
        }
        else if (optionsOrServiceName) {
            console.log('2');
            service.id = optionsOrServiceName.id;
            service.factory = optionsOrServiceName.factory;
            service.multiple = optionsOrServiceName.multiple;
            service.global = optionsOrServiceName.global || false;
            service.transient = optionsOrServiceName.transient;
        }
        console.log('3');
        container_1.default.set(service);
    };
}
exports.GapiController = GapiController;
