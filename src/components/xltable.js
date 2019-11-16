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
    this.container = document.getElementById('xltable');
    this.hot = new Handsontable(this.container, {
      data: this.data,
      rowHeaders: '☰',
      colHeaders: this.getColHeaders(),
      manualRowMove: true,
      hiddenRows: {
        rows: [0]
      },
      columns: [
        {data: 'title', type: 'text'},
        {data: 'row0', type: 'numeric', numericFormat: this.numformat},
        {data: 'row1', type: 'numeric', numericFormat: this.numformat},
        {data: 'row2', type: 'numeric', numericFormat: this.numformat},
        {data: 'row3', type: 'numeric', numericFormat: this.numformat}
      ],
      cells: this.valueFieldTypeCheck,
      licenseKey: 'non-commercial-and-evaluation'
    });

    this.hot.addHook('afterSelectionEnd', (row, col, row2, col2) => this.sendSelection(row, col, row2, col2));
    this.hot.addHook('afterChange', (changes, event) => this.checkNumberType(changes, event));
  }

  valueFieldTypeCheck() {
    let cellProperties = {};
    cellProperties.invalidCellClassName = 'hilight__error-anim';
    return cellProperties;
  }

  sendSelection(row, col, row2, col2) {
    if (!row || row !== row2 || col > 0 || col2 > 0) return this.expensePosition = '';
    this.expensePosition = this.data[row].title;
  }

  checkNumberType(changes) {
    for (let change of changes) {
      if (typeof change[3] === 'number') return;
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

  actionData(expPosition) {
    if (!expPosition) return false;
    const updateData = this.data;
    const newRow = {title: expPosition};

    if (!this.dataContains(expPosition)) {
      updateData.push(newRow);
      this.expensePosition = '';
    }
    else {
      for (let item of this.data) {
        if (item.title === expPosition) {
          let index = this.data.indexOf(item);
          this.data.splice(index, 1);
          this.expensePosition = '';
        }
      }
    }
    this.hot.render();
  }
}
