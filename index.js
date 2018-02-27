"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./core/index"));
var typedi_1 = require("typedi");
exports.Container = typedi_1.Container;
exports.Service = typedi_1.Service;
__export(require("graphql"));
