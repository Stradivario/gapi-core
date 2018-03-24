"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Resolve(key) {
    return (t, propKey, descriptor) => {
        const originalMethod = descriptor.value;
        const target = t;
        const metadata = target._metadata || [];
        metadata.push({ key: key, resolve: descriptor.value });
        target.constructor.prototype._metadata = metadata;
        return descriptor;
    };
}
exports.Resolve = Resolve;
