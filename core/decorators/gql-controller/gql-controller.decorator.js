"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typedi_1 = require("typedi");
const mutation_service_1 = require("../../utils/services/mutation/mutation.service");
const query_service_1 = require("../../utils/services/query/query.service");
const controller_config_service_1 = require("../../utils/services/controller-config/controller-config.service");
function GapiController(opt) {
    const controllerConfigService = typedi_1.default.get(controller_config_service_1.ControllerConfigService);
    const options = opt;
    return (target) => {
        const original = target;
        controllerConfigService.set(original.prototype.name, options);
        function construct(constructor, args) {
            const c = function () {
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            return new c();
        }
        const f = function (...args) {
            console.log('Loaded Module: ' + original.name);
            return construct(original, args);
        };
        f.prototype = original.prototype;
        f.prototype.Gquery = typedi_1.default.get(query_service_1.GapiQueryService).get(original.prototype.name);
        f.prototype.Gmutation = typedi_1.default.get(mutation_service_1.GapiMutationsService).get(original.prototype.name);
        f.prototype.Gconfig = controllerConfigService.get(original.prototype.name);
        f.prototype.Gconfig.scope = f.prototype.Gconfig.scope || ['ADMIN'];
        // Reflect.defineMetadata(GapiControllerSymbol, options, f);
        return f;
    };
}
exports.GapiController = GapiController;
