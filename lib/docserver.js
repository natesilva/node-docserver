var path = require('path')
  , url = require('url')
  , fs = require('fs')
  , MemoryCache = require('./docserver/memoryCache.js')
  , memoize = require('./docserver/memoize.js')
  , watch = require('./docserver/watch.js')
  ;

var docserver = module.exports = function(options) {
  // get our version number
  var packageJson = path.join(__dirname, '..', 'package.json');
  docserver.version = JSON.parse(fs.readFileSync(packageJson)).version;
  
  // process options
  options = options || {};
  options.dir = options.dir || 'docs';
  options.url = options.url || '/docs/';
  options.extensions = ['.md', '.mdown'];
  options.cache = options.cache || MemoryCache;
  options.watch = options.watch || false;
  if (options.url.substr(-1) !== '/') { options.url += '/'; }

  // load memo-ized versions of functions that we need
  var cache = new options.cache();
  var findMatch = memoize(require('./docserver/findMatch.js'), cache,
    'findMatch');
  var render = memoize(require('./docserver/render.js'), cache, 'render');
  var renderError = memoize(require('./docserver/renderError.js'), cache,
    'renderError');

  // invalidate cache on filesystem changes
  if (options.watch) { watch(options.dir, cache); }

  // the middleware
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

    // convert it to an actual filename
    findMatch(target, options.extensions, function(err, filename) {
      if (err) { return next(err); }

      if (filename) {
        render(filename, options.dir, function(err, html) {
          if (err) { return next(err); }
          res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
          res.end(html);
        });
      } else {
        renderError(404, path.dirname(target), options.dir, options.extensions,
          function(err, headers, body)
        {
          if (err) { return next(err); }
          res.writeHead(404, headers);
          res.end(body);
        });
      }
    });
  };
};
