var test = require('tap').test
  , MemoryCache = require('../lib/docserver/memoryCache.js')
  , async = require('async')
  ;


test('save and retrieve a cache value', function(t) {
  var mc = new MemoryCache();
  mc.set('age', 42);
  mc.get('age', function(value) {
    t.equal(value, 42, 'cache value should be what was set');
    t.end();
  });
});

test('delete a cache value', function(t) {
  var mc = new MemoryCache();
  mc.set('age', 42);
  mc.get('age', function(value) {
    t.equal(value, 42, 'cache value should be what was set');
    mc.del('age');
    mc.get('age', function(value) {
      t.notOk(value, 'value should not be set');
      t.end();
    });
  });
});

test('delete one of several cache values', function(t) {
  var mc = new MemoryCache();
  mc.set('age', 42);
  mc.set('country', 'USA');
  mc.set('school', 'Hard Knocks');
  mc.get('age', function(value) {
    t.equal(value, 42, 'cache value should be what was set');
    mc.del('age');
    mc.get('age', function(value) {
      t.notOk(value, 'value should not be set');
      mc.get('school', function(value) {
        t.equal(value, 'Hard Knocks', 'other values should still be set');
        t.end();
      });
    });
  });
});

test('flush (delete) all cache values', function(t) {
  var mc = new MemoryCache();
  mc.set('age', 42);
  mc.set('country', 'USA');
  mc.set('school', 'Hard Knocks');

  mc.flushAll();

  mc.get('age', function(value) {
    t.notOk(value, 'age value should not be set');
    mc.get('country', function(value) {
      t.notOk(value, 'country value should not be set');
      mc.get('school', function(value) {
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
      mc.get(index, function(value) {
        // don't use t.equal because we don't want 10,000 "OK"
        // status messages
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
