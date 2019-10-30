/* eslint brace-style: ["error", "stroustrup"] */

import {bindable} from 'aurelia-framework';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';

export class Xltable {
  @bindable actionTitle;
  @bindable expensePosition;

  data = [
    {title: 'Date', row0: 'Week 1', row1: 'Week 2', row2: 'Week 3', row3: 'Week 4'},
    {title: 'Software', row0: 10, row1: 11, row2: 12, row3: 13},
    {title: 'Hardware', row0: 20, row1: 11, row2: 14, row3: 13},
    {title: 'Human Resources', row0: 30, row1: 15, row2: 12, row3: 13}
  ];

  container = null;
  hot = null;

  attached() {
    this.container = document.getElementById('xltable');
    this.hot = new Handsontable(this.container, {
      data: this.data,
      rowHeaders: false,
      colHeaders: this.getColHeaders(),
      minSpareRows: 1,
      hiddenRows: {
        rows: [0],
        indicators: true
      },
      licenseKey: 'non-commercial-and-evaluation'
    });
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
    if (this.data[i].title === this.expensePosition) {
      return true;
    }
  }

  dataContains() {
    for (let i in this.data) {
      // this.data[i]['row'+i]
      if (this.isDuplicate(i) && this.expensePosition !== '') {
        return true;
      }
    }
    return false;
  }

  actionData() {
    if (!this.expensePosition) return false;
    const updateData = this.data;
    const newRow = {title: this.expensePosition};

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
