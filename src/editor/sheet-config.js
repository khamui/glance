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
  ['', '', '', '', {label: 'January', colspan: 4}],
  ['cat_id', 'sheet_id', 'Title', 'Tax', 'Jan // Week 1', 'Jan // Week 2', 'Jan // Week 3', 'Jan // Week 4']
];

export const CONFIG = {
  id: null,
  width: '100%',
  colWidths: [30, 30, 220, 50, 140, 140, 140, 140, 140, 140, 140, 140, 140, 140, 140, 140],
  rowHeaders: '☰',
  colHeaders: true,
  nestedHeaders: nestedHeadersArray,
  manualRowMove: true,
  contextMenu: true,
  hiddenColumns: {
    copyPasteEnabled: false,
    indicators: true,
    columns: [0, 1]
  },
  collapsibleColumns: collapsibleColsArray,
  columns: [
    {type: 'text'},
    {type: 'text'},
    {type: 'text'},
    {type: 'dropdown', source: [0, 7, 19]},
    {type: 'numeric', numericFormat: price_us},
    {type: 'numeric', numericFormat: price_us},
    {type: 'numeric', numericFormat: price_us},
    {type: 'numeric', numericFormat: price_us},
    {type: 'numeric', numericFormat: price_us},
    {type: 'numeric', numericFormat: price_us},
    {type: 'numeric', numericFormat: price_us},
    {type: 'numeric', numericFormat: price_us},
    {type: 'numeric', numericFormat: price_us},
    {type: 'numeric', numericFormat: price_us},
    {type: 'numeric', numericFormat: price_us},
    {type: 'numeric', numericFormat: price_us}
  ],
  licenseKey: 'non-commercial-and-evaluation'
};
