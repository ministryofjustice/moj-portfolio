var path = require('path');
var merge = require('merge');
var glob = require('glob');

var defaults = require('./projects/defaults.json');
var files = glob.sync(path.join(__dirname, './projects/*.json'));

var projects = [];

files.forEach(function(file) {
  if (file.endsWith('defaults.json')) return;
  try {
    var json = merge(true, defaults, require(file));
    json.filename = file;
    projects.push(json);
  } catch(err) {
    err.message = `Failed to load ${file}: ${err.message}`;
    throw err;
  }
});

module.exports = projects;
