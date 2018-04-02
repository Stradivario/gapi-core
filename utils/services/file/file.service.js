"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const fs_1 = require("fs");
const fs_extra_1 = require("fs-extra");
let FileService = class FileService {
    writeEffectTypes(effects) {
        const types = `
function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
export const EffectTypes = strEnum(${JSON.stringify(effects).replace(/"/g, `'`).replace(/,/g, ',\n')});
export type EffectTypes = keyof typeof EffectTypes;
`;
        const folder = process.env.INTROSPECTION_FOLDER || `./src/app/core/api-introspection/`;
        fs_extra_1.ensureDirSync(folder);
        fs_1.writeFileSync(folder + 'EffectTypes.ts', types, 'utf8');
    }
};
FileService = __decorate([
    container_1.Service()
], FileService);
exports.FileService = FileService;
