var path = require('path');

module.exports = {
  context: __dirname,

  entry: {
    app: './app/assets/sass/application.scss',
    display: './app/assets/sass/display.scss'
  },

  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/',
    filename: '[name].bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.scss/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                path.join(__dirname, 'node_modules/govuk-elements-sass/public/sass'),
                path.join(__dirname, 'node_modules/govuk_frontend_toolkit/stylesheets'),
              ]
            }
          }
        ],
      }
    ]
  }
}
