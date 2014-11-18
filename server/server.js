var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // for parsing application/json

// var jsonParser = bodyParser.json();

var comments = JSON.parse(fs.readFileSync("data.json"));

var headers = {
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,OPTIONS',
  'Access-Control-Allow-Headers' : 'content-type, accept',
  'access-control-max-age' : 10
};

app.options('*', function(req, res) {
  res.header(headers);
  res.sendStatus(200);
});

app.get('/classes*', function (req, res) {
  res.header(headers);
  res.status(200).json(comments);
});

app.post('/classes*', function (req,res){
  res.header(headers);
  var obj = req.body;
  obj.createdAt = obj.updatedAt = new Date().toISOString();
  obj.objectId =  Date.now().toString(); //objectId.toString();
  comments.results.unshift(obj);
  res.status(200).json(comments);
});


app.use(express.static('../client'));


var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
