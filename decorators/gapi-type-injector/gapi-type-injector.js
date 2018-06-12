"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../utils//container/index");
function InjectTypePrivate(Type) {
    const currentType = new Type();
    if (!index_1.Container.has(currentType.name)) {
        index_1.Container.set(currentType.name, currentType);
    }
    return index_1.Container.get(currentType.name);
}
// Beta type injector not working in this moment
function TypeInjector(Type) {
    return function (target, propertyName, index) {
        target[propertyName] = InjectTypePrivate(Type);
        target.constructor.prototype[propertyName] = InjectTypePrivate(Type);
    };
}
exports.TypeInjector = TypeInjector;
function InjectType(Service) {
    return InjectTypePrivate(Service);
}
exports.InjectType = InjectType;
