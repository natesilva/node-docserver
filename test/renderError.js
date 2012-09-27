var test = require('tap').test
  , fs = require('fs')
  , renderError = require('../lib/docserver/renderError.js')
  , MemoryCache = require('../lib/docserver/memoryCache.js')
  ;


var BASE_DIR = 'docs';
var EXTENSIONS = ['.md', '.mdown'];


test('throw a 404 using a template', function(t) {
  renderError(404, 'docs/goodbye/cruel', BASE_DIR, EXTENSIONS,
    function(err, headers, body)
  {
    t.notOk(err, 'should complete without error');
    t.ok('Content-Type' in headers, 'Content-Type header should be set');
    t.equal(headers['Content-Type'], 'text/html; charset=UTF-8',
      'Content-Type should be text/html; charset=UTF-8');
    var content = fs.readFileSync('docs/goodbye/404-rendered.html');
    t.equal(body.toString(), content.toString(),
      'should render template as expected');
    t.end();
  });
});

test('throw a 404 not using a template', function(t) {
  renderError(404, 'docs', BASE_DIR, EXTENSIONS, function(err, headers, body)
  {
    t.notOk(err, 'should complete without error');
    t.ok('Content-Type' in headers, 'Content-Type header should be set');
    t.equal(headers['Content-Type'], 'text/plain',
      'Content-Type should be text/plain');
    t.equal(body, '404', 'should render as just the error code');
    t.end();
  });
});
