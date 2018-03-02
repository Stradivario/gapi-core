"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
// export interface GapiController {
//     _controller_name: string;
//     _settings: ControllerMappingSettings;
//     _queries: Map<string, GenericGapiResolversType>;
//     _subscriptions: Map<string, GenericGapiResolversType>;
//     _mutations: Map<string, GenericGapiResolversType>;
// }
// export function GapiController<T, K extends keyof T>(settings?: ControllerMappingSettings) {
//     const options = settings;
//     return (target) => {
//         const original = target;
//         const currentController = Container.get(ControllerContainerService).createController(original.prototype.name);
//         function construct(constructor, args) {
//             const c: any = function () {
//                 this.gapi_settings  = currentController._settings;
//                 this.gapi_mutations = currentController._mutations;
//                 this.gapi_queries = currentController._queries;
//                 this.gapi_subscriptions = currentController._subscriptions;
//                 if(options) {
//                     Object.assign(this.gapi_settings, options)
//                 }
//                 return constructor.apply(this, args);
//             };
//             c.prototype = constructor.prototype;
//             Container.set({type: c});
//             return new c();
//         }
//         const f: any = function (...args) {
//             console.log('Loaded Controller: ' + original.name);
//             return construct(original, args);
//         };
//         return f;
//     };
// }
