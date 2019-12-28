import { inject, Factory } from 'aurelia-dependency-injection';
import { Api } from '../backend/api';

@inject(Factory.of(Api))
export class GlanceService {
  constructor(ApiClass) {
    this.api = new ApiClass;
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
        // LOGGER return
      });
  }

  createCategory(data) {
    return this.api.create(data['type'] + '/new', data)
      .then((result) => {
        return result;
      });
  }

  deleteCategory(data, resType) {
    this.api.delete(resType + '/categories/' + data['cat_id'], data)
      .then((result) => {
        console.log(result);
      });
  }

  createCatObject(cat) {
    return {
      'cat_id': cat['cat_id'],
      'name': cat.name,
      'tax': cat.tax
    };
  }

  async buildResource() {
    const hot = [];
    try {
      const categories = await this.readCategories();
      for (let category of categories) {
        const values = await this.readValues(category['cat_id']);
        const catObject = this.createCatObject(category);
        values.forEach((value, index) => catObject['col' + index] = value.value);
        hot.push(catObject);
      }
      return hot;
    }
    catch {
      throw new Error('Resource Builder failed.');
    }
  }

  async readResource(type) {
    this.resource.resType = type;
    this.resource.glaId = 4001;
    this.resource.data = await this.buildResource();
    return this.resource;
  }
}
