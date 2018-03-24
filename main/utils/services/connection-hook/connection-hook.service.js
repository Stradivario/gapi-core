"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
let ConnectionHookService = class ConnectionHookService {
    constructor() {
        this.modifyHooks = {
            onSubConnection: this.onSubConnection,
            onSubOperation: this.onSubOperation
        };
    }
    onSubOperation(message, params, webSocket) {
        return params;
    }
    onSubConnection(connectionParams) {
        return { id: 1, userId: 1, user: { id: 1, type: 'ADMIN' } };
    }
};
ConnectionHookService = __decorate([
    container_1.Service()
], ConnectionHookService);
exports.ConnectionHookService = ConnectionHookService;
