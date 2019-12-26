/* eslint brace-style: ["error", "stroustrup"] */
import { inject } from 'aurelia-framework';
import { GlanceService } from '../services/glance-service';

@inject(GlanceService)
export class Glance {
  constructor(glanceService) {
    this.gs = glanceService;
    this.expType = 'expenses';
    this.revType = 'revenues';

    console.log(this.gs);
  }
}
