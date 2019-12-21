import { inject, Factory } from 'aurelia-dependency-injection';
import { Api } from '../backend/api';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Factory.of(Api), EventAggregator)
export class Glance {
  constructor(api, eventAggregator) {
    this.api = new api;
    this.ea = eventAggregator;
    this.resource = { resType: null, data: null };
    this.eventSubscription = this.ea.subscribe('update-data', (payload) => {
      return this.updateXltable(payload);
    });
  }

  created() {
    this.readXltable();
  }

  readXltable() {
    this.api.read('expenses/4001')
      .then((result) => {
        this.resource.data = result;
        this.resource.resType = this.resource.data['res_type'];
        this.ea.publish('load-data', this.resource);
      });
  }

  updateXltable(data) {
    this.api.create('expenses', data)
      .then((result) => {
        console.log(result);
      });
  }
}
