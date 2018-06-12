"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_injectables_1 = require("./get-injectables");
const index_1 = require("../../utils/container/index");
const module_service_1 = require("../services/module/module.service");
const moduleContainerService = index_1.default.get(module_service_1.ModuleContainerService);
function importModules(injectables, original, status) {
    injectables.map(injectable => {
        if (!injectable) {
            throw new Error(`Incorrect importing '${status}' inside ${original.name}`);
        }
        if (injectable.constructor === Object) {
            if (injectable.provide && injectable.useClass) {
                const original = injectable.useClass;
                const f = () => new original(...get_injectables_1.getInjectables(injectable));
                index_1.default.set(injectable.provide, new f.constructor());
            }
            else if (injectable.provide && injectable.useFactory) {
                moduleContainerService.setLazyFactory(injectable, original);
            }
            else if (injectable.provide && injectable.useValue) {
                index_1.default.set(injectable.provide, injectable.useValue);
            }
            else {
                throw new Error(`Wrong Injectable '${status}' ${injectable.provide ? JSON.stringify(injectable.provide) : ''} inside module: ${original.name}`);
            }
        }
        else {
            let name = injectable.name;
            if (name === 'f') {
                name = injectable.constructor.name;
            }
            Object.defineProperty(injectable, 'name', { value: name, writable: true });
            index_1.default.get(injectable);
        }
    });
}
exports.importModules = importModules;
