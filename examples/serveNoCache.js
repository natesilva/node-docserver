// Bare-bones server that shows how to disable server-side caching.

var http = require('http')
  , path = require('path')
  , docserver = require('../')
  ;

var dir = process.argv[2] || path.join(__dirname, '..', 'test', 'docs');
var port = process.argv[3] || 3000;

var middleware = docserver({
  url: '/',
  dir: dir,
  cache: false  // <-- set this to false (0 or other values won't work)
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

console.log(docserver.version + ' serving ' + dir + ' on port ' + port +
  ' (with no server-side cache)');
