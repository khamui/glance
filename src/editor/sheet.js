import { bindable, inject } from 'aurelia-framework';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import { SheetService } from './sheet-service';

@inject(Element, SheetService)
export class Sheet {
  @bindable sheetType;
  constructor(element, sheetService) {
    this.el = element;
    this.ss = sheetService;
    this.hot = null;
    this.data = {};
    console.log('table constructed.');
  }

  async attached() {
    await this.ss.readResource(this.sheetType).then((fetchload) => {
      this.resource = fetchload;
      this.configTable();
    });
  }

  configTable() {
    this.hot = new Handsontable(this.el, this.resource.sheetData);
    this.hot.selectCell(0, 0);
    // this.hot.addHook('afterSelectionEnd', (row, col, row2, col2) => this.selectionCallback(row, col, row2, col2));
    // this.hot.addHook('afterChange', (changes, event) => this.changeCallback(changes, event));
    this.hot.addHook('afterRowMove', (rows, target) => this.rowMoveCallback(rows, target));
  }

  valueFieldTypeCheck() {
    let cellProperties = {};
    cellProperties.invalidCellClassName = 'hilight__error-anim';
    return cellProperties;
  }

  rowMoveCallback(rows, target) {
    // TODO: Saving entire HOT to Database
    console.log(this.hot.getData());
  }

  selectionCallback(row, col, row2, col2) {
    // TODO: Validation checks!
    if (this.isNotCategory(row, col, row2, col2)) return this.expensePosition = '';
    this.expensePosition = this.data[row]['name'];
  }

  changeCallback(changes) {
    // TODO: Saving single or multiple categories to Database
    if (!changes) return;
    this.ss.updateValues(this.resource);
    return;
  }
}
