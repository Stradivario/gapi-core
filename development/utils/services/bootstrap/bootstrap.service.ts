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
import { CacheService } from '../events/ngx-events-layer.service';
import { Subscription } from 'rxjs';
import { FileService } from '../../services/file';


async function getAllFields() {
  const events = Container.get(CacheService);
  const controllerContainerService = Container.get(ControllerContainerService);
  const moduleContainerService = Container.get(ModuleContainerService);
  return new Promise((resolve, reject) => {
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
          if (desc.method_type !== 'event') {
            Fields[desc.method_type][desc.method_name] = desc;
            methodBasedEffects.push(desc.method_name);
          }

          const c = controllerHooks.getHook(controller);
          const originalResolve = desc.resolve.bind(c);
          desc.resolve = function resolve(...args: any[]) {
            events
              .createLayer<Array<any>>({ name: 'gapi_events' })
              .putItem({ key: desc.method_name, data: args });
            return originalResolve.apply(c, args);
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
    resolve(schema);
  });
}

function onExitProcess(server: GapiServerModule) {
  process.on(<any>'cleanup', () => {
    console.log('App stopped');
    server.stop();
  });
  process.on('exit', function() {
    process.emit(<any>'cleanup');
  });
  process.on('SIGINT', function() {
    process.exit(2);
  });
  process.on('uncaughtException', function(e) {
    console.log(e.stack);
    process.exit(99);
  });
}

export const Bootstrap = App => {
  console.log(`Bootstrapping application...`);
  Object.defineProperty(App, 'name', { value: 'AppModule', writable: true });
  Container.get(App);
  console.log('Finished!\nStarting application...');
  getAllFields().then((schema: GraphQLSchema) => {
    const configService = Container.get(ConfigService);
    configService.APP_CONFIG.schema = schema;
    const server = Container.get(
      GapiServerModule.forRoot(configService.APP_CONFIG)
    );
    server
      .start()
      .then(data => {
        onExitProcess(server);
        console.log('Application started!');
      })
      .catch(e => console.log(e));
  });

  return App;
};
