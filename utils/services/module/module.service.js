"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../utils/container/index");
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
const container_1 = require("../../container");
const helpers_1 = require("../../helpers");
const Observable_1 = require("rxjs/Observable");
class ModuleMapping {
    constructor(name, injectables) {
        this._handlers = new BehaviorSubject_1.BehaviorSubject([]);
        this._module_name = name;
        this._injectables = injectables;
    }
    registerDependencyHandler(module) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalFactory = module.useFactory;
            module.useFactory = function () {
                if (module.deps && module.deps.length) {
                    return originalFactory(...module.deps);
                }
                else {
                    return originalFactory();
                }
            };
            container_1.Container.set(module.provide, module.useFactory());
            this._handlers.next([...this._handlers.getValue(), module]);
            return yield true;
        });
    }
    resolveDependencyHandlers() {
        return __awaiter(this, void 0, void 0, function* () {
            this._handlers.getValue().forEach(handler => {
                const injectables = [...handler.deps];
                let resolvedInjectables = [];
                injectables.forEach(i => {
                    if (i.constructor === Function) {
                        // resolvedInjectables = [...resolvedInjectables, Container.get(i)];
                    }
                    else {
                        resolvedInjectables = [...resolvedInjectables, i];
                    }
                });
                const originalFactory = handler.useFactory;
                handler.useFactory = function () {
                    console.log(resolvedInjectables);
                    return originalFactory(...resolvedInjectables);
                };
                container_1.Container.set(handler.provide, handler.useFactory());
                console.log(container_1.Container.get(handler.provide));
            });
            return yield true;
        });
    }
}
exports.ModuleMapping = ModuleMapping;
let ModuleContainerService = class ModuleContainerService {
    constructor() {
        this.modules = new Map();
        this.lazyFactories = new Map();
    }
    getModule(name) {
        if (this.modules.has(name)) {
            return this.modules.get(name);
        }
        else {
            throw new Error('Missing module internal Gapi Error!');
        }
    }
    createModule(name, injectables) {
        if (this.modules.has(name)) {
            return this.modules.get(name);
        }
        else {
            this.modules.set(name, new ModuleMapping(name, injectables));
            return this.modules.get(name);
        }
    }
    testCreateModuleAsync(module, original) {
        return __awaiter(this, void 0, void 0, function* () {
            if (module.types) {
                helpers_1.importModules(module.types, original, 'types');
            }
            if (module.effects) {
                helpers_1.importModules(module.effects, original, 'effects');
            }
            if (module.services) {
                helpers_1.importModules(module.services, original, 'services');
            }
            if (module.imports) {
                helpers_1.importModules(module.imports, original, 'imports');
            }
            if (module.controllers) {
                helpers_1.importModules(module.controllers, original, 'controllers');
            }
            if (module.plugins) {
                helpers_1.importPlugins(module.plugins, original, 'plugins');
            }
            console.log('Loaded Module: ' + original.name);
            // return Promise.all();
        });
    }
    setLazyFactory(injectable, original) {
        if (injectable.useFactory.constructor === Function) {
            if (injectable.deps && injectable.deps.length) {
                const originalFactory = injectable.useFactory;
                injectable.useFactory = () => originalFactory(...helpers_1.getInjectables(injectable.deps));
            }
            // moduleContainerService.createModule(original.name, null).registerDependencyHandler(injectable);
            const factory = injectable.useFactory();
            if (factory instanceof Observable_1.Observable) {
                factory.subscribe(v => container_1.Container.set(injectable.provide, v));
            }
            else if (factory instanceof Promise) {
                container_1.Container.set(injectable.provide, factory);
                this.lazyFactories.set(injectable.provide, factory);
            }
            else {
                container_1.Container.set(injectable.provide, factory);
            }
        }
        else {
            throw new Error(`Wrong Factory function ${injectable.provide ? JSON.stringify(injectable.provide) : ''} inside module: ${original.name}`);
        }
    }
};
ModuleContainerService = __decorate([
    index_1.Service()
], ModuleContainerService);
exports.ModuleContainerService = ModuleContainerService;
