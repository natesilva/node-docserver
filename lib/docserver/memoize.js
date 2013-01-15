
// memoize a function using the specified cache and hash prefix

function memoize(fn, cache, hashPrefix) {
  return function() {
    // use everything but the callback as the hash key
    var args = Array.prototype.slice.call(arguments);
    var callback = null;
    if (typeof(args[args.length - 1]) === 'function') { callback = args.pop(); }
    var key = hashPrefix + ':' + args;

    cache.get(key, function(err, value) {
      if (err) { return callback(err); }
      if (value) {
        // return memoized result from cache
        if (callback) { callback.apply(null, value); }
      }
      else {
        // value was not in cache; get it, cache it, and return it
        fn.apply(null, args.concat(function() {
          var args = Array.prototype.slice.call(arguments);
          cache.set(key, args);
          if (callback) { callback.apply(null, args); }
        }));
      }
    });
  };
}

module.exports = memoize;
