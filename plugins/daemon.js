"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var DaemonModule_1;
const core_1 = require("@rxdi/core");
const graphql_1 = require("@rxdi/graphql");
const daemon_interface_1 = require("./daemon.interface");
let AfterStart = class AfterStart {
    constructor(defaultDaemonLink, afterStarterService) {
        this.defaultDaemonLink = defaultDaemonLink;
        this.afterStarterService = afterStarterService;
        this.afterStarterService.appStarted.subscribe(() => this.notifyDaemon());
    }
    notifyDaemon() {
        return graphql_1.sendRequest({
            query: `
        mutation notifyDaemon($repoPath: String!) {
          notifyDaemon(repoPath: $repoPath) {
            repoPath
          }
        }
        `,
            variables: {
                repoPath: process.cwd()
            }
        }, this.defaultDaemonLink);
    }
};
AfterStart = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(daemon_interface_1.DaemonLink)),
    __metadata("design:paramtypes", [String, core_1.AfterStarterService])
], AfterStart);
exports.AfterStart = AfterStart;
let DaemonModule = DaemonModule_1 = class DaemonModule {
    static forRoot({ activated, link }) {
        return {
            module: DaemonModule_1,
            providers: [
                ...activated ? [
                    AfterStart,
                    {
                        provide: daemon_interface_1.DaemonLink,
                        useValue: link || 'http://localhost:42000/graphql'
                    }
                ] : [],
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