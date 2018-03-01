"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("./Container");
__export(require("./decorators/Service"));
__export(require("./decorators/Inject"));
__export(require("./decorators/InjectMany"));
var Container_2 = require("./Container");
exports.Container = Container_2.Container;
var ContainerInstance_1 = require("./ContainerInstance");
exports.ContainerInstance = ContainerInstance_1.ContainerInstance;
exports.default = Container_1.Container;
