// Bare-bones server that uses a Redis cache instead of the default
// in-memory cache.

var http = require('http')
  , path = require('path')
  , docserver = require('../')
  , RedisCache = require('./redisCache.js')
  ;

var dir = process.argv[2] || path.join(__dirname, '..', 'test', 'docs');
var port = process.argv[3] || 3000;

var middleware = docserver({
  url: '/',
  dir: dir,
  cache: RedisCache
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
  ' (with Redis as cache)');
