const express = require('express');

const app = express();
var result;



var getDate = function (req, res, next) {
 var date = new Date();
 result = date.toUTCString();
 console.log(result);

  next();
};

app.use(express.static('./'));
app.use(getDate);

app.get('/', function (req, res) {
res.render('index.html');
});

module.exports = app;