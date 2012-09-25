var findUp = require('./findUp.js')
  , render = require('./render.js')
  ;


function genericError(errCode, callback) {
  var headers = {'Content-Type': 'text/plain'};
  var text = errCode.toString();
  callback(null, headers, text);
}

// Look for an error template Markdown file (for example, 404.md)
// and render it.
//
// errCode (Number) - The error code
// targetDir (String) - The directory where the error occurred (used
//  to select the proper template.html file and error Markdown file)
// baseDir (String) - docs dir (options.dir from the middleware)
// extensions (Array) - options.extensions from the middleware
// callback (Function) - Receives headers array and body to be sent
//  back to the client. Calling function is responsible for sending
//  the response.

function renderError(errCode, targetDir, baseDir, extensions, callback) {
  var candidates = extensions.map(function(extension) {
    return errCode.toString() + extension;
  });

  findUp(candidates, targetDir, baseDir, function(err, result) {
    if (err || !result) { return genericError(errCode, callback); }

    render(result, baseDir, function(err, html) {
      if (err) { return genericError(errCode, callback); }
      var headers = {'Content-Type': 'text/html; charset=UTF-8'};
      if (callback) {  callback(null, headers, html); }
    });
  });
}

module.exports = renderError;
