/* eslint brace-style: ["error", "stroustrup"] */

import { inject, Factory } from 'aurelia-dependency-injection';
import { Api } from '../backend/api';

@inject(Factory.of(Api))
export class GlanceService {
  constructor(api) {
    this.api = new api;
    this.resource = {
      resType: null,
      glaId: null,
      data: null,
      container: null
    };
  }

  readCategories() {
    const catIdentifier = this.resource.resType + '/' + this.resource.glaId;
    return this.api.read(catIdentifier)
      .then((result) => {
        return result;
      });
  }

  readValues(catId) {
    const valIdentifier = this.resource.resType + '/values/' + catId;
    return this.api.read(valIdentifier)
      .then((result) => {
        return result;
      });
  }

  updateValues(data) {
    this.api.create(data.resType, data)
      .then((result) => {
        console.log(result);
      });
  }

  //TODO: reduce complexity
  async buildResource() {
    const hot = [];
    try {
      const categories = await this.readCategories();
      for (let category of categories) {
        const values = await this.readValues(category['cat_id']);
        const catObject = {
          'cat_id': category['cat_id'],
          'name': category.name,
          'tax': category.tax
        };
        let counter = 0;
        for (let value of values) {
          catObject['col' + counter] = value.value;
          counter++;
        }
        hot.push(catObject);
      }
    }
    catch {
      throw new Error('Resource Builder failed.');
    }
    return hot;
  }

  async readResource(type) {
    this.resource.resType = type;
    this.resource.glaId = 4001;
    this.resource.data = await this.buildResource();
    return this.resource;
  }
}
