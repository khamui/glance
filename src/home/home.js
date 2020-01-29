import { inject } from 'aurelia-framework';
import { SheetService } from '../editor/sheet-service';
import { ResourceList } from '../model/resource-list';

@inject(SheetService, ResourceList)
export class Home {
  constructor(sheetService, resourceList) {
    this.ss = sheetService;
    console.log(resourceList);
  }
}
