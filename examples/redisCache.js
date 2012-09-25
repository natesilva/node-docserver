
// How you might use Redis as a cache instead of the default
// in-memory cache. You would pass this (the class, not an instance)
// as the "cache" option when creating your docserver. See
// serveRedis.js for an example.

var redis = require('redis');

function RedisCache() {
  this.client = redis.createClient();
  // keep track of keys so we know what to delete in flushAll
  this.keys = [];
}

RedisCache.prototype.set = function(key, value, callback) {
  this.keys.push(key);
  this.client.set(key, JSON.stringify(value), function() {
    if (callback) { callback(); }
  });
};

RedisCache.prototype.get = function(key, callback) {
  this.client.get(key, function(err, value) {
    if (err) { return callback(err); }
    callback(null, JSON.parse(value));
  });
};

RedisCache.prototype.flushAll = function(callback) {
  var self = this;
  this.keys.forEach(function(key) {
    self.client.del(key);
  });
  this.keys = [];
};

module.exports = RedisCache;
