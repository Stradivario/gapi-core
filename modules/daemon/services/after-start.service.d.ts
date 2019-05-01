import { AfterStarterService } from '@rxdi/core';
import { DaemonService } from './daemon.service';
export declare class AfterStart {
    private afterStarterService;
    private daemonService;
    constructor(afterStarterService: AfterStarterService, daemonService: DaemonService);
}
