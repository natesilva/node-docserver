var path = require('path')
  ;


var docserver = module.exports = function(options) {
  options = options || {};
  options.dir = options.dir || 'docs';
  options.url = options.url || '/docs/';
  options.extensions = ['.md', '.mdown'];

  if (options.url.substr(-1) !== '/') { options.url += '/'; }

  return function middleware(req, res, next) {
    // check if req.url is one that we are supposed to handle
    var pathname = decodeURI(url.parse(req.url).pathname);
    if (pathname.slice(0, options.url.length) !== options.url) {
      // request is outside our URL base
      return next();
    }

    // only GET and HEAD requests are allowed
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, {'Allow': 'GET, HEAD'});
      return res.end();
    }

    // map the URL to a filesystem path
    var target = path.join(options.dir, pathname.slice(options.url.length));
    
    

  };
};
