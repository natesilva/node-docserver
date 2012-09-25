var test = require('tap').test
  , MemoryCache = require('../lib/docserver/memoryCache.js')
  , async = require('async')
  ;


test('save and retrieve a cache value', function(t) {
  var mc = new MemoryCache();
  mc.set('age', 42);
  mc.get('age', function(err, value) {
    t.notOk(err, 'should complete without error');
    t.equal(value, 42, 'cache value should be what was set');
    t.end();
  });
});

test('flush (delete) all cache values', function(t) {
  var mc = new MemoryCache();
  mc.set('age', 42);
  mc.set('country', 'USA');
  mc.set('school', 'Hard Knocks');

  mc.flushAll();

  mc.get('age', function(err, value) {
    t.notOk(err, 'should complete without error');
    t.notOk(value, 'age value should not be set');
    mc.get('country', function(err, value) {
      t.notOk(err, 'should complete without error');
      t.notOk(value, 'country value should not be set');
      mc.get('school', function(err, value) {
        t.notOk(err, 'should complete without error');
        t.notOk(value, 'school value should not be set');
        t.end();
      });
    });
  });
});

test('set many values', function(t) {
  var mc = new MemoryCache();

  var iterations = 10000;

  for (var index = 0; index < iterations; ++index) {
    mc.set(index, 'hello ' + index.toString());
  }

  index = 0;
  async.whilst(
    function() { return index < iterations; },
    function(callback) {
      mc.get(index, function(err, value) {
        // don't use t.* because we don't want thousands of "OK"
        // status messages
        if (err) {
          t.ok(false, 'should complete without error');
        }
        if (value !== 'hello ' + index.toString()) {
          t.ok(false, 'value should remain as set');
        }
        ++index;
        callback();
      });
    },
    function(err) {
      t.notOk(err, 'should complete without error');
      t.end();
    }
  );
});
