import { sendRequest } from '@rxdi/graphql';
import { Injectable, Inject } from '@rxdi/core';
import { DaemonLink } from '../daemon.interface';

@Injectable()
export class DaemonService {
  constructor(@Inject(DaemonLink) private defaultDaemonLink: DaemonLink) {}

  notifyDaemon() {
    return sendRequest<{notifyDaemon: { repoPath: string }}>(
      {
        query: `
            mutation notifyDaemon($repoPath: String!) {
              notifyDaemon(repoPath: $repoPath) {
                repoPath
              }
            }
            `,
        variables: {
          repoPath: process.cwd()
        }
      },
      this.defaultDaemonLink
    );
  }
}
