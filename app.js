const express = require('express');

const app = express();
var result;



var getDate = function (req, res, next) {
 var date = new Date();
 result = date.toUTCString();
 console.log(result);

  next();
};

app.use(express.static('public'));
app.use(getDate);

app.get('/programmateur', function (req, res) {
  res.sendFile(__dirname + '/public/programmateur.html');
  });

module.exports = app;