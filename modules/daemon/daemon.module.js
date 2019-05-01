"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var DaemonModule_1;
const core_1 = require("@rxdi/core");
const daemon_interface_1 = require("./daemon.interface");
const daemon_service_1 = require("./services/daemon.service");
const after_start_service_1 = require("./services/after-start.service");
let DaemonModule = DaemonModule_1 = class DaemonModule {
    static forRoot(options = {}) {
        return {
            module: DaemonModule_1,
            providers: [
                ...(options.activated
                    ? [
                        daemon_service_1.DaemonService,
                        after_start_service_1.AfterStart,
                        {
                            provide: daemon_interface_1.DaemonLink,
                            useValue: options.link || 'http://localhost:42000/graphql'
                        }
                    ]
                    : [])
            ]
        };
    }
};
DaemonModule = DaemonModule_1 = __decorate([
    core_1.Module({
        providers: []
    })
], DaemonModule);
exports.DaemonModule = DaemonModule;
