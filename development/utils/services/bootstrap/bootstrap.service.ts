import Container, { Service } from '../../../utils/container/index';
import { ControllerContainerService } from '../../services/controller-service/controller.service';
import { ServerUtilService } from '../../services/server/server.service';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { ConfigService } from '../../services/config/config.service';
import { SchemaService } from '../../services/schema/schema.service';
import { GapiServerModule } from '../../../modules/server/server.module';
import { HookService } from '../../services/hook/hook.service';
import { controllerHooks } from '../controller-service/controller-hooks';
import { ModuleContainerService } from '../module/module.service';
import { CacheService } from '../events/events-layer.service';
import { Subscription } from 'rxjs';
import { FileService } from '../../services/file';
import { HapiPluginService } from '../plugin/plugin.service';
import { Server } from 'hapi';
import { mergeSchemas } from 'graphql-tools';

async function getAllFields() {
  const events = Container.get(CacheService);
  const controllerContainerService = Container.get(ControllerContainerService);
  const moduleContainerService = Container.get(ModuleContainerService);
  // Array.from(moduleContainerService.modules.keys()).forEach(module => {
  //     const currentModule = moduleContainerService.getModule(module);
  //     currentModule.resolveDependencyHandlers();
  // });
  const methodBasedEffects = [];
  const Fields = { query: {}, mutation: {}, subscription: {} };
  Array.from(controllerContainerService.controllers.keys()).forEach(
    controller => {
      const currentCtrl = controllerContainerService.getController(
        controller
      );
      currentCtrl.getAllDescriptors().forEach(descriptor => {
        const desc = currentCtrl.getDescriptor(descriptor).value();
        Fields[desc.method_type][desc.method_name] = desc;
        const effectName = desc.effect ? desc.effect : desc.method_name;
        methodBasedEffects.push(effectName);
        const c = controllerHooks.getHook(controller);
        const originalResolve = desc.resolve.bind(c);
        desc.resolve = async function resolve(...args: any[]) {
          const methodEffect = events.map.has(desc.method_name);
          const customEffect = events.map.has(desc.effect);
          const result = await originalResolve.apply(c, args);
          if (methodEffect || customEffect) {
            let tempArgs = [result, ...args];
            tempArgs = tempArgs.filter(i => i && i !== 'undefined');
            events
              .getLayer<Array<any>>(effectName)
              .putItem({ key: effectName, data: tempArgs });
          }
          return result;
        };
      });
    }
  );
  function generateType(query, name, description) {
    if (!Object.keys(query).length) {
      return;
    }
    return new GraphQLObjectType({
      name: name,
      description: description,
      fields: query
    });
  }
  const query = generateType(
    Fields.query,
    'Query',
    'Query type for all get requests which will not change persistent data'
  );
  const mutation = generateType(
    Fields.mutation,
    'Mutation',
    'Mutation type for all requests which will change persistent data'
  );
  const subscription = generateType(
    Fields.subscription,
    'Subscription',
    'Subscription type for all rabbitmq subscriptions via pub sub'
  );
  HookService.AttachHooks([query, mutation, subscription]);
  const schema = Container.get(SchemaService).generateSchema(
    query,
    mutation,
    subscription
  );
  try {
    Container.get(FileService).writeEffectTypes(methodBasedEffects);
  } catch (e) {
    console.error('Effects are not saved to directory');
  }
  return await Promise.resolve(schema);
}

function onExitProcess(server: GapiServerModule) {
  process.on(<any>'cleanup', () => {
    console.log('App stopped');
    server.stop();
  });
  process.on('exit', function () {
    process.emit(<any>'cleanup');
  });
  process.on('SIGINT', function () {
    process.exit(2);
  });
  process.on('uncaughtException', function (e) {
    console.log(e.stack);
    process.exit(99);
  });
}

export const Bootstrap = async (App) => {
  console.log(`Bootstrapping application...`);
  Object.defineProperty(App, 'name', { value: 'AppModule', writable: true });
  Container.get(App);
  console.log('Finished!\nStarting application...');
  const schema: GraphQLSchema = await getAllFields();
  const configService = Container.get(ConfigService);
  if (configService.APP_CONFIG.schema) {
    configService.APP_CONFIG.schema = await configService.APP_CONFIG.schema;
  } else {
    configService.APP_CONFIG.schema = schema;
  }

  // TODO: not working at the moment "Schema is not configured for subscriptions" error when merging schemas
  const schemas = [configService.APP_CONFIG.schema];
  if (schema.getQueryType() || schema.getMutationType() || schema.getSubscriptionType()) {
    schemas.push(schema);
  }
  // configService.APP_CONFIG.schema['_subscriptionType'] = schema['_subscriptionType'];
  configService.APP_CONFIG.schema = await mergeSchemas({ schemas });
  const gapiServer = Container.get(GapiServerModule.forRoot(configService.APP_CONFIG));
  let server: Server;
  try {
    server = await gapiServer.start();
  } catch (e) {
    console.log(e);
  }
  onExitProcess(gapiServer);
  return Promise.resolve({server: server, schema: schema});
};
