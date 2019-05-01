import { DaemonLink } from '../daemon.interface';
export declare class DaemonService {
    private defaultDaemonLink;
    constructor(defaultDaemonLink: DaemonLink);
    notifyDaemon(): PromiseLike<import("@rxdi/graphql/dist/plugin-init").Response<{
        notifyDaemon: {
            repoPath: string;
        };
    }>>;
}
