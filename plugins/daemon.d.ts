import { AfterStarterService, ModuleWithServices } from '@rxdi/core';
import { DaemonConfig, DaemonLink } from './daemon.interface';
export declare class AfterStart {
    private defaultDaemonLink;
    private afterStarterService;
    constructor(defaultDaemonLink: DaemonLink, afterStarterService: AfterStarterService);
    private notifyDaemon;
}
export declare class DaemonModule {
    static forRoot({ activated, link }: DaemonConfig): ModuleWithServices;
}
