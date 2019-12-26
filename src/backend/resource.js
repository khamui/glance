import { inject, Factory } from 'aurelia-framework';
import { Api } from './api';

@inject(Api)
export class Resource {
  constructor(api) {
    this.api = api;
    // this.items = [
    //   {exp_category: 'Expense', exp_tax: 'Taxation', col0: 'M1 Week 1', col1: 'M1 Week 2', col2: 'M1 Week 3', col3: 'M1 Week 4'},
    //   {exp_category: 'Software', exp_tax: '19', col0: 10, col1: 11, col2: 12, col3: 13},
    //   {exp_category: 'Hardware', exp_tax: '19', col0: 20, col1: 11, col2: 14, col3: 13},
    //   {exp_category: 'Bueromaterial', exp_tax: '19', col0: 20, col1: 11, col2: 14, col3: 13},
    //   {exp_category: 'Reisekosten', exp_tax: '19', col0: 20, col1: 11, col2: 14, col3: 13},
    //   {exp_category: 'Personal', exp_tax: '19', col0: 20, col1: 11, col2: 14, col3: 13},
    //   {exp_category: 'Gebaeudemiete', exp_tax: '19', col0: 20, col1: 11, col2: 14, col3: 13},
    //   {exp_category: 'Energiekosten', exp_tax: '19', col0: 20, col1: 11, col2: 14, col3: 13},
    //   {exp_category: 'Human Resources', exp_tax: '19', col0: 30, col1: 15, col2: 12, col3: 13}
    // ];
  }

  getResource() {
    return this.api.data;
  }
}
