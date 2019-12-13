import { inject } from 'aurelia-dependency-injection';
import { Api } from '../backend/api';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Api, EventAggregator)
export class Glance {
  constructor(api, eventAggregator) {
    this.api = api;
    this.ea = eventAggregator;
    this.resource = null;
  }

  created() {
    this.api.get('expenses')
      .then((result) => {
        this.resource = result;
        this.ea.publish('load-data', this.resource);
      });
  }
}
