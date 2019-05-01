import { ModuleWithServices } from '@rxdi/core';
import { DaemonConfig } from './daemon.interface';
export declare class DaemonModule {
    static forRoot({ activated, link }: DaemonConfig): ModuleWithServices;
}
