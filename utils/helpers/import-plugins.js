"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../utils/container/index");
const plugin_service_1 = require("../../utils/services/plugin/plugin.service");
const hapiPluginService = index_1.default.get(plugin_service_1.HapiPluginService);
function importPlugins(plugins, original, status) {
    plugins.forEach(plugin => {
        if (plugin.constructor === Function) {
            hapiPluginService.register(index_1.default.get(plugin));
        }
        else {
            hapiPluginService.register(plugin);
        }
    });
    return Promise.resolve();
}
exports.importPlugins = importPlugins;
