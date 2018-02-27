"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Boom = require("boom");
const GraphiQL = require("apollo-server-module-graphiql");
const apollo_server_core_1 = require("apollo-server-core");
const server_service_1 = require("../server/server.service");
const typedi_1 = require("typedi");
function runHttpQueryWrapper(options, request, reply) {
    return apollo_server_core_1.runHttpQuery([request], {
        method: request.method.toUpperCase(),
        options: options,
        query: request.method === 'post' ? request.payload : request.query,
    }).then((gqlResponse) => {
        return reply(gqlResponse).type('application/json');
    }, (error) => {
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
const graphqlHapi = function (server, options, next) {
    if (!options || !options.graphqlOptions) {
        throw new Error('Apollo Server requires options.');
    }
    if (arguments.length !== 3) {
        throw new Error(`Apollo Server expects exactly 3 argument, got ${arguments.length}`);
    }
    const serviceUtilsService = typedi_1.default.get(server_service_1.ServerUtilService);
    server.route({
        method: ['GET', 'POST'],
        path: options.path || '/graphql',
        config: options.route || {},
        handler: (request, reply) => __awaiter(this, void 0, void 0, function* () {
            console.log('111');
            if (request.headers.authorization) {
                try {
                    options.graphqlOptions.context = yield serviceUtilsService.validateToken(request.headers.authorization);
                }
                catch (e) {
                    return reply(Boom.unauthorized());
                }
            }
            else {
                options.graphqlOptions.context = null;
            }
            return runHttpQueryWrapper(options.graphqlOptions, request, reply);
        }),
    });
    return next();
};
exports.graphqlHapi = graphqlHapi;
graphqlHapi.attributes = {
    name: 'graphql',
    version: '0.0.1',
};
const graphiqlHapi = function (server, options, next) {
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
exports.graphiqlHapi = graphiqlHapi;
graphiqlHapi.attributes = {
    name: 'graphiql',
    version: '0.0.1',
};
