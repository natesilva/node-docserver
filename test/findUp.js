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
  findUp('template.html', 'docs/goodbye', 'docs', function(err, result) {
    t.notOk(err, 'should complete without error');
    t.equal(result, 'docs/template.html', 'should resolve to template.html');
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

test('look for multiple filenames, only one of which exists', function(t) {
  findUp(['findUp.js', 'foo', 'template.html', 'bar'], 'docs/goodbye', 'docs',
  function(err, result)
  {
    t.notOk(err, 'should complete without error');
    t.equal(result, 'docs/template.html', 'should resolve to template.html');
    t.end();    
  });
});

test('look for multiple filenames, which exist in different dirs', function(t) {
  findUp(['404.md', 'template.html'], 'docs/goodbye', 'docs',
  function(err, result)
  {
    t.notOk(err, 'should complete without error');
    t.equal(result, 'docs/goodbye/404.md',
      'should resolve to the deepest match (404.md)');
    t.end();    
  });
});

test('look for multiple filenames, which exist in the same dir', function(t) {
  findUp(['hello.md', 'template.html'], 'docs/goodbye', 'docs',
  function(err, result)
  {
    t.notOk(err, 'should complete without error');
    t.equal(result, 'docs/hello.md',
      'should resolve to the first match (hello.md)');
    t.end();    
  });
});
