/* eslint brace-style: ["error", "stroustrup"] */

import {bindable} from 'aurelia-framework';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';

export class Xltable {
  @bindable actionTitle;

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
      colHeaders: false,
      licenseKey: 'non-commercial-and-evaluation'
    });
  }

  getActionTitle(expensePosition) {
    if (this.dataContains(expensePosition)) {
      return '- REMOVE';
    }
    return '+ ADD';
  }

  dataContains(expensePosition) {
    for (let row of this.data) {
      if (row.includes(expensePosition) && expensePosition !== '') {
        return true;
      }
    }
    return false;
  }

  actionData(expensePosition) {
    if (!expensePosition) return false;
    const updateData = this.data;
    const newRow = [expensePosition];

    if (!this.dataContains(expensePosition)) {
      updateData.push(newRow);
    }
    else {
      console.log('remove row of: ' + expensePosition);
    }
    this.hot.render();
  }
}
