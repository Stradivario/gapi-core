import * as Boom from 'boom';
import { Server, Response, Request, ReplyNoContinue } from 'hapi';
import * as GraphiQL from 'apollo-server-module-graphiql';
import { runHttpQuery, HttpQueryError } from 'apollo-server-core';
import { ServerUtilService } from '../server/server.service';
import { Container, Service} from '../../../utils/container/index';
import { AuthService } from '../../services/auth/auth.service';

export interface IRegister {
  (server: Server, options: any, next: any): void;
  attributes?: any;
}
export type HapiOptionsFunction = (req?: Request) => any | Promise<any>;

export interface HapiPluginOptions {
  path: string;
  route?: any;
  graphqlOptions: any | HapiOptionsFunction;
}

function runHttpQueryWrapper(options: any | HapiOptionsFunction, request: Request, reply: ReplyNoContinue): Promise<Response> {
  return runHttpQuery([request], {
    method: request.method.toUpperCase(),
    options: options,
    query: request.method === 'post' ? request.payload : request.query,
  }).then((gqlResponse) => {
    return reply(gqlResponse).type('application/json');
  }, (error: HttpQueryError) => {
    if ('HttpQueryError' !== error.name) {
      throw error;
    }

    if (true === error.isGraphQLError) {
      return reply(error.message).code(error.statusCode).type('application/json');
    }

    const err = Boom.create(error.statusCode);
    err.output.payload.message = error.message;
    if (error.headers) {
      Object.keys(error.headers).forEach((header) => {
        err.output.headers[header] = error.headers[header];
      });
    }

    return reply(err);
  });
}

const graphqlHapi: IRegister = function (server: Server, options: HapiPluginOptions, next) {
  if (!options || !options.graphqlOptions) {
    throw new Error('Apollo Server requires options.');
  }

  if (arguments.length !== 3) {
    throw new Error(`Apollo Server expects exactly 3 argument, got ${arguments.length}`);
  }

  server.route({
    method: ['GET', 'POST'],
    path: options.path || '/graphql',
    config: options.route || {},
    handler: async (request, reply) => {
      if (request.headers.authorization && request.headers.authorization !== 'undefined') {
        try {
          
          const serviceUtilsService: AuthService = Container.get(AuthService);
         
          options.graphqlOptions.context = await serviceUtilsService.modifyFunctions.validateToken(request.headers.authorization);
   
        } catch (e) {
          return reply(Boom.unauthorized());
        }
      } else {
        options.graphqlOptions.context = null;
      }
      return runHttpQueryWrapper(options.graphqlOptions, request, reply);
    },
  });

  return next();
};

graphqlHapi.attributes = {
  name: 'graphql',
  version: '0.0.1',
};

export type HapiGraphiQLOptionsFunction = (req?: Request) => GraphiQL.GraphiQLData | Promise<GraphiQL.GraphiQLData>;


export interface HapiGraphiQLPluginOptions {
  path: string;
  route?: any;
  graphiqlOptions: GraphiQL.GraphiQLData | HapiGraphiQLOptionsFunction;
}

const graphiqlHapi: IRegister = function (server: Server, options: HapiGraphiQLPluginOptions, next) {
  if (!options || !options.graphiqlOptions) {
    throw new Error('Apollo Server GraphiQL requires options.');
  }

  if (arguments.length !== 3) {
    throw new Error(`Apollo Server GraphiQL expects exactly 3 arguments, got ${arguments.length}`);
  }

  server.route({
    method: 'GET',
    path: options.path || '/graphiql',
    config: options.route || {},
    handler: (request, reply) => {
      const query = request.query;
      GraphiQL.resolveGraphiQLString(query, options.graphiqlOptions, request)
      .then(graphiqlString => {
        reply(graphiqlString).header('Content-Type', 'text/html');
      }, error => reply(error));
    },
  });

  return next();
};

graphiqlHapi.attributes = {
  name: 'graphiql',
  version: '0.0.1',
};

export { graphqlHapi, graphiqlHapi };