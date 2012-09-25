#!/usr/bin/env node

// bare-bones server with no external dependencies

var http = require('http')
  , path = require('path')
  , docserver = require('../')
  ;

var dir = process.argv[2] || '.';
var port = process.argv[3] || 3000;

dir = path.resolve(dir);

var middleware = docserver({
  url: '/',
  dir: dir
});

// quick-n-dirty logging
var logger = function(req, res, next) {
  var message = [
    req.connection.remoteAddress,
    (new Date()).toUTCString(),
    req.method,
    req.url
  ];

  var end = res.end;
  res.end = function() {
    message.push(res.statusCode);
    console.log(message.join(' - '));
    end.apply(res, arguments);
  };

  next();
};

http.createServer(function(req, res) {

    logger(req, res, function() {
      middleware(req, res, function() {});
    });

}).listen(port);

console.log(docserver.version + ' serving ' + dir + ' on port ' + port);
