// Example server using Union

var union = require('union')
  , docserver = require('./')
  ;

var server = union.createServer({
  before: [

    // quick-n-dirty logging
    function(req, res, next) {
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
    },

    docserver({
      dir: './test/docs'
    })

  ]
}).listen(3000);

console.log('example Union server listening on port 3000');
