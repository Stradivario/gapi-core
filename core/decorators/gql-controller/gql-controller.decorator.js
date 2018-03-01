"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const controller_service_1 = require("../../utils/services/controller-service/controller.service");
const index_1 = require("../../utils/container/index");
function GapiController(settings) {
    const options = settings;
    return (target) => {
        const original = target;
        const currentController = index_1.default.get(controller_service_1.ControllerContainerService).createController(original.prototype.name);
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
            index_1.default.set({ type: c });
            return new c();
        }
        const f = function (...args) {
            console.log('Loaded Controller: ' + original.name);
            return construct(original, args);
        };
        return f;
    };
}
exports.GapiController = GapiController;
