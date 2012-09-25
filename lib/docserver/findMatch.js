var path = require('path')
  , fs = require('fs')
  , async = require('async')
  ;

// Given a requested target, find a matching doc file.
//
// If the target doesn't exist, try appending various extensions to
// the name, or look for a directory of the same name with an index
// file.
//
// target (String) - The requested file
// extensions (Array, optional) - Extensions, including leading dot,
//  to try appending to the target name (default: ['.md', '.mdown'])
// callback (Function) - Receives the path of the actual file, or
//  null if no match was found

function findMatch(target, extensions, callback) {
  var args = Array.prototype.slice.call(arguments);
  callback = args.pop();
  extensions = args[1] || ['.md', '.mdown'];
  target = path.normalize(args[0]);

  var potentials = [];
  var ext = path.extname(target);

  if (extensions.indexOf(ext) === -1) {
    // try the target with various file extensions appended
    potentials = potentials.concat(extensions.map(function(extension) {
      return target + extension;
    }));
  } else {
    // target has a known extension
    potentials.push(target);
  }

  // also check if target is a directory name with an index file
  potentials = potentials.concat(extensions.map(function(extension) {
    return path.join(target, 'index' + extension);
  }));

  // which of these exist?
  async.detectSeries(potentials, fs.exists, function(result) {
    callback(null, result);
  });
}

module.exports = findMatch;
