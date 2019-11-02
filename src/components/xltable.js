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

  attached() {
    this.container = document.getElementById('xltable');
    this.hot = new Handsontable(this.container, {
      data: this.data,
      rowHeaders: false,
      colHeaders: this.getColHeaders(),
      hiddenRows: {
        rows: [0],
        indicators: true
      },
      licenseKey: 'non-commercial-and-evaluation'
    });

    this.hot.addHook('afterSelection', (index) => this.sendSelection(index));
  }

  sendSelection(index) {
    this.expensePosition = this.data[index].title;
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
      for (let item of this.data) {
        if (item.title === this.expensePosition) {
          let index = this.data.indexOf(item);
          this.data.splice(index, 1);
        }
      }
    }
    this.hot.render();
  }
}
