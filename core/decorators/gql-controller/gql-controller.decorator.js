"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typedi_1 = require("typedi");
const controller_service_1 = require("../../utils/new_services/controller-service/controller.service");
function GapiController(settings) {
    const options = settings;
    return (target) => {
        const original = target;
        const currentController = typedi_1.default.get(controller_service_1.ControllerContainerService).createController(original.prototype.name);
        function construct(constructor, args) {
            const c = function () {
                this.gapi_settings = currentController._settings;
                this.gapi_mutations = currentController._mutations;
                this.gapi_queries = currentController._queries;
                this.gapi_subscriptions = currentController._subscriptions;
                if (options) {
                    Object.assign(this.gapi_settings, options);
                }
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            // Container.set(f, new c());
            // return new c();
            // return new c();
        }
        const f = function (...args) {
            console.log('Loaded Module: ' + original.name);
            return construct(original, args);
        };
        typedi_1.default.set(f);
        return f;
    };
}
exports.GapiController = GapiController;
