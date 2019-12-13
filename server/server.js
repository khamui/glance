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
  database: 'glanceDB'
});

// START DB CONNECTION
(async () => {
  await dbconnect.connect((error) => {
    if (error) throw error;
    console.log('server started. connection successful.');
  });
  const expObject = await resourceBuilder(4001, 'exp');
  await sendTo('/expenses', expObject);
  console.log('Endpoints created.');
  getFrom('/test');
  dbconnect.end();
})();


function queryTo(endpoint, sql) {
  app.get(endpoint, (req, resp) => {
    dbconnect.query(sql, (error, result) => {
      if (error) throw error;
      resp.send(result);
    });
  });
}

function sendTo(endpoint, data) {
  app.get(endpoint, (req, resp) => {
    resp.status(200);
    resp.send(data);
  });
}

function getFrom(endpoint) {
  app.post(endpoint, (req, resp) => {
    console.log(req.body);
    resp.end();
  });
}

// GETTERS
function getDataWith(sql) {
  return new Promise ((res,rej) => {
    dbconnect.query(sql, (error, result, fields) => {
      (error) ? rej(error) : res(result);
    });
  });
}

async function getCategoryObjects(glaId) {
  const sql = 'SELECT * FROM tbl_expense_cat WHERE gla_id=' + glaId;
  return await getDataWith(sql);
}

async function getValueObjects(expId) {
  const sql = 'SELECT * FROM tbl_expense_val WHERE exp_id=' + expId;
  return await getDataWith(sql);
}

// SETTERS
// BUILDER

async function hotBuilder(glaId, prefix, catObjects) {
  let object = [];
  let objectIndex = 0;

  for (let catObject of catObjects) {
    object.push({exp_id: catObject[prefix + '_id'], exp_category: catObject[prefix + '_category'], exp_tax: catObject[prefix + '_tax']});
    let valueObjects = await getValueObjects(catObject[prefix + '_id']);
    let colIndex = 0;
    for (let valueObject of valueObjects) {
      let colObject = {};
      colObject['col' + colIndex] = valueObject[prefix + '_value'];
      Object.assign(object[objectIndex], colObject);
      colIndex++;
    }
    objectIndex++;
  }
  if (!object) return error;
  return await object;
}

async function resourceBuilder(glaId, prefix) {
  let categoryObjects = await getCategoryObjects(glaId);
  let object = {};

  // console.log(object);
  object['gla_id'] = await categoryObjects[0]['gla_id'];
  // console.log(object);
  object[prefix + '_hot'] = await hotBuilder(glaId, prefix, categoryObjects);
  // console.log(object);
  return await object;
}

// LISTEN
app.listen(SOURCE_PORT);
