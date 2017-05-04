var path = require('path');
var express = require('express');
var expressNunjucks = require('express-nunjucks');

var routes = require('./app/routes.js');
var dis_routes = require('./app/views/display/routes.js');
var favicon = require('serve-favicon');

var app = express();

var port = process.env.PORT || 3100;
var dev = process.env.NODE_ENV !== 'production';

app.set('view engine', 'html');
app.set('views', [
  path.join(__dirname, '/app/views/'),
  path.join(__dirname, '/lib/')
]);

// Middleware to serve static assets
[
  '/public',
  '/node_modules/govuk_template_mustache/assets',
  '/node_modules/govuk_frontend_toolkit'
].forEach((folder) => {
  app.use('/public', express.static(path.join(__dirname, folder)));
});

var nunjucks = expressNunjucks(app, {
    autoescape: true,
    watch: dev
});
nunjucks.env.addFilter('slugify', function(str) {
    return str.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()’]/g,"").replace(/ +/g,'_').toLowerCase();
});
nunjucks.env.addFilter('formatDate', function(str,format) {
    return moment(str).format(format);
});
nunjucks.env.addFilter('log', function log(a) {
  var nunjucksSafe = env.getFilter('safe');
	return nunjucksSafe('<script>console.log(' + JSON.stringify(a, null, '\t') + ');</script>');
});

// Elements refers to icon folder instead of images folder
app.use(favicon(path.join(__dirname, 'node_modules', 'govuk_template_mustache', 'assets', 'images','favicon.ico')));

// send assetPath to all views
app.use(function (req, res, next) {
  res.locals.asset_path="/public/";
  next();
});

app.use("/", dis_routes);
app.use("/", routes);

// start the app
app.listen(port);

console.log('');
console.log('Listening on port ' + port);
console.log('');
