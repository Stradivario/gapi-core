import { sendRequest } from '@rxdi/graphql';
import { Injectable, Inject } from '@rxdi/core';
import { DaemonLink } from '../daemon.interface';
import { HAPI_SERVER } from '@rxdi/hapi';
import { Server } from 'hapi';

@Injectable()
export class DaemonService {
  constructor(
    @Inject(DaemonLink) private defaultDaemonLink: DaemonLink,
    @Inject(HAPI_SERVER) private server: Server,
  ) {}

  notifyDaemon() {
    return sendRequest<{notifyDaemon: { repoPath: string }}>(
      {
        query: `
            mutation notifyDaemon($repoPath: String!, $serverMetadata: ServerMetadataInputType) {
              notifyDaemon(repoPath: $repoPath, serverMetadata: $serverMetadata) {
                repoPath
                serverMetadata {
                  port
                }
              }
            }
            `,
        variables: {
          repoPath: process.cwd(),
          serverMetadata: {
            port: this.server.info.port
          }
        }
      },
      this.defaultDaemonLink
    );
  }
}
