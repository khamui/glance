import { inject, Factory } from 'aurelia-framework';
import { ResourceItem } from './resource-item';

@inject(Factory.of(ResourceItem))
export class ResourceList {
  constructor() {
    this.items = [];
    console.log('new resource list constructed.');
  }

  register(resource) {
    if (this.items && this._containedInList(resource)) return;
    this.items.push(resource);
  }

  _containedInList(resource) {
    return this.items.find((item) => {
      if (item.resType === resource.resType) return true;
      return false;
    });
  }
}
