"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("../Container");
function Injector(Service) {
    return function (target, propertyName, index) {
        const service = Container_1.Container.get(Service);
        target[propertyName] = service;
    };
}
exports.Injector = Injector;
