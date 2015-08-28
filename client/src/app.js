/*
This file contains the entry point and router for the client side app

All files are transpiled using webpack's babel loader. It handles JSX and ES6 syntax.

If any of the syntax looks weird to you, check out the new ES6 features here: https://github.com/lukehoban/es6features

*/

var React = require('react');

var Router = require('react-router');
var {
  Route,
  DefaultRoute,
  NotFoundRoute,
  RouteHandler,
  Link
} = Router;

var Link = Router.Link;

var HomeView = require('./HomeView');
var MapView = require('./MapView');

var App = React.createClass({
  render () {
    return (
      <div className="app">
        <div className="nav">
          <Link to="home">Choose Route</Link>
        </div>
        <div className="content">
          <RouteHandler/>
        </div>
      </div>
    )
  }
});

var routes = (
  <Route handler={App}>
    <DefaultRoute handler={HomeView}/>
    <Route name="home" path="home" handler={HomeView}/>
    <Route name="map" path="map" handler={MapView}/>
  </Route>
)

Router.run(routes, function(Handler) {
  React.render(<Handler/>, document.getElementById('app'));
});
