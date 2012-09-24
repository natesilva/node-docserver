var test = require('tap').test
  , findMatch = require('../lib/docserver/findMatch.js')
  ;


test('resolve a target that has no extension', function(t) {
  findMatch('docs/hello', function(err, result) {
    t.notOk(err, 'should complete without error');
    t.equal(result, 'docs/hello.md', 'should resolve to hello.md');
    t.end();
  });
});

test('resolve a target that has a known extension', function(t) {
  findMatch('docs/goodbye/cruel/world/index.mdown', function(err, result) {
    t.notOk(err, 'should complete without error');
    t.equal(result, 'docs/goodbye/cruel/world/index.mdown',
      'should resolve to index.mdown');
    t.end();
  });
});

test('resolve a target that is a directory', function(t) {
  findMatch('docs/goodbye/cruel/world', function(err, result) {
    t.notOk(err, 'should complete without error');
    t.equal(result, 'docs/goodbye/cruel/world/index.mdown',
      'should resolve to index.mdown');
    t.end();
  });
});

test('resolve a target that does not exist', function(t) {
  findMatch('docs/foo', function(err, result) {
    t.notOk(err, 'should complete without error');
    t.notOk(result, 'result should be empty');
    t.end();
  });
});

test('resolve a target with a leading dot', function(t) {
  findMatch('./docs/hello', function(err, result) {
    t.notOk(err, 'should complete without error');
    t.equal(result, 'docs/hello.md',
      'should resolve to hello.md without a dot (normalized)');
    t.end();
  });
});


test('resolve a non-existing target with an unknown extension', function(t) {
  findMatch('./docs/hello.getdown', function(err, result) {
    t.notOk(err, 'should complete without error');
    t.notOk(result, 'result should be empty');
    t.end();
  });
});

test('resolve an existing target with an unknown extension', function(t) {
  findMatch('./docs/goodbye/template.html', function(err, result) {
    t.notOk(err, 'should complete without error');
    t.notOk(result, 'result should be empty');
    t.end();
  });
});
