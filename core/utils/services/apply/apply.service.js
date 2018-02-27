"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const server_module_1 = require("../../../modules/server/server.module");
exports.ApplyServicesHook = (self, options) => {
    if (options.imports) {
        options.imports.forEach(module => {
            const currentModule = typedi_1.default.get(module);
            // Object.assign(self, { [currentModule.constructor.name]: currentModule});
            if (currentModule instanceof server_module_1.GapiServerModule) {
                Object.assign(self, { start: currentModule.start });
            }
        });
    }
    if (options.services) {
        options.services.forEach(m => {
            const currentService = typedi_1.default.get(m);
            // Object.assign(self, { [currentService.constructor.name]: currentService});
        });
    }
    if (options.controllers) {
        options.controllers.forEach(m => {
            const currentService = typedi_1.default.get(m);
            // Object.assign(self, { [currentService.constructor.name]: currentService});
        });
    }
};
