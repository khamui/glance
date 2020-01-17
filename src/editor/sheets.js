import { inject } from 'aurelia-framework';
import { SheetService } from './sheet-service';

@inject(SheetService)
export class Sheets {
  constructor(sheetService) {
    this.ss = sheetService;
    this.expSheetId = 'expenses';
    this.revSheetId = 'revenues';
    console.log('sheets constructed.');
  }

  attached() {
  }
}
