/* eslint brace-style: ["error", "stroustrup"] */

import {bindable} from 'aurelia-framework';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import {Resource} from '../backend/resource.js';

export class Xltable {
  @bindable actionTitle;
  @bindable expensePosition;

  resource = new Resource;
  data = this.resource.items;
  container = null;
  hot = null;
  numformat = {
    pattern: '0.00'
  }

  attached() {
    // console.log(JSON.parse(JSON.stringify(this.data)));
    this.container = document.getElementById('xltable');
    this.hot = new Handsontable(this.container, {
      data: this.data,
      rowHeaders: '☰',
      colHeaders: this.getColHeaders(),
      manualRowMove: true,
      persistentState: true,
      hiddenRows: {
        rows: [0]
      },
      columns: [
        {data: 'title', type: 'text', readOnly: true},
        {data: 'details', type: 'text', readOnly: true},
        {data: 'row0', type: 'numeric', numericFormat: this.numformat},
        {data: 'row1', type: 'numeric', numericFormat: this.numformat},
        {data: 'row2', type: 'numeric', numericFormat: this.numformat},
        {data: 'row3', type: 'numeric', numericFormat: this.numformat}
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
    this.expensePosition = this.data[row].title;
  }

  changeCallback(changes) {
    for (let change of changes) {
      if (typeof change[3] === 'number') return;
      if (change[1] === 'title') return;
      // changes = [row, prop, oldVal, newVal] --> afterChange Hook
      this.hot.setDataAtRowProp(change[0], change[1], change[2]);
    }
  }

  getColHeaders() {
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
    return (this.data[i].title === this.expensePosition) ? true : false;
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
        if (item.title === this.expensePosition) {
          let index = this.data.indexOf(item);
          this.hot.alter('remove_row', index, 1);
          this.expensePosition = '';
        }
      }
    }
  }
}
