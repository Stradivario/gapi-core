export declare class HookService {
    static AttachHooks(graphQLFields: any): void;
    static canAccess(routeScope: any, context: any): true | void;
    static AuthenticationHooks(resolver: any, root: any, args: any, context: any, info: any): void;
    static ResolverHooks(resolver: any, root: any, args: any, context: any, info: any): void;
    static AddHooks(resolver: any): void;
}
