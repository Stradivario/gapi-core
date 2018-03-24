"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const index_1 = require("../../../utils/container/index");
let SchemaService = class SchemaService {
    generateSchema(Query, Mutation, Subscription) {
        const schema = {};
        if (Query) {
            schema.query = Query;
        }
        if (Mutation) {
            schema.mutation = Mutation;
        }
        if (Subscription) {
            schema.subscription = Subscription;
        }
        return new graphql_1.GraphQLSchema(schema);
    }
};
SchemaService = __decorate([
    index_1.Service()
], SchemaService);
exports.SchemaService = SchemaService;
