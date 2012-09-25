// example server using Union

var union = require('union')
  , path = require('path')
  , docserver = require('..\/')
  ;

var dir = process.argv[2] || path.join(__dirname, '..', 'test', 'docs');
var port = process.argv[3] || 3000;

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

var server = union.createServer({
  before: [
    logger,
    docserver({
      url: '/',
      dir: dir,
      headers: {'X-Powered-By': 'Narwhals'}
    })

  ]
}).listen(port);

console.log(docserver.version + ' serving ' + dir + ' on port ' + port +
  ' (with Union)');
