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
const auth_service_1 = require("../auth/auth.service");
const container_1 = require("../../container");
const graphqlHapi = {
    name: 'graphql',
    register: (server, options) => {
        if (!options || !options.graphqlOptions) {
            throw new Error('Apollo Server requires options.');
        }
        server.route({
            method: ['GET', 'POST'],
            path: options.path || '/graphql',
            vhost: options.vhost || undefined,
            config: options.route || {},
            handler: (request, h) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (request.headers.authorization && request.headers.authorization !== 'undefined') {
                        try {
                            const serviceUtilsService = container_1.Container.get(auth_service_1.AuthService);
                            options.graphqlOptions.context = yield serviceUtilsService.modifyFunctions.validateToken(request.headers.authorization);
                        }
                        catch (e) {
                            return Boom.unauthorized();
                        }
                    }
                    else {
                        options.graphqlOptions.context = null;
                    }
                    const gqlResponse = yield apollo_server_core_1.runHttpQuery([request], {
                        method: request.method.toUpperCase(),
                        options: options.graphqlOptions,
                        query: request.method === 'post' ? request.payload : request.query,
                    });
                    const response = h.response(gqlResponse);
                    response.type('application/json');
                    return response;
                }
                catch (error) {
                    if ('HttpQueryError' !== error.name) {
                        throw Boom.boomify(error);
                    }
                    if (true === error.isGraphQLError) {
                        const response = h.response(error.message);
                        response.code(error.statusCode);
                        response.type('application/json');
                        return response;
                    }
                    const err = new Boom(error.message, { statusCode: error.statusCode });
                    if (error.headers) {
                        Object.keys(error.headers).forEach(header => {
                            err.output.headers[header] = error.headers[header];
                        });
                    }
                    // Boom hides the error when status code is 500
                    err.output.payload.message = error.message;
                    throw err;
                }
            }),
        });
    },
};
exports.graphqlHapi = graphqlHapi;
const graphiqlHapi = {
    name: 'graphiql',
    register: (server, options) => {
        if (!options || !options.graphiqlOptions) {
            throw new Error('Apollo Server GraphiQL requires options.');
        }
        server.route({
            method: 'GET',
            path: options.path || '/graphiql',
            config: options.route || {},
            handler: (request, h) => __awaiter(this, void 0, void 0, function* () {
                const graphiqlString = yield GraphiQL.resolveGraphiQLString(request.query, options.graphiqlOptions, request);
                const response = h.response(graphiqlString);
                response.type('text/html');
                return response;
            }),
        });
    },
};
exports.graphiqlHapi = graphiqlHapi;
