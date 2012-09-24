// Example server using Connect

var connect = require('connect')
  , http = require('http')
  , docserver = require('./')
  ;

var app = connect();

app.use(docserver({
  dir: './test/docs'
}));

http.createServer(app).listen(3000);
console.log('example Connect server listening on port 3000');
