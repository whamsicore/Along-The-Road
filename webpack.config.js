/*
This file is the webpack configuration to combine all JS files into a bundled version in the dist folder.

It allows us to use CommonJS, ES6 syntax, and JSX.
*/

module.exports = {

  output: {
    filename: "app.js",
  },

  module: {
    loaders: [
      // loader for all .js and .jsx files. It will convert ES6 syntax to ES5 and transpile JSX into JavaScript
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  }
}