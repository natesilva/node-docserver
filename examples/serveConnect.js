// example server using Connect

var connect = require('connect')
  , http = require('http')
  , path = require('path')
  , docserver = require('../')
  ;

var dir = process.argv[2] || path.join(__dirname, '..', 'test', 'docs');
var port = process.argv[3] || 3000;

var app = connect();

app.use(connect.logger());
app.use(docserver({
  url: '/',
  dir: dir
}));

http.createServer(app).listen(port);

console.log(docserver.version + ' serving ' + dir + ' on port ' + port +
  ' (with Connect)');
