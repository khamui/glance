//DONE: reduce complexity on server side, no resourcebuilder, instead using data rightaway?
//TODO: define all needed endpoints
//TODO: make use of efficient request methods: GET, POST, PUT, PATCH?, DELETE etc.

/* eslint brace-style: ["error", "stroustrup"] */
const express = require('express');
const bodyParser = require("body-parser");
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

// START DB CONNECTION
(async () => {
  await dbconnect.connect((error) => {
    if (error) throw error;
    console.log('server started. connection successful.');
  });

// CREATE ENDPOINTS
  await app.get('/api/:type/:gla_id', (req, resp) => {
    queryCategoriesByType(req.params['type'], req.params['gla_id'])
      .then((result) => resp.send(result))
      .catch(() => resp.send('Resource with ID does not exist.'));
  });

  await app.get('/api/values/:cat_id', (req, resp) => {
    queryValues(req.params['cat_id'])
      .then((result) => resp.send(result))
      .catch(() => resp.send('Resource with ID does not exist.'));
  });

  await app.get('/api/:type/values/:cat_id', (req, resp) => {
    queryValuesByType(req.params['type'], req.params['cat_id'])
      .then((result) => resp.send(result))
      .catch(() => resp.send('Resource with ID does not exist.'));
  });

  await app.post('/api/expenses', (req, resp) => {
    updateValueObjects(req.body)
      .then((result) => resp.send(result));
  });

  await app.post('/api/revenues', (req, resp) => {
    updateValueObjects(req.body)
      .then((result) => resp.send(result));
  });

  console.log('Endpoints created.');
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

async function queryCategoriesByType(type, glaId) {
  const sql =
  `SELECT * FROM tbl_categories
  WHERE tbl_categories.type='${type}'
  AND tbl_categories.gla_id=${glaId} `;
  return await getFromDatabaseBy(sql);
}

async function queryValues(catId) {
  const sql = 'SELECT * FROM tbl_values WHERE cat_id=' + catId;
  return await getFromDatabaseBy(sql);
}

async function queryValuesByType(type, catId) {
  const sql =
  `SELECT * FROM tbl_categories,tbl_values
  WHERE tbl_categories.type='${type}'
  AND tbl_categories.cat_id=tbl_values.cat_id
  AND tbl_values.cat_id=${catId} `;
  return await getFromDatabaseBy(sql);
}

// UPDATE
async function updateValueObjects(data) {
  let sql = '';

  for (let category of data.data) {
    sql = sql.concat(`DELETE FROM tbl_values WHERE cat_id=${category['cat_id']};\n`);
    for (let col in category) {
      // console.log(col);
      if (col.substring(0, 3) === 'col') {
        sql = sql.concat('INSERT INTO tbl_values (cat_id,value)\n');
        sql = sql.concat(`VALUES (${category['cat_id']},${category[col]});\n`);
      }
    }
  }
  return await getFromDatabaseBy(sql);
}

// LISTEN
app.listen(SOURCE_PORT);
