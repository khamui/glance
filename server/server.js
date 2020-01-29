//DONE: reduce complexity on server side, no resourcebuilder, instead using data rightaway?
//TODO: define all needed endpoints
//TODO: make use of efficient request methods: GET, POST, PUT, PATCH?, DELETE etc.

/* eslint brace-style: ["error", "stroustrup"] */
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

// some settings
const DESTINATION_URL = 'http://localhost:9000';
const SOURCE_PORT = 1337;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', DESTINATION_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
  next();
});

const dbconnect = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'glanceDB',
  multipleStatements: true
});

const baseurl = '/api';

// START DB CONNECTION
(async () => {
  await dbconnect.connect((error) => {
    if (error) throw error;
    console.log('server started. connection successful.');
  });


// NEW ENDPOINTS
// entire data of glance by glance id
  await app.get(baseurl + '/sheets/:gla_id', (req, resp) => {
    getSheetsByGlance(req.params['gla_id'])
      .then((result) => resp.send(result))
      .catch(() => resp.send('Resource with ID does not exist.'));
  });

  await app.get(baseurl + '/sheets/:gla_id/:type/:sheet_id', (req, resp) => {
    getSheetValues(req.params['sheet_id'])
      .then((result) => resp.send(result))
      .catch(() => resp.send('Resource with ID does not exist.'));
  });

  await app.put(baseurl + '/sheets/:gla_id/:type', (req, resp) => {
    putSheetValues(req.body.rows)
      .then((result) => resp.send(result))
      .catch(() => resp.send('Resource with ID does not exist.'));
  });

  // CREATE ENDPOINTS
  await app.get(baseurl + '/:type/:gla_id', (req, resp) => {
    queryCategoriesByType(req.params['type'], req.params['gla_id'])
      .then((result) => resp.send(result))
      .catch(() => resp.send('Resource with ID does not exist.'));
  });

  await app.get(baseurl + '/values/:cat_id', (req, resp) => {
    queryValues(req.params['cat_id'])
      .then((result) => resp.send(result))
      .catch(() => resp.send('Resource with ID does not exist.'));
  });

  await app.get(baseurl + '/:type/values/:cat_id', (req, resp) => {
    queryValuesByType(req.params['type'], req.params['cat_id'])
      .then((result) => resp.send(result))
      .catch(() => resp.send('Resource with ID does not exist.'));
  });

  await app.post(baseurl + '/:type', (req, resp) => {
    updateValueObjects(req.body)
      .then((result) => resp.send(result));
  });

  await app.post(baseurl + '/:type/new', (req, resp) => {
    createSingleCategory(req.params['type'], req.body)
      .then((result) => resp.send(result));
  });

  await app.post(baseurl + '/:type/categories', (req, resp) => {
    updateCategoryObjects(req.body)
      .then((result) => resp.send(result));
  });

  await app.delete(baseurl + '/:type/categories/:cat_id', (req, resp) => {
    deleteSingleCategory(req.body)
      .then((result) => resp.send(result));
  });

  await console.log('Endpoints created.');
  // dbconnect.end();
})();

// DB QUERIES
function getFromDatabaseBy(sql) {
  return new Promise((res,rej) => {
    dbconnect.query(sql, (error, result, fields) => {
      (error) ? rej(error) : res(result);
    });
  });
}

// NEW DB QUERIES
async function getSheetsByGlance(glaId) {
  let sql =
  `SELECT * FROM tbl_sheet
  WHERE tbl_sheet.gla_id='${glaId}'`;
  return await getFromDatabaseBy(sql);
}

async function getSheetValues(sheetId) {
  let sql =
  `SELECT * FROM tbl_hot
  WHERE tbl_hot.sheet_id='${sheetId}'`;
  return await getFromDatabaseBy(sql);
}

async function putSheetValues(rows) {
  let sql = '';
  for (let row of rows) {
    const catData = JSON.stringify(row.slice(2, -1));
    sql = sql.concat(
      `UPDATE tbl_hot
      SET sheet_id=${row[1]}, cat_data='${catData}'
      WHERE cat_id=${row[0]};\n\n`);
  }
  return await getFromDatabaseBy(sql);
}

async function queryCategoriesByType(type, glaId) {
  let sql =
  `SELECT * FROM tbl_categories
  WHERE tbl_categories.type='${type}'
  AND tbl_categories.gla_id=${glaId}`;
  return await getFromDatabaseBy(sql);
}

async function queryValues(catId) {
  let sql = 'SELECT * FROM tbl_values WHERE cat_id=' + catId;
  return await getFromDatabaseBy(sql);
}

async function queryValuesByType(type, catId) {
  let sql =
  `SELECT * FROM tbl_categories,tbl_values
  WHERE tbl_categories.type='${type}'
  AND tbl_categories.cat_id=tbl_values.cat_id
  AND tbl_values.cat_id=${catId} `;
  return await getFromDatabaseBy(sql);
}

// UPDATE
async function updateValueObjects(data) {
  let sql = '';
  let valId = 10001;

  sql = sql.concat('DELETE FROM tbl_values;\n');
  for (let category of data.data) {
    for (let col in category) {
      // console.log(col);
      if (col.substring(0, 3) === 'col') {
        sql = sql.concat('INSERT INTO tbl_values (val_id,cat_id,value)\n');
        sql = sql.concat(`VALUES (${valId},${category['cat_id']},${category[col]});\n`);
        valId++;
      }
    }
  }
  return await getFromDatabaseBy(sql);
}

async function createSingleCategory(type, item) {
  let sql = '';
  sql = sql.concat('INSERT INTO tbl_categories (gla_id,type,name,tax)\n');
  sql = sql.concat(`VALUES (${item['gla_id']},'${type}','${item['name']}',${item['tax']});\n`);
  return await getFromDatabaseBy(sql);
}

async function updateCategoryObjects(data) {
  let sql = '';
  let glaId = data['glaId'];
  let type = data['resType'];

  sql = sql.concat('DELETE FROM tbl_categories;\n');

  for (let category of data.data) {
    sql = sql.concat('INSERT INTO `tbl_categories` (`cat_id`,`gla_id`,`type`,`name`,`tax`)\n');
    sql = sql.concat(`VALUES (${category['cat_id']},${glaId},'${type}','${category['name']}',${category['tax']});\n`);
  }
  console.log(sql);
  return await getFromDatabaseBy(sql);
}

async function deleteSingleCategory(item) {
  let sql =
  `DELETE FROM tbl_categories WHERE cat_id=${item['cat_id']};
   DELETE FROM tbl_values WHERE cat_id=${item['cat_id']};`;
  return await getFromDatabaseBy(sql);
}

// LISTEN
app.listen(SOURCE_PORT);
