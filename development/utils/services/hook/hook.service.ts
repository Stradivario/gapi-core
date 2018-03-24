import { createError } from '../error/error.service';
import { Container } from '../../../utils/container/index';
import { ConfigService } from '../../services/config/config.service';

function MakeError() {
    throw new createError('unauthorized', 'You are unable to fetch data');
}

export class HookService {
    static AttachHooks(graphQLFields) {
        graphQLFields.forEach(type => {
            if(!type) {
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
        if(Container.get(ConfigService).cert) {
            const resolve = resolver.resolve;
            resolver.resolve = async (root, args, context, info) => {
                HookService.ResolverHooks(resolver, root, args, context, info);
                return await resolve(root, args, context, info);
            };  
        }
    }
}

