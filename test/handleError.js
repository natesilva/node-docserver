var test = require('tap').test
  , fs = require('fs')
  , handleError = require('../lib/docserver/handleError.js')
  , fs = require('fs')
  ;


MIDDLEWARE_OPTIONS = {
  dir: 'docs',
  extensions: ['.md', '.mdown']
};


function MockServerResponse() {}

MockServerResponse.prototype.writeHead = function(errCode, headers) {
  this.errCode = errCode;
  this.headers = headers;
};

MockServerResponse.prototype.end = function(html) {
  this.content = html;
};


function testRender(t, md, html, description) {
  render(md, MIDDLEWARE_OPTIONS, function(err, result) {
    t.notOk(err, 'should complete without error');
    var data = fs.readFileSync(html);
    t.equal(data.toString(), result, description);
    t.end();
  });
}


test('throw a 404 using a template', function(t) {
  var res = new MockServerResponse();
  handleError(404, res, 'docs/goodbye/cruel', MIDDLEWARE_OPTIONS, function(err)
  {
    t.notOk(err, 'should complete without error');
    t.equal(res.errCode, 404, 'HTML error code should be set');
    t.ok('Content-Type' in res.headers, 'Content-Type header should be set');
    t.equal(res.headers['Content-Type'], 'text/html; charset=UTF-8',
      'Content-Type should be text/html; charset=UTF-8');
    var content = fs.readFileSync('docs/goodbye/404-rendered.html');
    t.equal(res.content, content.toString(),
      'should render template as expected');
    t.end();
  });
});

test('throw a 404 not using a template', function(t) {
  var res = new MockServerResponse();
  handleError(404, res, 'docs', MIDDLEWARE_OPTIONS, function(err)
  {
    t.notOk(err, 'should complete without error');
    t.equal(res.errCode, 404, 'HTML error code should be set');
    t.ok('Content-Type' in res.headers, 'Content-Type header should be set');
    t.equal(res.headers['Content-Type'], 'text/plain',
      'Content-Type should be text/plain');
    t.equal(res.content, '404', 'should render as just the error code');
    t.end();
  });
});
