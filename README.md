# @gapi

![Build Status](http://gitlab.youvolio.com/open-source/gapi/badges/branch/build.svg)

#### @StrongTyped @EasyAPI Created on Angular@5.0.0
#### @Cache layer with capability to write in LocalStorage

##### More detailed documentation you can find [here](https://stradivario.github.io/gapi/)

##### For questions/issues you can write ticket [here](http://gitlab.youvolio.com/open-source/gapi/issues)

##### Animation explanation:
![Alt Text](https://github.com/Stradivario/gapi/raw/master/docs/animation/index.gif)

## Installation and basic examples:
##### To install this library, run:

```bash
$ npm install gapi --save
```

## Consuming @gapi

#### Import CacheModule.forRoot() in your Angular `AppModule`:

```typescript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';

// Import @gapi library
import {CacheModule} from 'gapi';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // Import CacheModule optional parameters provided at the bottom of readme
    CacheModule.forRoot(),
    LibraryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

#### Once you import the library you need to inject CacheService inside your component, provider etc. and create cache Layer

##### `***NOTE Every cache created by cacheService is treated like a LAYER , so you need to specify layer name like example above`

```typescript
import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {CacheService, CacheLayer, CacheLayerItem} from 'gapi';

export interface Item {
  name: string;
}

export const EXAMPLE_CACHE_LAYER_NAME = 'example-layer';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit {

  exampleLayer: CacheLayer<CacheLayerItem<Item>>;
  exampleLayerItems: BehaviorSubject<CacheLayerItem<Item>[]>;
  subscription: Subscription;

  constructor(
    private cacheService: CacheService
  ) {}

  ngOnInit() {
    // Here we define our cache layer name, this method returns instance of class CacheLayer<CacheLayerItem<Item>>
    this.exampleLayer = this.cacheService.createLayer<Item>({
      name: EXAMPLE_CACHE_LAYER_NAME
    });

    // inside this.exampleCache you can find object named items returns BehaviorSubject<CacheLayerItem<Item>[]> object type
    this.exampleLayerItems = this.exampleLayer.items

    // Correct implementation of subscribing to collection of layer items and work inside component with it:
    // Recommended way to work with cacheLayer collection items is to create another observable asObservable and use items this way
    // Anyway it is better to let angular view model to handle subscription itself ( cartItems | async)
    // To work with collection this way you can use collection Instance returned from getLayer above (this.cacheLayer) (Examples Below)

    this.subscription = this.exampleLayerItems.asObservable()
      .subscribe(items => {

      });

    // If you try to unsubscribe from this.cacheItems when you leave component state ngOnDestroy(),
    // you will loose observable stream from the cache layer and the result will be error ***Check NOTES below***
    // Another method is to take values single time only per component initialization

    this.exampleLayerItems
      .take(1)
      .subscribe(itemCollection => itemCollection
        .forEach(item => {
          // Because we define interface for this items we have the following autosuggestion from the IDE
          const itemName = item.data.name;
        })
      );

    // Put item to current cache defined above
    // When there is a new item added to collection cache automatically emits new results to this.exampleLayerItems BehaviorSubject object type

    this.createItem({
      key:'example-key',
      data:{
        name:'pesho'
      }
    });

    // Get cached data from added item above will return {exampleData:'example-string'}
    const exampleData = this.getItem('example-key');

    // Remove item from current layer
    this.removeItem('example-key');

  }

  createItem(data: any) {
    this.exampleLayer.putItem(data);
  }

  getItem(key: string) {
    this.exampleLayer.getItem(key);
  }

  removeItem(key: string) {
    this.exampleLayer.removeItem(key);
  }

}

```

##### Get our new created cache from component which is somewhere inside our application
```typescript

import {Injectable} from '@angular/core';
import {CacheService, CacheLayer} from 'gapi';
import {EXAMPLE_CACHE_LAYER_NAME, Item} from './example.provider';

@Injectable()
export class YourClass {
    cacheLayer: CacheLayer<CacheLayerItem<Item>>;
    constructor(private:cacheService:CacheService){
      this.cacheLayer = cacheService.getLayer<Item>(EXAMPLE_CACHE_LAYER_NAME);
      // Now work with this collection the same as example above;
    }
}
```


##### Remove cache layer we created from other service or component.

```typescript

import {Injectable} from '@angular/core';
import {CacheService} from 'gapi';
import {EXAMPLE_CACHE_LAYER_NzAME} from './example.provider';

@Injectable()
export class YourClass {
    constructor(private:cacheService:CacheService) {
      cacheService.removeLayer(EXAMPLE_CACHE_LAYER_NAME);
    }
}
```

### COMPLETE  ADD TO CARD EXAMPLE:

##### Create CartProvider which will help us to reduce logic inside component
##### IMPORTANT When you use provider and define custom settings you need to use provider cache layer instance!
##### If you use CacheService.getLayer() with the same cache name it may lead to not initialize current defined config when we createLayer with specific config not global
##### Without provider you can use it as usual with getLayer() and createLayer() it will be safe but it will take Global Configuration instead.

```typescript

import {Injectable} from "@angular/core";
import {CacheService, CacheLayer, CacheLayerItem, CacheServiceConfigInterface} from "gapi";
import {Product} from "../core/config/queries/product/product.interface";

export const CART_CACHE_LAYER_NAME = 'cart';

export interface Product {
  id: string;
  name: string;
  title: string;
  price: string;
  quantity: number;
  completed: boolean;
  categoryId: number;
}

@Injectable()
export class CartProvider {

  cacheLayer: CacheLayer<CacheLayerItem<Product>>;
  items: BehaviorSubject<CacheLayerItem<Product>[]>;

  constructor(private cacheService: CacheService) {
    this.cacheLayer = this.cacheService.createLayer<Product>(<CacheLayerInterface>{
      name: CART_CACHE_LAYER_NAME,
      config: <CacheServiceConfigInterface>{
        localStorage: true,
        maxAge: 10000,
        cacheFlushInterval: 10000,
        deleteOnExpire: 'aggressive'
      }
    });
    this.items = this.cacheLayer.items;
  }

  putToCart(product: Product) {
    this.cacheLayer.putItem({
      key:product.id,
      data: product
    });
  }

  removeFromCart(product: Product) {
    this.cacheLayer.removeItem(product.id);
  }

}

```

##### Now lets define our component and inject CartProvider
```typescript

import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartItems: BehaviorSubject<CacheLayerItem<Product>[]>;
  cacheLayer: CacheLayer<CacheLayerItem<Product>>;

  constructor(private cartProvider: CartProvider) {}

  ngOnInit() {}

  removeItem(product: Product) {
    this.cartProvider.removeFromCard(product)
  }

  updateItem(product: Product) {
    this.cartProvider.putToCart(product);
  }

}
```

##### How to consume items inside html

```html
<div *ngFor="let product of (cartProvider.items | async)">
	{{item.key}} // is cache identity
    {{item.data.id}} // Cached data from current item from card layer Observable
    <-- removeItemKey in my case item.id is unique so i should remove item id -->
    <button (click)="removeItem(product)">Remove item</button>
</div>
```


<br>

### How to define GlobalConfiguration

```typescript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';

// Import gapi
import {CacheModule, CacheConfigInterface} from 'gapi';

// Define global configuration
// You can set localStorage to true it will cache every layers like a localStorage item
// By default localStorage is set to false
export const CACHE_DI_CONFIG = <CacheConfigInterface>{
    localStorage: true,
    maxAge: 15 * 60 * 1000, // Items added to this cache expire after 15 minutes
    cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour
    deleteOnExpire: 'aggressive' // Items will be deleted from this cache when they expire
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // Import CacheModule with CACHE_DI_CONFIG;
    CacheModule.forRoot(CACHE_DI_CONFIG)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

<br>

### Service methods

##### Create cache layer

```typescript
CacheService.createLayer<any>({name: 'layer-name', settings?: CacheLayerInterface})
```
`Optional you can define custom settings for every layer that you create just insert CacheLayerInterface from gapi like example for global config above`

Returns: `Instance of CacheLayer class`
Optional: `settings interface CacheLayerInterface`

##### Get layer from cache

```typescript
CacheService.getLayer<any>('layer-name');
```
Returns: `Instance of CacheLayer class`

##### Remove layer from cache

```typescript
CacheService.removeLayer('layer-name');
```
Returns: `void`

```typescript
CacheLayer.createCacheParams({key: 'endpoint-key', params: {exampleParam: 'test'}});
```

##### Create Cache with parameters static public method of CacheLayer Class
###### Usage: when you have api endpoints with custom parameters and you need to cache result returned from response
Complete cache for endpoint with 8 rows more code without it :)

```typescript
const endpointCache = this.cacheService.getLayer('endpoint-cache');

function getUserById(id: number) {
  return Observable.create(observer => {
    const ENDPOINT = `/user/${id}`;
    const PARAMS = {
      client_credentials: true,
    };
    const cacheAddress = CacheLayer.createCacheParams({ key: ENDPOINT, params: PARAMS });
    if (endpointCache.getItem(cacheAddress)) {
      return observer.next(endpointCache.getItem(cacheAddress));
    }
    // endpointCache.putItem method like getItem returns instance of cached item so we can safely return to the observer above
	this.http.post(ENDPOINT, PARAMS)
	.map(user =>
		observer.next(endpointCache.putItem({ key: cacheAddress, data: user.json() }))
	)
	.subscribe()
  });
}
```

<br>

### Cache Layer Instance methods

```typescript
const cache = CacheService.getLayer<any>('layer-name');
```

##### Put item to cache

```typescript
cache.putItem({key:'example-key', data:{exampleData:''}});
```

##### Get item from cache

```typescript
cache.getItem('example-key');
```

##### Get item from cache as observable it will emit every value changed for that specific key

```typescript
cache.getItemObservable('example-key');
```

##### Remove item from cache

```typescript
cache.removeItem('example-key');
```

<br>

# NOTES:

<br>

# FIRST

#### To avoid memory leaks it is really important to subscribe ONLY ONCE when you initialize items from cache,
#### or use examples bellow to iterate over items from collection and correct unsubscribe from them.

#### The example below is correct implementation how it will work without any problems!
#### Inside html when you use ( cartItems | async ) async pipe the view handles this automatically.`

```typescript

  ngOnInit() {
    this.cacheLayer = this.cache.getLayer<Product>(CART_CACHE_LAYER_NAME);
    this.cartItems = this.cacheLayer.items;


	// CORRECT EXAMPLE(BestWay) you need to unsubscribe when you leave component!

	this.subscription = this.cartItems.asObservable()
	  .subscribe(items => {
		// Do something
	  });

	// ANOTHER CORRECT EXAMPLE (this method will subscribe only once and you cannot get new results if there are any new)
	this.cartItems.take(1).subscribe(collection => {
	  // Do something with collection here and initialize only once inside component
	});

    // WRONG EXAMPLE
    this.cartItems.subscribe(collection => {
    // don't do anything with collection this way or you will lead subscribing many times to the same collection
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
```
<br>

# SECOND

#### Don't call unsubscribe directly on collection because you will loose reactive binding to collection and you will lead to following error
#### If you subscribe once, like example above you will have no problems at all!
`"object unsubscribed" name: "ObjectUnsubscribedError" ngDebugContext:DebugContext_ {view: {…}, nodeIndex: 27, nodeDef: {…}, elDef: {…}, elView: {…}}ngErrorLogger:ƒ ()stack:"ObjectUnsubscribedError: object unsubscribed`

## License

MIT © [Kristian Tachev(Stradivario)](mailto:kristiqn.tachev@gmail.com)

````