var findUp = require('./findUp.js')
  , render = require('./render.js')
  ;


function genericError(errCode, res) {
  res.writeHead(errCode, {'Content-Type': 'text/plain'});
  res.end(errCode.toString());
}

// Look for an error template Markdown file (for example, 404.md)
// and render it.
//
// errCode (Number) - The error code
// res (Object) - The ServerResponse object
// targetDir (String) - The directory where the error occurred (used
//  to select the proper template.html file and error Markdown file)
// options (Object) - Options object as received by the middleware
// callback (Function) - Optional function to be called when done

function handleError(errCode, res, targetDir, options, callback) {
  var candidates = options.extensions.map(function(extension) {
    return errCode.toString() + extension;
  });

  findUp(candidates, targetDir, options.dir, function(err, result) {
    if (err || !result) {
      genericError(errCode, res);
      if (callback) { callback(null); }
      return;
    }

    render(result, options, function(err, html) {
      if (err) {
        genericError(errCode, res);
        if (callback) { callback(null); }
        return;
      }
      res.writeHead(errCode, {'Content-Type': 'text/html; charset=UTF-8'});
      res.end(html);
      if (callback) { callback(null); }
    });
  });
}

module.exports = handleError;
