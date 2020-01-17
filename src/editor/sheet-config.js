// PLUGINS enabled:
// Collapsing Columns
// Context Menu
// Hiding Columns --> tbd
// Search for Values --> tbd
// Select (Dropdown in Cell) --> tbd
// Nested Headers
// Highlight selection (row, col) --> tbd
// More Plugins: https://handsontable.com/docs/7.3.0/tutorial-features.html

const price_eur = { pattern: '0.0,00' };
const price_us = { pattern: '0,0.00' };
const collapsibleColsArray = [{row: -2, col: 2, collapsible: true}];
const nestedHeadersArray = [
  ['', '', {label: 'January', colspan: 4}],
  ['Title', 'Tax', 'Jan // Week 1', 'Jan // Week 2', 'Jan // Week 3', 'Jan // Week 4']
];

export const CONFIG = {
  data: null,
  id: null,
  colWidths: [220, 50, 140, 140, 140, 140, 140, 140, 140, 140, 140, 140, 140, 140],
  rowHeaders: '☰',
  colHeaders: true,
  nestedHeaders: nestedHeadersArray,
  manualRowMove: true,
  contextMenu: true,
  hiddenColumns: true,
  collapsibleColumns: collapsibleColsArray,
  columns: [
    {data: 'name', type: 'text'},
    {data: 'tax', type: 'dropdown', source: [0, 7, 19]},
    {data: 'col0', type: 'numeric', numericFormat: price_us},
    {data: 'col1', type: 'numeric', numericFormat: price_us},
    {data: 'col2', type: 'numeric', numericFormat: price_us},
    {data: 'col3', type: 'numeric', numericFormat: price_us}
  ],
  licenseKey: 'non-commercial-and-evaluation'
};
