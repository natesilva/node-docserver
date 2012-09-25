var path = require('path')
  , fs = require('fs')
  , marked = require('marked')
  , findUp = require('./findUp.js')
  ;


var BASIC_TEMPLATE = '<html><head><title>{{{ title }}}</title></head>' +
  '<body>{{{ markdown }}}</body></html>';

var TAGS = {
  'title': /\{\{\{\ *title\ *\}\}\}/,
  'markdown': /\{\{\{\ *markdown\ *\}\}\}/
};

var FIRST_TAG_CONTENT = /\>\s*(\w[^<]+)<\//;

// Replace special {{{ tags }}} found in the HTML template with the
// corresponding replacement text.

function replaceTags(html, replacements) {
  for (var key in TAGS) {
    if (TAGS.hasOwnProperty(key) && key in replacements) {
      html = html.replace(TAGS[key], replacements[key]);
    }
  }
  return html;
}

// Render the specified target from Markdown to HTML.
//
// target (String) - Path to the Markdown document to be rendered
// options (Object) - Options object as received by the middleware

function render(target, options, callback) {
  findUp('template.html', path.dirname(target), options.dir,
    function(err, template)
  {
    if (err) { return callback(err); }

    fs.readFile(target, function(err, data) {
      if (err) { return callback(err); }

      var replacements = {};
      replacements.markdown = marked(data.toString());

      // for the title, get the contents of the first HTML tag
      replacements.title = 'Untitled';
      var match = replacements.markdown.match(FIRST_TAG_CONTENT);
      if (match) { replacements.title = match[1].trim(); }

      if (template) {
        fs.readFile(template, function(err, data) {
          if (err) { return callback(err); }
          callback(null, replaceTags(data.toString(), replacements));
        });
      } else {
        callback(null, replaceTags(BASIC_TEMPLATE, replacements));
      }
    });
  });
}

module.exports = render;
