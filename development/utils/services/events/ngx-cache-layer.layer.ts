import { CacheLayerInterface, CacheServiceConfigInterface } from './ngx-cache-layer.interfaces';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

const FRIENDLY_ERROR_MESSAGES = {
  MISSING_OBSERVABLE_ITEM: `is missing from the layer misspelled name ? as soon as you provide correct name value will be emitted!`
};

export class CacheLayer<T> {

  public items: BehaviorSubject<Array<T>> = new BehaviorSubject([]);
  public name: string;
  public config: CacheServiceConfigInterface;
  private map: Map<any, any> = new Map();
  static createCacheParams(config) {
    if (config.params.constructor === Object) {
      return; // Todo
    } else if (config.constructor === String) {
      return; // Todo
    } else if (config.params.constructor === Number) {
      return; // Todo
    } else if (config.params.constructor === Array) {
      return; // Todo
    }
  }

  public get(name): T {
    return this.map.get(name);
  }

  constructor(layer: CacheLayerInterface) {
    this.name = layer.name;
    this.config = layer.config;
    if (this.config.localStorage) {
      layer.items.forEach(item => this.map.set(item['key'], item));
      if (layer.items.constructor === BehaviorSubject) {
        layer.items = layer.items.getValue() || [];
      }
      this.items.next([...this.items.getValue(), ...layer.items]);
    }
    this.initHook(layer);
  }

  private initHook(layer) {
    if (this.config.maxAge) {
      this.onExpireAll(layer);
    }
  }

  private onExpireAll(layer) {
    layer.items.forEach(item => this.onExpire(item['key']));
  }

  private putItemHook(layerItem): void {
    if (this.config.maxAge) {
      this.onExpire(layerItem['key']);
    }
  }

  public getItem(key: string): T {
    if (this.map.has(key)) {
      return this.get(key);
    } else {
      return null;
    }
  }

  public putItem(layerItem: T): T {
    this.map.set(layerItem['key'], layerItem);
    const item = this.get(layerItem['key']);
    const filteredItems = this.items.getValue().filter(item => item['key'] !== layerItem['key']);
    if (this.config.localStorage) {
      localStorage.setItem(this.name, JSON.stringify(<CacheLayerInterface>{
        config: this.config,
        name: this.name,
        items: [...filteredItems, item]
      }));
    }

    this.items.next([...filteredItems, item]);
    this.putItemHook(layerItem);
    return layerItem;
  }

  private onExpire(key: string): void {
    Observable
      .create(observer => observer.next())
      .timeoutWith(this.config.maxAge, Observable.of(1))
      .skip(1)
      .subscribe(observer => this.removeItem(key));
  }

  public removeItem(key: string): void {
    const newLayerItems = this.items.getValue().filter(item => item['key'] !== key);
    if (this.config.localStorage) {
      const newLayer = <CacheLayerInterface>{
        config: this.config,
        name: this.name,
        items: newLayerItems
      };
      localStorage.setItem(this.name, JSON.stringify(newLayer));
    }
    this.map.delete(key);
    this.items.next(newLayerItems);
  }

  public getItemObservable(key: string): Observable<T> {
    this.map.has(key) ? null : console.error(`Key: ${key} ${FRIENDLY_ERROR_MESSAGES.MISSING_OBSERVABLE_ITEM}`);
    return this.items.asObservable().filter(() => this.map.has(key)).map(res => res[0]);
  }

  public flushCache(): Observable<boolean> {
    return this.items.asObservable()
      .map(items => {
        items.forEach(i => this.removeItem(i['key']));
        return true;
      });
  }

}

// console.log(Array.from(this.keys()))