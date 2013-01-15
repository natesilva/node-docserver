
// How you might use Redis as a cache instead of the default
// in-memory cache. You would pass this (the class, not an instance)
// as the "cache" option when creating your docserver. See
// serveRedis.js for an example.
//
// If you cache in Redis, the cached data will persist between
// restarts of docserver. This is not desirable, as it will prevent
// docserver from re-rendering any documents that have changed (the
// previously-cached version would be served, even after the server
// is restarted).
//
// To deal with this, in the example below the get() method only
// returns a cached value if it is for a key that we have seen since
// the server was started. This prevents stale data in Redis from
// being served after a restart.

var redis = require('redis')
  , assert = require('assert')
  ;

function RedisCache() {
  this.client = redis.createClient();
  // keep track of keys so we know what to delete in flushAll
  this.keys = [];
  this.ttl = 86400;
}

RedisCache.prototype.set = function(key, values, callback) {
  this.keys.push(key);
  assert(Array.isArray(values));  // always an array

  // serialize
  var serialized = values.map(function(value) {
    if (Buffer.isBuffer(value)) {
      return ['Buffer', value.toString('base64') ];
    } else {
      return [null, value ];
    }
  });

  this.client.setex(key, this.ttl, JSON.stringify(serialized), callback);
};

RedisCache.prototype.get = function(key, callback) {
  if (this.keys.indexOf(key) === -1) { return callback(null); }

  this.client.get(key, function(err, json) {
    if (err) { return callback(err); }
    var serialized = JSON.parse(json);
    var result = serialized.map(function(value) {
      if (value[0] === 'Buffer') { return new Buffer(value[1], 'base64'); }
      else { return value[1]; }
    });
    callback(null, result);
  });
};

RedisCache.prototype.flushAll = function() {
  var self = this;
  this.keys.forEach(function(key) {
    self.client.del(key);
  });
  this.keys = [];
};

module.exports = RedisCache;
