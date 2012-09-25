
// A very simple in-memory cache for memoizing the results of
// docserver requests.

function MemoryCache() {
  this.cache = {};
}

MemoryCache.prototype.set = function(key, value, callback) {
  this.cache[key] = value;
  if (callback) { process.nextTick(callback); }
};

MemoryCache.prototype.get = function(key, callback) {
  var self = this;
  process.nextTick(function() { callback(null, self.cache[key]); });
};

MemoryCache.prototype.del = function(key, callback) {
  delete this.cache[key];
  if (callback) { process.nextTick(callback); }
};

MemoryCache.prototype.flushAll = function(callback) {
  this.cache = {};
  if (callback) { process.nextTick(callback); }
};

module.exports = MemoryCache;
