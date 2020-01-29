import { inject, Factory } from 'aurelia-dependency-injection';
import { Api } from '../backend/api';
import moment from 'moment';

// Chooses on arguments, which api methods to be used!

@inject(Factory.of(Api))
export class SheetService {
  constructor(ApiClass) {
    this.api = new ApiClass;
    this.mom = moment;
    console.log('sheet-service constructed.');
  }

  // NEW API METHODS
  load(glaId) {
    const glance = 'sheets/' + glaId;
    return this.api.read(glance)
      .then((result) => {
        return result;
      })
      .catch((error) => console.log('failed'));
  }

  loadValues(dto) {
    const values = 'sheets/' + dto['gla_id'] + '/' + dto['type'] + '/' + dto['sheet_id'];
    return this.api.read(values)
      .then((result) => {
        return result;
      })
      .catch((error) => console.log('failed'));
  }

  save(dto) {
    this.api.update('sheets/' + dto['glaId'] + '/' + dto['type'], dto)
      .then((result) => {
        // LOGGER return
      });
  }

  // OLD

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
