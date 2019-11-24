/* eslint brace-style: ["error", "stroustrup"] */
const express = require('express');
const mysql = require('mysql');
const app = express();

const dbconnect = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'glanceDB'
});

dbconnect.connect((error) => {
  if (error) {
    console.log('connection error.');
  }
  else {
    console.log('connection successful.');
  }
});

app.get('/', (req, resp) => {
  dbconnect.query('SELECT * FROM tbl_expense', (error, result) => {
    if (error) {
      console.log(error);
    }
    else {
      console.log(result);
    }
  });
});

app.listen(1337);
