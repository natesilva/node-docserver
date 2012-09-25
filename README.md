# node-docserver

Serves Markdown documents as static content. Acts as middleware for Connect (Express) and Union (Flatiron).

Use this to serve a folder full of Markdown documents (and its sub-folders) as though they were static content.

## Features

* Handles Github-Flavored Markdown, using the `marked` package.
* Per-directory template support.
* In-memory caching that can easily be replaced by a custom cache module (e.g., Redis)
* Can handle requests for an entire site, or just one subdirectory of a site.
* Command-line utility serves the current directory for quick and easy local documentation browsing.

# Example

See Connect, Union, plain, and Redis examples in the `examples` and `bin` subdirectories.

## Using Express

``` js
var express = require('express')
  , docserver = require('docserver')
  ;

var app = express();
app.use(docserver({
  dir: __dirname + '/docs',  // serve Markdown files in the docs directory...
  url: '/'}                  // ...and serve them at the root of the site
));
app.listen(3000);

console.log(docserver.version + ' listening on port 3000');
```

# Mapping of URLs to Markdown files

Place Markdown files with the extensions `.md` or `.mdown` in your docs directory. (You can override these file extensions; see below for details.) Organize the directory any way you like, with any number of subdirectories.

Each directory can have an `index.md` (or `index.mdown`) file that will be served if the user requests the directory name.

# Template support

A `template.html` file, if present in the same directory as a Markdown document, will be used to format that document. You can have multiple templates: `docserver` will search parent directories up the directory tree to find the nearest `template.html` and use that.

This allows you to have a default template, and override with custom templates in each subdirectory.

# Directory structure example
For this example, assume the following directory structure:

```
docs/
|
-- index.md
|
-- README.md
|
-- template.html
|
-- api/
   |
   -- index.md
   |
   -- template.html
   |
   -- v1.0/
      |
      -- index.md
```

## Example URLs

Given the “Using Express” example code and the directory structure shown above, a request for `http://localhost:3000/` would return `docs/index.md` (converted to HTML, of course).

File extensions are handled automatically. In this example, the README file can be requested as `http://localhost:3000/README` or `http://localhost:3000/README.md`.

Likewise, the `api/index.md` file can be requested as `http://localhost:3000/api/`, `http://localhost:3000/api/index.md`, or even `http://localhost:3000/api/index`.

## Example Templates

The file `docs/index.md` is served using the template file `docs/template.html`.

The file `docs/api/index.md` would be served using the template file `docs/api/template.html`.

The file `docs/api/v1.0/index.md` is in a directory that does not have a template file. In this case, `docserver` will search up the directory tree until it finds a template. This file would be served using the template file `docs/api/template.html`.

(If `docserver` can find no template for a document, it will be served as a bare-bones HTML file.)

# API

## docserver(options)

Returns the `docserver` middleware, which is compatible with Connect, Express, Union and Flatiron.

### Options when creating an instance of the docserver middleware

#### dir

The directory where your Markdown documents are located.

example: `{ dir: __dirname + '/docs' }`

#### url

The URL from which your documents should be served.

example (`docserver` handles the root level of the web site): `{ url: '/' }`

example (`docsever` handles URLs under `/docs`): `{ url: '/docs/' }`

#### extensions

Markdown files with these extensons will be served.

example: `{extensions: ['.markdown', '.md']}`

> Defaults to `['.md', '.mdown']`

#### headers

Add additional HTTP headers to the output.

example: `{headers: {'Cache-Control': 'public,max-age=3600'}}`

#### cache

Override the caching subsystem. The default uses an in-memory cache. No other subsystems are provided, but it’s not too hard to write your own. (There is an example using Redis in the `examples` subdirectory.)

example: `{cache: YourCacheClass}`

#### watch

If `true`, `docserver` will watch your documents `dir` for changes. If any files are added, removed, or changed, the cache will be flushed.

This means you do not have to restart the server if you change any of your documents or templates.

This feature is experimental and **off** by default.

example: `{watch: true}`

> Defaults to `false`

# Error documents

When an HTTP error occurs, `docserver` will look for a document matching the error number, using the same logic that is used to find templates. Currently only `404` errors are supported this way.

For example, to have a custom `404` error page, create a `404.md` file. It will be converted to HTML and served using `template.html` just like any other Markdown file would be.

Like templates, you can have custom `404.md` error documents in each subdirectory and `docserver` will use the nearest one when serving an error.

# FAQ

## Q: How do I add a Cache-Control header?

Use the `headers` option:

```
var middleware = docserver({
	headers: {'Cache-Control': 'public,max-age=3600'},
	// other options…
});
```
