"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_service_1 = require("../error/error.service");
const index_1 = require("../../../utils/container/index");
const config_service_1 = require("../../services/config/config.service");
function MakeError() {
    throw new error_service_1.createError('unauthorized', 'You are unable to fetch data');
}
class HookService {
    static AttachHooks(graphQLFields) {
        graphQLFields.forEach(type => {
            if (!type) {
                return;
            }
            const resolvers = type.getFields();
            Object.keys(resolvers).forEach(resolver => {
                resolvers[resolver].scope = resolvers[resolver].scope || [process.env.APP_DEFAULT_SCOPE || 'ADMIN'];
                if (!resolvers[resolver].public) {
                    HookService.AddHooks(resolvers[resolver]);
                }
            });
        });
    }
    static canAccess(routeScope, context) {
        return context && routeScope.filter(scope => scope === context.type).length ? true : MakeError();
    }
    static AuthenticationHooks(resolver, root, args, context, info) {
        HookService.canAccess(resolver.scope, context);
    }
    static ResolverHooks(resolver, root, args, context, info) {
        HookService.AuthenticationHooks(resolver, root, args, context, info);
    }
    static AddHooks(resolver) {
        if (index_1.Container.get(config_service_1.ConfigService).cert) {
            const resolve = resolver.resolve;
            resolver.resolve = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
                HookService.ResolverHooks(resolver, root, args, context, info);
                return yield resolve(root, args, context, info);
            });
        }
    }
}
exports.HookService = HookService;
