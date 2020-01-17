import { inject, Factory } from 'aurelia-dependency-injection';
import { Api } from '../backend/api';
import { ResourceItem } from '../model/resource-item';
import { ResourceList } from '../model/resource-list';
import moment from 'moment';
import { CONFIG } from './sheet-config';

@inject(Factory.of(Api), Factory.of(ResourceList), Factory.of(ResourceItem))
export class SheetService {
  constructor(ApiClass, ResourceListBuilder) {
    this.api = new ApiClass;
    this.resourceList = new ResourceListBuilder;
    this.CONFIG = CONFIG;

    this.mom = moment;
    console.log('sheet-service constructed.');
  }

  readCategories(type, glaId) {
    const catIdentifier = type + '/' + glaId;
    return this.api.read(catIdentifier)
      .then((result) => {
        return result;
      })
      .catch((error) => console.log('failed'));
  }

  readValues(type, catId) {
    const valIdentifier = type + '/values/' + catId;
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

  updateCategories(data) {
    return this.api.create(data['type'] + '/categories', data)
      .then((result) => {
        console.log('categories updated.');
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
      'order': cat['order'],
      'cat_id': cat['cat_id'],
      'name': cat.name,
      'tax': cat.tax
    };
  }

  async buildResource(type, glaId) {
    const hot = [];
    try {
      const categories = await this.readCategories(type, glaId);
      // console.log(categories);
      for (let category of categories) {
        const values = await this.readValues(type, category['cat_id']);
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
    let resource = new ResourceItem();
    // register function!
    resource.resType = type;
    resource.glaId = 4001;
    resource.sheetData = CONFIG;
    resource.sheetData.data = await this.buildResource(type, resource.glaId);
    this.resourceList.register(resource);
    return resource;
  }

  configTimePeriod() {
    const timePeriod = [];
    const months = ['', ''];
    const weeks = ['Title', 'Tax'];
    for (let month of this.mom.months()) {
      // console.log(month);
      months.push({label: month, colspan: 4});
      for (let i = 1; i < 5; i++) {
        weeks.push(`${month.substring(0, 3)} // Week ${i}`);
      }
    }
    timePeriod.push(months);
    timePeriod.push(weeks);
    return timePeriod;
  }
}
