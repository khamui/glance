import { inject } from 'aurelia-dependency-injection';
import { Aurelia } from 'aurelia-framework';
import { Api } from '../backend/api';
import routes from './routes';

@inject(Api, Aurelia)
export class Dashboard {

  configureRouter(config, router) {
    this.router = router;
    config.title = 'Glance App';
    config.map(routes);
  }

  constructor(api, aurelia) {
    this.au = aurelia;
  }
}
