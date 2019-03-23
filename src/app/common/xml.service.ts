const CACHE_LOGS = false;
import * as _ from 'underscore';

export abstract class XmlService<T> {

  protected cache = new XmlObjectsCache<T>();

  /**
   *
   * @param xmlElements example : xmlFiles.items.item
   */
  protected constructor(protected xmlElements: any[]) { }

  /**
   * @param name item's name. Example : "gunPistol"
   * @return undefined it not found
   */
  get(name: string): T {
    return this.cache.getOrPut(name, () => {
      const elements = this.xmlElements
        .filter(xmlElementI => xmlElementI.$.name === name)
        .map(xmlElement => xmlElement ? this.newElement(xmlElement) : undefined);
      if (elements.length <= 1) {
        return elements.length ? elements[0] : undefined;
      } else {
        return this.handleDuplicates(elements);
      }
    });
  }

  getAll(filter?: (element: T) => boolean): T[] {
    return this.cache.getOrPutAll(element => element.name, () => {
      const elements = this.xmlElements
        .map(xmlElement => this.newElement(xmlElement))
        .filter(element => !filter || filter(element));
      const elementsByName = _.groupBy(elements, 'name');
      return Object.keys(elementsByName)
        .map(name => {
          const duplicates = elementsByName[name];
          if (duplicates.length <= 1) {
            return duplicates.length ? duplicates[0] : undefined;
          } else {
            return this.handleDuplicates(duplicates);
          }
        });
    });
  }

  abstract newElement(xmlElement: any): T;

  /**
   * @elements contains at least two elements that share the same name
   * @return element to keep between existingElement and newElement
   */
  handleDuplicates(elements: T[]): T {
    return elements.length ? elements[0] : undefined;
  }
}

export class XmlObject {

  private firstCache = new XmlObjectsCache2<XmlObject>();
  private firstWithClassCache = new XmlObjectsCache2<XmlObject>();

  constructor(protected xmlElement: any) { }

  static interpolateStrings(minMaxValue: string, minMaxTier: string, tier: number): number {
    return XmlObject.interpolate(
      minMaxValue.split(',').map(value => +value),
      minMaxTier.split(',').map(tierString => +tierString),
      tier);
  }

  static interpolate(minMaxValue: number[], minMaxTier: number[], tier: number): number {
    const [minValue, maxValue] = minMaxValue;
    const [minTier, maxTier] = minMaxTier;

    if (tier === minTier) {
      return minValue;
    }
    if (tier === maxTier) {
      return maxValue;
    }
    return minValue + tier / (maxTier - minTier) * (maxValue - minValue);
  }

  getFirst(xmlTag: string, name: string): XmlObject {
    return this.firstCache.getOrPut(xmlTag, name, () => {
      if (!(xmlTag in this.xmlElement)) {
        return undefined;
      }
      const firstChild = this.xmlElement[xmlTag].find(child => child.$ && child.$.name === name);
      return firstChild ? new XmlObject(firstChild) : undefined;
    });
  }

  getFirstWithClass(xmlTag: string, className: string): XmlObject {
    return this.firstWithClassCache.getOrPut(xmlTag, className, () => {
      if (!(xmlTag in this.xmlElement)) {
        return undefined;
      }
      const firstChild = this.xmlElement[xmlTag].find(child => child.$ && child.$.class === className);
      return firstChild ? new XmlObject(firstChild) : undefined;
    });
  }

  get $() {
    return this.xmlElement.$;
  }

  get name() {
    return this.$.name;
  }

}

export class XmlObjectsCache<T> {
  cache = {};

  /** To keep order, unique set */
  keys = [];

  /** all items have been read ? */
  hasAll = false;

  has(key: string): boolean {
    return this.keys.includes(key);
  }

  get(key: string): T {
    return this.cache[key];
  }

  getOrPut(key: string, createItem: () => T): T {
    if (!this.has(key)) {
      if (CACHE_LOGS) {
        console.log(`CACHE : create element at key ${key}`);
      }
      this.put(key, createItem());
    }
    return this.cache[key];
  }

  put(key: string, item: T): void {
    this.cache[key] = item;
    if (!this.keys.includes(key)) {
      this.keys.push(key);
    }
  }

  getOrPutAll(getKey: (T) => string, createAllItems: () => T[]): T[] {
    if (!this.hasAll) {
      if (CACHE_LOGS) {
        console.log(`CACHE : create all elements`);
      }
      createAllItems().forEach(item => this.put(getKey(item), item));
    }
    return this.keys.map(key => this.cache[key]);
  }
}

export class XmlObjectsCache2<T> {
  cache = {};

  /**
   * Allows to call directly this.cache[key1][key2]
   */
  autoCreate(key1: string): boolean {
    if (!(key1 in this.cache)) {
      this.cache[key1] = {};
      return true;
    }
    return false;
  }

  has(key1: string, key2: string): boolean {
    this.autoCreate(key1);
    return key2 in this.cache[key1];
  }

  get(key1: string, key2: string): T {
    this.autoCreate(key1);
    return this.cache[key1][key2];
  }

  getOrPut(key1: string, key2: string, createItem: () => T): T {
    this.autoCreate(key1);
    if (!this.has(key1, key2)) {
      if (CACHE_LOGS) {
        console.log(`CACHE : create element at keys ${key1},${key2}`);
      }
      this.cache[key1][key2] = createItem();
    }
    return this.cache[key1][key2];
  }
}