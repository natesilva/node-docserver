var path = require('path')
  , fs = require('fs')
  , util = require('util')
  , async = require('async')
;


// Given a requested filespec, find it in the specified directory.
// If it isn't there, walk up to each parent directory looking for
// it. The search stops when a matching file is found, or after the
// stop directory is reached.
//
// In other words, this looks for a file analogous to how Apache
// locates .htaccess files.
//
// filespec (String or Array) - The file name(s) to look for
// startDir (String) - The directory from which to start searching.
// stopDir (String) - Keep searching up the directory tree until we
//  find a match, or reach this parent directory (inclusive), then
//  stop.
// callback (Function) - Receives the path of file, or null if no
//  match was found.

function findUp(filespec, startDir, stopDir, callback) {
  startDir = path.normalize(startDir);
  stopDir = path.normalize(stopDir);

  if (startDir.slice(0, stopDir.length) !== stopDir) {
    return callback(new Error('startDir must be a subdirectory of stopDir'));
  }

  if (!util.isArray(filespec)) { filespec = [filespec]; }

  var potentials = [];

  var dir = startDir;
  while (dir.slice(0, stopDir.length) === stopDir) {
    for (var index = 0; index < filespec.length; ++index) {
      potentials.push(path.join(dir, filespec[index]));
    }
    dir = path.normalize(path.join(dir, '..'));
  }

  async.detectSeries(potentials, fs.exists, function(result) {
    callback(null, result);
  });
}

module.exports = findUp;
