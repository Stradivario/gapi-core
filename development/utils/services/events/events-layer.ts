import { CacheLayerInterface, CacheServiceConfigInterface } from './events-layer.interfaces';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

export class CacheLayer<T> {

  public items: BehaviorSubject<Array<T>> = new BehaviorSubject([]);
  public name: string;
  public config: CacheServiceConfigInterface;
  private map: Map<any, any> = new Map();

  public get(name): T {
    return this.map.get(name);
  }

  constructor(layer: CacheLayerInterface) {
    this.name = layer.name;
    this.config = layer.config;
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
    this.map.delete(key);
    this.items.next(newLayerItems);
  }

  public getItemObservable(key: string): Observable<T> {
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