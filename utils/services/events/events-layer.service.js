"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
const Observable_1 = require("rxjs/Observable");
const events_layer_1 = require("./events-layer");
const index_1 = require("../../container/index");
const FRIENDLY_ERROR_MESSAGES = {
    TRY_TO_UNSUBSCRIBE: 'Someone try to unsubscribe from collection directly... agghhh.. read docs! Blame: '
};
let CacheService = CacheService_1 = class CacheService {
    constructor() {
        this._cachedLayers = new BehaviorSubject_1.BehaviorSubject([]);
        this.map = new Map();
        this.config = {};
    }
    static createCacheInstance(cacheLayer) {
        return new events_layer_1.CacheLayer(cacheLayer);
    }
    getLayer(name) {
        const exists = this.map.has(name);
        if (!exists) {
            return this.createLayer({ name: name });
        }
        return this.map.get(name);
    }
    createLayer(layer) {
        const exists = this.map.has(layer.name);
        if (exists) {
            return this.map.get(layer.name);
        }
        layer.items = layer.items || [];
        layer.config = layer.config || this.config;
        const cacheLayer = CacheService_1.createCacheInstance(layer);
        this.map.set(cacheLayer.name, cacheLayer);
        this._cachedLayers.next([...this._cachedLayers.getValue(), cacheLayer]);
        this.LayerHook(cacheLayer);
        return cacheLayer;
    }
    LayerHook(layerInstance) {
        this.protectLayerFromInvaders(layerInstance);
        if (layerInstance.config.cacheFlushInterval || this.config.cacheFlushInterval) {
            this.OnExpire(layerInstance);
        }
    }
    protectLayerFromInvaders(cacheLayer) {
        cacheLayer.items.constructor.prototype.unsubsribeFromLayer = cacheLayer.items.constructor.prototype.unsubscribe;
        cacheLayer.items.constructor.prototype.unsubscribe = () => {
            console.error(FRIENDLY_ERROR_MESSAGES.TRY_TO_UNSUBSCRIBE + cacheLayer.name);
        };
    }
    OnExpire(layerInstance) {
        Observable_1.Observable
            .create(observer => observer.next())
            .timeoutWith(layerInstance.config.cacheFlushInterval || this.config.cacheFlushInterval, Observable_1.Observable.of(1))
            .skip(1)
            .subscribe(observer => this.removeLayer(layerInstance));
    }
    removeLayer(layerInstance) {
        this.map.delete(layerInstance.name);
        this._cachedLayers.next([...this._cachedLayers.getValue().filter(layer => layer.name !== layerInstance.name)]);
    }
    transferItems(name, newCacheLayers) {
        const oldLayer = this.getLayer(name);
        const newLayers = [];
        newCacheLayers.forEach(layerName => {
            const newLayer = this.createLayer(layerName);
            oldLayer.items.getValue().forEach(item => newLayer.putItem(item));
            newLayers.push(newLayer);
        });
        return newLayers;
    }
    flushCache() {
        let oldLayersNames;
        return this._cachedLayers.take(1)
            .map(layers => {
            oldLayersNames = layers.map(l => l.name);
            layers.forEach(layer => this.removeLayer(layer));
            oldLayersNames.forEach((l) => this.createLayer({ name: l }));
            return true;
        });
    }
};
CacheService = CacheService_1 = __decorate([
    index_1.Service()
], CacheService);
exports.CacheService = CacheService;
var CacheService_1;