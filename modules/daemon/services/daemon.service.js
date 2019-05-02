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
const graphql_1 = require("@rxdi/graphql");
const core_1 = require("@rxdi/core");
const daemon_interface_1 = require("../daemon.interface");
const hapi_1 = require("@rxdi/hapi");
const hapi_2 = require("hapi");
let DaemonService = class DaemonService {
    constructor(defaultDaemonLink, server) {
        this.defaultDaemonLink = defaultDaemonLink;
        this.server = server;
    }
    notifyDaemon() {
        return graphql_1.sendRequest({
            query: `
            mutation notifyDaemon($repoPath: String!, $serverMetadata: ServerMetadataInputType) {
              notifyDaemon(repoPath: $repoPath, serverMetadata: $serverMetadata) {
                repoPath
                serverMetadata {
                  port
                }
              }
            }
            `,
            variables: {
                repoPath: process.cwd(),
                serverMetadata: {
                    port: this.server.info.port
                }
            }
        }, this.defaultDaemonLink);
    }
};
DaemonService = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(daemon_interface_1.DaemonLink)),
    __param(1, core_1.Inject(hapi_1.HAPI_SERVER)),
    __metadata("design:paramtypes", [String, hapi_2.Server])
], DaemonService);
exports.DaemonService = DaemonService;
