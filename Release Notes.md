# node-docserver Release Notes

## 0.1.4 – 2013-01-15

* The “extensions” and “passthrough” options now actually work as documented.
* Caching using Redis is improved (see the `redisCache.js` and `serveRedis.js` examples).


## 0.1.3 – 2012-09-27

* Custom 404 documents are now served for the root (/) URL if appropriate.
* New “passthrough” option allows files with specified extensions to be served directly without being handled as Markdown.

## 0.1.2 – 2012-09-26

* Caching can be disabled by passing `false` as the `cache` option.
