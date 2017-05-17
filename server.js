var path = require('path');
var express = require('express');
var expressNunjucks = require('express-nunjucks');
var morgan = require('morgan');
var favicon = require('serve-favicon');

var app = express();

var port = process.env.PORT || 3100;
var dev = process.env.NODE_ENV !== 'production';

app.set('view engine', 'html');
app.set('views', [
  path.join(__dirname, '/app/views/'),
  path.join(__dirname, '/lib/')
]);

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

app.use(morgan('dev'));

app.use(favicon(path.join(__dirname, 'node_modules', 'govuk_template_mustache', 'assets', 'images','favicon.ico')));

if (dev) {
  var webpack = require('webpack');
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackConfig = require('./webpack.config');

  var compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath
  }));
  console.log('Webpack compilation enabled');

  var chokidar = require('chokidar');
  chokidar.watch('./app', {ignoreInitial: true}).on('all', (event, path) => {
    console.log("Clearing /app/ module cache from server");
    Object.keys(require.cache).forEach(function(id) {
      if (/[\/\\]app[\/\\]/.test(id)) delete require.cache[id];
    });
  });
}

// Middleware to serve static assets
[
  '/public',
  '/app/assets',
  '/node_modules/govuk_template_mustache/assets',
  '/node_modules/govuk_frontend_toolkit'
].forEach((folder) => {
  app.use('/public', express.static(path.join(__dirname, folder)));
});

// send assetPath to all views
app.use(function (req, res, next) {
  res.locals.asset_path = "/public/";
  next();
});

app.use("/", function(req, res, next) {
  require('./app/routes.js')(req, res, next);
});

// start the app
app.listen(port, () => {
  console.log('Listening on port ' + port);
});

