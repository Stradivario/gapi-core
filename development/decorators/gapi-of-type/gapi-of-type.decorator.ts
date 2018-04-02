import { Container } from '../../utils/container/index';
import { CacheService } from '../../utils/services/events/ngx-events-layer.service';

export function OfType<T>(type: T) {
  return (target, propertyKey, descriptor) => {
    Container.get(CacheService)
      .createLayer<Array<any>>({ name: 'gapi_events' })
      .getItemObservable(<any>type)
      .subscribe(item => descriptor.value.call(...item.data));
  };
}
