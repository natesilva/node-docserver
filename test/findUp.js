var test = require('tap').test
  , findUp = require('../lib/docserver/findUp.js')
  ;


test('find a file in startDir', function(t) {
  findUp('404.md', 'docs/goodbye', 'docs', function(err, result) {
    t.notOk(err, 'should complete without error');
    t.equal(result, 'docs/goodbye/404.md', 'should resolve to 404.md');
    t.end();
  });
});

test('find a file in a parent dir', function(t) {
  findUp('template.html', 'docs/goodbye/cruel/world', 'docs',
    function(err, result)
  {
    t.notOk(err, 'should complete without error');
    t.equal(result, 'docs/goodbye/cruel/template.html',
      'should resolve to template.html');
    t.end();
  });
});

test('look for a file that exists above our stop dir', function(t) {
  findUp('findUp.js', 'docs/goodbye', 'docs', function(err, result) {
    t.notOk(err, 'should complete without error');
    t.notOk(result, 'should not find files outside the stop dir');
    t.end();
  });
});

test('look for a file that does not exist at all', function(t) {
  findUp('foo.bar.baz', 'docs/goodbye/cruel/world', 'docs',
    function(err, result)
  {
    t.notOk(err, 'should complete without error');
    t.notOk(result, 'should not find non-existent files');
    t.end();
  });
});

test('look for a file that occurs multiple times in the tree', function(t) {
  findUp('template.html', 'docs/goodbye/cruel/world', 'docs',
    function(err, result)
  {
    t.notOk(err, 'should complete without error');
    t.equal(result, 'docs/goodbye/cruel/template.html',
      'should find the deepest match');
    t.end();
  });
});

test('look for multiple filenames, only one of which exists', function(t) {
  findUp(['findUp.js', 'foo', 'template.html', 'bar'], 'docs/goodbye', 'docs',
    function(err, result)
  {
    t.notOk(err, 'should complete without error');
    t.equal(result, 'docs/goodbye/template.html',
      'should resolve to template.html');
    t.end();
  });
});

test('look for multiple filenames, which exist in different dirs', function(t) {
  findUp(['404.md', 'hello.md'], 'docs/goodbye', 'docs',
  function(err, result)
  {
    t.notOk(err, 'should complete without error');
    t.equal(result, 'docs/goodbye/404.md',
      'should resolve to the deepest match (404.md)');
    t.end();
  });
});

test('look for multiple filenames, which exist in the same dir', function(t) {
  findUp(['404.md', 'template.html'], 'docs/goodbye', 'docs',
  function(err, result)
  {
    t.notOk(err, 'should complete without error');
    t.equal(result, 'docs/goodbye/404.md',
      'should resolve to the first match (404.md)');
    t.end();
  });
});

test('startDir not a subdir of stopDir should be an error', function(t) {
  findUp('hello.md', 'docs/goodbye', '/tmp', function(err, result) {
    t.ok(err, 'should be an error');
    t.type(err, Error, 'err should be an Error object');
    t.end();
  });
});

test('parent dir shenanigans should not break out of stopDir', function(t) {
  var startDir = 'test/docs/../../test';
  var stopDir = 'test/docs';

  findUp('findUp.js', startDir, stopDir, function(err, result) {
    t.ok(err, 'should be an error');
    t.type(err, Error, 'err should be an Error object');
    t.end();
  });
});