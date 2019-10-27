/* eslint brace-style: ["error", "stroustrup"] */

import {bindable} from 'aurelia-framework';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';

export class Xltable {
  @bindable actionTitle;
  @bindable expensePosition;

  data = [
    ['', 'Week 1', 'Week 2', 'Week 3', 'Week 4'],
    ['Software', 10, 11, 12, 13],
    ['Hardware', 20, 11, 14, 13],
    ['Human Resources', 30, 15, 12, 13]
  ];

  container = null;
  hot = null;

  attached() {
    this.container = document.getElementById('xltable');
    this.hot = new Handsontable(this.container, {
      data: this.data,
      rowHeaders: false,
      colHeaders: this.getColHeaders(),
      licenseKey: 'non-commercial-and-evaluation'
    });
  }

  getColHeaders() {
    let headers = [];
    for (let elem of this.data[0]) {
      headers.push(elem);
    }
    return headers;
  }

  getActionTitle() {
    if (this.dataContains()) {
      return '- REMOVE';
    }
    return '+ ADD';
  }

  dataContains() {
    for (let row of this.data) {
      if (row.includes(this.expensePosition) && this.expensePosition !== '') {
        return true;
      }
    }
    return false;
  }

  actionData() {
    if (!this.expensePosition) return false;
    const updateData = this.data;
    const newRow = [this.expensePosition];

    if (!this.dataContains(this.expensePosition)) {
      updateData.push(newRow);
      this.expensePosition = '';
    }
    else {
      console.log('remove row of: ' + this.expensePosition);
    }
    this.hot.render();
  }
}
