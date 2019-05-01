import { InjectionToken } from '@rxdi/core';
export declare const DaemonLink: InjectionToken<string>;
export declare type DaemonLink = string;
export interface DaemonConfig {
    activated: boolean;
    link?: DaemonLink;
}
