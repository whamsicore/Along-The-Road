/*
This file contains the entry point and router for the client side app

All files are transpiled using webpack's babel loader. It handles JSX and ES6 syntax.

If any of the syntax looks weird to you, check out the new ES6 features here: https://github.com/lukehoban/es6features

*/

var React = require('react');

var App = React.createClass({
  render () {
    return (
      <div>
        Hello World!
      </div>
    )
  }
});

React.render(<App />, document.getElementById('app'));