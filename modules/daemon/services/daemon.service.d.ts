import { DaemonLink } from '../daemon.interface';
import { Server } from 'hapi';
export declare class DaemonService {
    private defaultDaemonLink;
    private server;
    constructor(defaultDaemonLink: DaemonLink, server: Server);
    notifyDaemon(): PromiseLike<import("@rxdi/graphql/dist/plugin-init").Response<{
        notifyDaemon: {
            repoPath: string;
        };
    }>>;
}
