var test = require('tap').test
  , render = require('../lib/docserver/render.js')
  , fs = require('fs')
  , MemoryCache = require('../lib/docserver/memoryCache.js')
  ;


var DOCS_DIR = 'docs';

function testRender(t, md, html, description) {
  render(md, DOCS_DIR, function(err, result) {
    t.notOk(err, 'should complete without error');
    var data = fs.readFileSync(html);
    t.equal(data.toString(), result.toString(), description);
    t.end();
  });
}

test('render a file using a template from a parent dir', function(t) {
  testRender(t,
    'docs/goodbye/cruel/world/index.mdown',
    'docs/goodbye/cruel/world/index-rendered.html',
    'should render template as expected'
  );
});

test('render a file using a template from the same dir', function(t) {
  testRender(t,
    'docs/goodbye/404.md',
    'docs/goodbye/404-rendered.html',
    'should render template as expected'
  );
});

test('render a file that has no template', function(t) {
  testRender(t,
      'docs/hello.md',
      'docs/hello-rendered.html',
      'should render as expected'
  );
});

test('render a non-existent file', function(t) {
  render('docs/foo.bar.baz', DOCS_DIR, function(err, result) {
    t.ok(err, 'should return an error');
    t.type(err, 'Error', 'type of err is Error');
    t.end();
  })
});
