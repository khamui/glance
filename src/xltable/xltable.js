/* eslint brace-style: ["error", "stroustrup"] */

import { bindable, inject } from 'aurelia-framework';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class Xltable {
  @bindable id;
  constructor(eventAggregator) {
    this.ea = eventAggregator;
    this.pfx = '';
    this.hot = null;
    this.data = {};
    this.container = null;
    this.numformat = {
      pattern: '0.00'
    };
    this.eventSubscription = this.ea.subscribe('load-data', resource => (this.configTable(resource)));
  }

  attached() {
  }

  detached() {
    this.eventSubscription.dispose();
  }

  configTable(resource) {
    this.pfx = resource.resType;
    this.data = resource.data;
    this.hot = new Handsontable(this.xref, {
      data: this.data[this.pfx + '_hot'],
      id: this.id,
      rowHeaders: '☰',
      colHeaders: this.getColHeaders(),
      manualRowMove: true,
      // hiddenRows: {
      //   rows: [0]
      // },
      columns: [
        {data: this.pfx + '_category', type: 'text', readOnly: true},
        {data: this.pfx + '_tax', type: 'text', readOnly: true},
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
    this.expensePosition = this.data[this.pfx + '_hot'][row][this.pfx + '_category'];
  }

  changeCallback(changes) {
    for (let change of changes) {
      if (change[1] === this.pfx + '_category') return;
      if (typeof change[3] === 'number') {
        this.ea.publish('update-data', this.data);
        return;
      }
      // changes = [row, prop, oldVal, newVal] --> afterChange Hook
      this.hot.setDataAtRowProp(change[0], change[1], change[2]);
    }
  }

  getColHeaders() {
    // Generating headers with weeks and months
    let headers = [];
    for (let col in this.data[this.pfx + '_hot'][0]) {
      headers.push(this.data[this.pfx + '_hot'][0][col]);
    }
    return headers;
  }

  getActionTitle() {
    if (this.dataContains()) {
      return '- REMOVE';
    }
    return '+ ADD';
  }

  isDuplicate(i) {
    return (this.data[this.pfx + '_hot'][i][this.pfx + '_category'] === this.expensePosition) ? true : false;
  }

  dataContains() {
    for (let i in this.data[this.pfx + '_hot']) {
      if (this.isDuplicate(i) && this.expensePosition !== '') {
        return true;
      }
    }
    return false;
  }

  actionData() {
    if (!this.expensePosition) return false;
    const newRowsCount = (isNaN(this.expensePosition) ? 1 : Number(this.expensePosition));

    if (!this.dataContains(this.expensePosition)) {
      this.hot.alter('insert_row', this.data[this.pfx + '_hot'].length, newRowsCount);
      this.expensePosition = '';
    }
    else {
      for (let item of this.data[this.pfx + '_hot']) {
        if (item[this.pfx + '_category'] === this.expensePosition) {
          let index = this.data[this.pfx + '_hot'].indexOf(item);
          this.hot.alter('remove_row', index, 1);
          this.expensePosition = '';
        }
      }
    }
  }
}
