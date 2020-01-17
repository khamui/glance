import { inject } from 'aurelia-framework';
import { SheetService } from '../editor/sheet-service';

@inject(SheetService)
export class Home {
  constructor(sheetService) {
    this.ss = sheetService;
    console.log(this.ss.resourceList);
  }
}
