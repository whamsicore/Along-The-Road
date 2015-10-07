/*
This file contains the entry point and router for the client side app

All files are transpiled using webpack's babel loader. It handles JSX and ES6 syntax.

If any of the syntax looks weird to you, check out the new ES6 features here: https://github.com/lukehoban/es6features
*/

var React = require('react');

var Router = require('react-router');
var { Route, DefaultRoute, NotFoundRoute, RouteHandler, Link } = Router;

// Import Views
var HomeView = require('./views/homeView');
var OverView = require('./views/overView');

// This component includes the navigation between pages and the routehandler
var App = React.createClass({
  render () {
    return (
      <div className="app">
        <div id="title">
          <div>
            <h1>
              <Link to='home'> {/* Clicking logo will now lead back to homeView */}
                <img className="logo" src="./img/logo.gif" href="home"/>
              </Link>
            </h1>
          </div>
        </div>

        <div className="content">
          <RouteHandler />
        </div>
      </div>
    )
  }
});

// define all routes for router
var routes = (
  <Route handler={App}>
    <DefaultRoute handler={HomeView}/>
    <Route name="home" path="home" handler={HomeView}/>
    <Route name="overview" path="overview/:origin/:destination" handler={OverView}/>
    <NotFoundRoute handler={HomeView}/>
  </Route>
)

window.reactRouter = Router.run(routes, function(Handler) {
  React.render(<Handler/>, document.getElementById('app'));
});
