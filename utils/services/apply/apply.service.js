"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../utils/container/index");
exports.ApplyServicesHook = (self, options) => {
    if (options.imports) {
        options.imports.forEach(m => index_1.default.get(m));
    }
    if (options.services) {
        options.services.forEach(m => index_1.default.get(m));
    }
    if (options.controllers) {
        options.controllers.forEach(m => index_1.default.get(m));
    }
};
function GetType(type) {
    return index_1.default.get(type);
}
exports.GetType = GetType;
