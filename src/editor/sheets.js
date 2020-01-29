import { inject, Factory } from 'aurelia-framework';
import { SheetService } from './sheet-service';
import { ResourceList } from '../model/resource-list';
import { ResourceItem } from '../model/resource-item';

@inject(SheetService, ResourceList, Factory.of(ResourceItem))
export class Sheets {
  constructor(sheetService, resourceList, ResourceItemBuilder) {
    this.ss = sheetService;
    this.resourceList = resourceList;
    this.glaId = 4001;
    this.glance = this.ss.load(this.glaId)
      .then((items) => {
        for (let item of items) {
          let newResource = {...item};
          this.ss.loadValues(item).then((values) => {
            newResource.sheetData = this.mapSheetData(values);
          }).then(() => {
            let resource = new ResourceItemBuilder;
            resource.setResource(newResource);
            this.resourceList.register(resource);
          });
        }
      });
  }

  mapSheetData(values) {
    return [...values.map((row) => {
      let sheetData = [];
      sheetData.push(row['cat_id']);
      sheetData.push(row['sheet_id']);
      sheetData.push(...JSON.parse(row['cat_data']));
      return sheetData;
    })];
  }
}
