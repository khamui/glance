import { bindable, inject, Factory } from 'aurelia-framework';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import { GlanceService } from '../services/glance-service';

@inject(Factory.of(GlanceService), Element)
export class Xltable {
  @bindable tableId;
  constructor(GlanceServiceClass, element) {
    this.gs = new GlanceServiceClass;
    this.el = element;
    this.hot = null;
    this.data = {};
    this.numformat = { pattern: '0.00' };
    this.toRemove = false;
  }

  attached() {
    this.gs.readResource(this.tableId).then((resource) => {
      this.resource = resource;
      this.configTable();
    });
  }

  configTable() {
    this.data = this.resource.data;
    this.hot = new Handsontable(this.el, {
      data: this.data,
      id: this.id,
      width: '100%',
      colWidths: [220, 50, 140, 140, 140, 140],
      rowHeaders: '☰',
      colHeaders: this.getColHeaders(),
      manualRowMove: true,
      // hiddenRows: {
      //   rows: [0]
      // },
      columns: [
        {data: 'name', type: 'text', readOnly: true},
        {data: 'tax', type: 'text', readOnly: true},
        {data: 'col0', type: 'numeric', numericFormat: this.numformat},
        {data: 'col1', type: 'numeric', numericFormat: this.numformat},
        {data: 'col2', type: 'numeric', numericFormat: this.numformat},
        {data: 'col3', type: 'numeric', numericFormat: this.numformat}
      ],
      cells: this.valueFieldTypeCheck,
      licenseKey: 'non-commercial-and-evaluation'
    });
    this.hot.addHook('afterSelectionEnd', (row, col, row2, col2) => this.selectionCallback(row, col, row2, col2));
    this.hot.addHook('afterChange', (changes, event) => this.changeCallback(changes, event));
  }

  valueFieldTypeCheck() {
    let cellProperties = {};
    cellProperties.invalidCellClassName = 'hilight__error-anim';
    return cellProperties;
  }

  isNotCategory(row, col, row2, col2) {
    return row !== row2 || col > 0 || col2 > 0;
  }

  selectionCallback(row, col, row2, col2) {
    if (this.isNotCategory(row, col, row2, col2)) return this.expensePosition = '';
    this.expensePosition = this.data[row]['name'];
  }

  changeCallback(changes) {
    for (let change of changes) {
      if (change[1] === 'name') return;
      if (typeof change[3] === 'number') {
        this.gs.updateValues(this.resource);
        return;
      }
      // changes = [row, prop, oldVal, newVal] --> afterChange Hook
      this.hot.setDataAtRowProp(change[0], change[1], change[2]);
    }
  }

  getColHeaders() {
    // Generating headers with weeks and months
    return ['Title', 'Tax', 'Jan // Week 1', 'Jan // Week 2', 'Jan // Week 3', 'Jan // Week 4'];
  }

  getActionTitle() {
    if (this.dataContains()) {
      this.toRemove = true;
      return '- REMOVE';
    }
    this.toRemove = false;
    return '+ ADD';
  }

  isDuplicate(i) {
    return (this.data[i]['name'] === this.expensePosition) ? true : false;
  }

  dataContains() {
    for (let i in this.data) {
      if (this.isDuplicate(i) && this.expensePosition !== '') {
        return true;
      }
    }
    return false;
  }

  actionData() {
    if (!this.expensePosition) return false;
    // const newRowsCount = (isNaN(this.expensePosition) ? 1 : Number(this.expensePosition));

    if (!this.dataContains(this.expensePosition)) {
      const newItem = { cat_id: null, gla_id: 4001, type: this.resource.resType, name: this.expensePosition, tax: 19 };

      this.hot.setDataAtRowProp([
        [this.data.length, 'name', newItem['name']],
        [this.data.length, 'tax', newItem['tax']]
      ]);
      this.gs.createCategory(newItem);
      console.log(newItem);
      this.expensePosition = '';
    }
    else {
      for (let item of this.data) {
        if (item['name'] === this.expensePosition) {
          let index = this.data.indexOf(item);
          this.hot.alter('remove_row', index, 1);
          this.gs.deleteCategory(item, this.resource.resType);
          this.expensePosition = '';
        }
      }
    }
  }
}
