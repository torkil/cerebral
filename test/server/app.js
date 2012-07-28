
/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/../../'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res) {
  fs.readFile(__dirname + "/../browser.html", "utf8", function(err, data) {
    res.send(data)
  })
});

var port = process.argv[2] || 3000

app.listen(port);
