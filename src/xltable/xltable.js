/* eslint brace-style: ["error", "stroustrup"] */

import { inject } from 'aurelia-framework';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class Xltable {
  constructor(eventAggregator) {
    this.ea = eventAggregator;
    this.data = null;
    this.container = null;
    this.hot = null;
    this.numformat = {
      pattern: '0.00'
    };
    this.eventSubscription = this.ea.subscribe('load-data', payload => (this.configTable(payload)));
  }

  attached() {
  }

  detached() {
    this.eventSubscription.dispose();
  }

  configTable(data) {
    console.log(data);
    this.data = data;
    this.container = document.getElementById('xltable');
    this.hot = new Handsontable(this.container, {
      data: this.data['exp_hot'],
      rowHeaders: '☰',
      colHeaders: this.getColHeaders(),
      manualRowMove: true,
      persistentState: true,
      // hiddenRows: {
      //   rows: [0]
      // },
      columns: [
        {data: 'exp_category', type: 'text', readOnly: true},
        {data: 'exp_tax', type: 'text', readOnly: true},
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

  isCategory(row, col, row2, col2) {
    return !row || row !== row2 || col > 0 || col2 > 0;
  }

  selectionCallback(row, col, row2, col2) {
    if (this.isCategory(row, col, row2, col2)) return this.expensePosition = '';
    this.expensePosition = this.data[row]['exp_category'];
  }

  changeCallback(changes) {
    for (let change of changes) {
      if (change[1] === 'exp_category') return;
      if (typeof change[3] === 'number') {
        this.resource.updateValues(this.hot.getData());
        // console.log(this.hot.getData());
        return;
      }
      // changes = [row, prop, oldVal, newVal] --> afterChange Hook
      this.hot.setDataAtRowProp(change[0], change[1], change[2]);
    }
  }

  getColHeaders() {
    // Generating headers with weeks and months
    let headers = [];
    for (let col in this.data[0]) {
      headers.push(this.data[0][col]);
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
    return (this.data[i]['exp_category'] === this.expensePosition) ? true : false;
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
    const newRowsCount = (isNaN(this.expensePosition) ? 1 : Number(this.expensePosition));

    if (!this.dataContains(this.expensePosition)) {
      this.hot.alter('insert_row', this.data.length, newRowsCount);
      this.expensePosition = '';
    }
    else {
      for (let item of this.data) {
        if (item['exp_category'] === this.expensePosition) {
          let index = this.data.indexOf(item);
          this.hot.alter('remove_row', index, 1);
          this.expensePosition = '';
        }
      }
    }
  }
}
