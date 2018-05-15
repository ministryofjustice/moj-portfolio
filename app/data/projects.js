var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var merge = require('merge');
var glob = require('glob');
var _ = require('lodash');

var theme_order = ['HQ', 'UCPD', 'Cross Justice', 'HMCTS and pre-court', 'Run & Maintain'];
var phase_order = ['Prediscovery','Discovery','Consultancy','Delivery'];

function nestedGroupBy(data, keys) {
  var grouped = {};
  data.forEach((item) => {
    _.update(grouped,
      keys.map((k) => item[k]).join('.'),
      (val) => val ? (val.push(item), val) : [item]
    );
  });
  return grouped;
}

var defaults = loadYamlFile('./projects/defaults.yml');
var files = glob.sync(path.join(__dirname, './projects/*.yml'));

var projects = [];

files.forEach(function(file) {
  if (file.endsWith('defaults.yml')) return;
  try {
    var data = merge(true, defaults, loadYamlFile(file));
    data.filename = file;
    projects.push(data);
  } catch(err) {
    err.message = `Failed to load ${file}: ${err.message}`;
    throw err;
  }
});

function loadYamlFile(filename) {
  return yaml.safeLoad(fs.readFileSync(require.resolve(filename), 'utf8'));
}

exports.raw = projects;

exports.themes = theme_order;
exports.phases = phase_order;
exports.locations = _.chain(projects).map('location').uniq().value();

exports.counts = _.countBy(projects, 'phase');

exports.byThemePhase =
  nestedGroupBy(projects, ['theme', 'phase']);
exports.byLocationPhase =
  nestedGroupBy(projects, ['location', 'phase']);

exports.getById = (id) => _.find(projects, {id});
