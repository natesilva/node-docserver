var test = require('tap').test
  , helpers = require('../lib/docserver/helpers.js')
  ;


test('"merge" one object', function(t) {
  var a = { one: 1, two: 2 };

  var merged = helpers.merge(a);

  t.equal(merged.one, 1);
  t.equal(merged.two, 2);
  t.notOk(merged.three);
  t.end();
});

test('merge two objects', function(t) {
  var a = { one: 1, two: 2 };
  var b = { three: 3 };

  var merged = helpers.merge(a, b);

  t.equal(merged.one, 1);
  t.equal(merged.two, 2);
  t.equal(merged.three, 3);
  t.end();
});

test('merge overlapping objects', function(t) {
  var a = { one: 1, two: 2 };
  var b = { two: 'too', three: 3 };

  var merged = helpers.merge(a, b);

  t.equal(merged.one, 1);
  t.equal(merged.two, 'too');
  t.equal(merged.three, 3);
  t.end();
});

test('merge three objects', function(t) {
  var a = { one: 1, two: 2 };
  var b = { three: 3 };
  var c = { two: 'too', four: 4};

  var merged = helpers.merge(a, b, c);

  t.equal(merged.one, 1);
  t.equal(merged.two, 'too');
  t.equal(merged.three, 3);
  t.equal(merged.four, 4);
  t.end();
});
