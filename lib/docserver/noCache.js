
// A "cache" that doesn't actually cache. Useful during dev.

function NoCache() {
  this.cache = {};
}

NoCache.prototype.set = function(key, value, callback) {
  if (callback) { process.nextTick(callback); }
};

NoCache.prototype.get = function(key, callback) {
  if (callback) { process.nextTick(callback); }
};

NoCache.prototype.flushAll = function(callback) {
  if (callback) { process.nextTick(callback); }
};

module.exports = NoCache;
