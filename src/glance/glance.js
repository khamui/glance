import { inject, Factory } from 'aurelia-dependency-injection';
import { Api } from '../backend/api';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Factory.of(Api), EventAggregator)
export class Glance {
  constructor(api, eventAggregator) {
    this.api = new api;
    this.ea = eventAggregator;
    this.resource = { resourcetype: 'table', expData: null, revData: null };
    this.eventSubscription = this.ea.subscribe('update-data', (payload) => {
      return this.updateExpenses(payload);
    });
  }

  created() {
    this.getExpenses();
  }

  getExpenses() {
    this.api.get('expenses')
      .then((result) => {
        this.resource.expData = result;
        this.ea.publish('load-data', this.resource);
      });
  }

  updateExpenses(data) {
    this.api.update('expenses', data)
      .then((result) => {
        console.log(result);
      });
  }
}
