import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { CacheLayer } from './ngx-cache-layer.layer';
import { CacheLayerInterface, CacheServiceConfigInterface, CacheLayerItem } from './ngx-cache-layer.interfaces';

const INTERNAL_PROCEDURE_CACHE_NAME = 'cache_layers';

const FRIENDLY_ERROR_MESSAGES = {
  TRY_TO_UNSUBSCRIBE: 'Someone try to unsubscribe from collection directly... agghhh.. read docs! Blame: ',
  LOCAL_STORAGE_DISABLED: 'LocalStorage is disabled switching to regular in-memory storage.Please relate issue if you think it is enabled and there is a problem with the library itself.'
};


export class CacheService {

  public _cachedLayers: BehaviorSubject<CacheLayer<CacheLayerItem<any>>[]> = new BehaviorSubject([]);
  private map: Map<any, any> = new Map();
  config: any = {};

  public static createCacheInstance<T>(cacheLayer): CacheLayer<CacheLayerItem<T>> {
    return new CacheLayer<CacheLayerItem<T>>(cacheLayer);
  }

  public static isLocalStorageUsable(): boolean {
    const error = [];
    try {
      localStorage.setItem('test-key', JSON.stringify({ key: 'test-object' }));
      localStorage.removeItem('test-key');
    } catch (e) {
      error.push(e);
      console.log(FRIENDLY_ERROR_MESSAGES.LOCAL_STORAGE_DISABLED);
    }
    return error.length ? false : true;
  }

  public getLayer<T>(name: string): CacheLayer<CacheLayerItem<T>> {
    const exists = this.map.has(name);
    if (!exists) {
      return this.createLayer<T>({ name: name });
    }
    return this.map.get(name);
  }

  public createLayer<T>(layer: CacheLayerInterface): CacheLayer<CacheLayerItem<T>> {
    const exists = this.map.has(layer.name);
    if (exists) {
      return this.map.get(layer.name);
    }
    layer.items = layer.items || [];
    layer.config = layer.config || this.config;
    const cacheLayer = CacheService.createCacheInstance<T>(layer);
    if (layer.config.localStorage && CacheService.isLocalStorageUsable()) {
      localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify([...CacheService.getLayersFromLS().filter(l => l !== cacheLayer.name), cacheLayer.name]));
      localStorage.setItem(cacheLayer.name, JSON.stringify(layer));
    }
    this.map.set(cacheLayer.name, cacheLayer);
    this._cachedLayers.next([...this._cachedLayers.getValue(), cacheLayer]);
    this.LayerHook<T>(cacheLayer);
    return cacheLayer;
  }

  private LayerHook<T>(layerInstance: CacheLayer<CacheLayerItem<T>>): void {
    this.protectLayerFromInvaders<T>(layerInstance);
    if (layerInstance.config.cacheFlushInterval || this.config.cacheFlushInterval) {
      this.OnExpire(layerInstance);
    }
  }

  private protectLayerFromInvaders<T>(cacheLayer: CacheLayer<CacheLayerItem<T>>): void {
    cacheLayer.items.constructor.prototype.unsubsribeFromLayer = cacheLayer.items.constructor.prototype.unsubscribe;
    cacheLayer.items.constructor.prototype.unsubscribe = () => {
      console.error(FRIENDLY_ERROR_MESSAGES.TRY_TO_UNSUBSCRIBE + cacheLayer.name);
    };
  }

  private OnExpire<T>(layerInstance: CacheLayer<CacheLayerItem<T>>): void {
    Observable
      .create(observer => observer.next())
      .timeoutWith(layerInstance.config.cacheFlushInterval || this.config.cacheFlushInterval, Observable.of(1))
      .skip(1)
      .subscribe(observer => this.removeLayer(layerInstance));
  }

  public removeLayer<T>(layerInstance: CacheLayer<CacheLayerItem<T>>): void {
    this.map.delete(layerInstance.name);
    if (this.config.localStorage) {
      localStorage.removeItem(layerInstance.name);
      localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify(CacheService.getLayersFromLS().filter(layer => layer !== layerInstance.name)));
    }
    this._cachedLayers.next([...this._cachedLayers.getValue().filter(layer => layer.name !== layerInstance.name)]);
  }

  public transferItems(name: string, newCacheLayers: CacheLayerInterface[]): CacheLayer<CacheLayerItem<any>>[] {
    const oldLayer = this.getLayer(name);
    const newLayers = [];
    newCacheLayers.forEach(layerName => {
      const newLayer = this.createLayer(layerName);
      oldLayer.items.getValue().forEach(item => newLayer.putItem(item));
      newLayers.push(newLayer);
    });
    return newLayers;
  }

  public static getLayersFromLS(): Array<string> {
    return JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME));
  }

  public flushCache(force?: boolean): Observable<boolean> {
    let oldLayersNames: string[];
    return this._cachedLayers.take(1)
      .map(layers => {
        oldLayersNames = layers.map(l => l.name);
        layers.forEach(layer => this.removeLayer(layer));
        if (force) {
          localStorage.removeItem(INTERNAL_PROCEDURE_CACHE_NAME);
        } else {
          oldLayersNames.forEach((l) => this.createLayer({ name: l }));
        }
        return true;
      });
  }

}