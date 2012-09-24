// Example server using Union

var union = require('union')
  , docserver = require('./')
  ;

var server = union.createServer({
  before: [
    docserver({
      dir: './test/docs'
    })
  ]
}).listen(3000);

console.log('example union server listening on port 3000');
