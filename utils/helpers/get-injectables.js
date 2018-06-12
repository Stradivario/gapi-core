"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../utils/container/index");
function getInjectables(module) {
    const injectables = [];
    module.deps.forEach(i => {
        if (i.name) {
            return injectables.push(index_1.default.get(i));
        }
        else if (i.constructor === Function) {
            return injectables.push(index_1.default.get(i));
        }
        else {
            return injectables.push(i);
        }
    });
    return injectables;
}
exports.getInjectables = getInjectables;
