var path = require('path')
  , url = require('url')
  , fs = require('fs')
  , mime = require('mime')
  , MemoryCache = require('./docserver/memoryCache.js')
  , NoCache = require('./docserver/noCache.js')
  , memoize = require('./docserver/memoize.js')
  , watch = require('./docserver/watch.js')
  , helpers = require('./docserver/helpers.js')
  ;

var docserver = module.exports = function(options) {
  var headers = {};

  // get our version number
  var packageJsonPath = path.join(__dirname, '..', 'package.json');
  var packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
  docserver.version = packageJson.name + ' ' + packageJson.version;

  // process options
  options = options || {};
  options.dir = options.dir || 'docs';
  options.url = options.url || '/docs/';
  options.extensions = options.extensions || ['.md', '.mdown'];
  options.passthrough =
    options.passthrough || ['.css', '.png', '.jpg', '.jpeg', '.js'];
  options.watch = options.watch || false;
  if (options.url.substr(-1) !== '/') { options.url += '/'; }

  // create the cache and start fresh
  var cache;
  if (options.cache === false) { cache = new NoCache(); }
  else if (!options.cache) { cache = new MemoryCache(); }
  else { cache = new options.cache(); }
  cache.flushAll();

  // load memo-ized versions of functions that we need
  var findMatch = memoize(require('./docserver/findMatch.js'), cache,
    'findMatch');
  var render = memoize(require('./docserver/render.js'), cache, 'render');
  var renderError = memoize(require('./docserver/renderError.js'), cache,
    'renderError');
  var cachedReadFile = memoize(fs.readFile, cache, 'cachedReadFile');

  // invalidate cache on filesystem changes
  if (options.watch) { watch(options.dir, cache); }

  // default headers
  var defaultHeaders = {'X-Powered-By': docserver.version};
  defaultHeaders = helpers.merge(defaultHeaders, options.headers);

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
      headers = {'Allow': 'GET, HEAD'};
      res.writeHead(405,
        helpers.merge(defaultHeaders, headers));
      return res.end();
    }

    // map the URL to a filesystem path
    var target = path.join(options.dir, pathname.slice(options.url.length));

    fs.exists(target, function(exists) {

      // is it a pass-through file?
      var ext = path.extname(target);
      if (exists && options.passthrough.indexOf(ext) !== -1) {
        // yes, pass-through
        return cachedReadFile(target, function(err, buffer) {
          if (err) { return next(err); }
          var headers = {'Content-Type': mime.lookup(ext)};
          res.writeHead(200, helpers.merge(defaultHeaders, headers));
          res.end(buffer);
        });
      }

      // no, not a pass-through file: resolve the actual filename
      findMatch(target, options.extensions, function(err, filename) {
        if (err) { return next(err); }

        if (filename) {
          render(filename, options.dir, function(err, html) {
            if (err) { return next(err); }
            var headers = {'Content-Type': 'text/html; charset=UTF-8'};
            res.writeHead(200,
              helpers.merge(defaultHeaders, headers));
            res.end(html);
          });
        } else {
          renderError(404, target, options.dir, options.extensions,
            function(err, headers, body)
          {
            if (err) { return next(err); }
            res.writeHead(404,
              helpers.merge(defaultHeaders, headers));
            res.end(body);
          });
        }
      });
    });
  };
};
