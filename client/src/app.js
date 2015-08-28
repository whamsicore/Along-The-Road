/*
This file contains the entry point and router for the client side app

All files are transpiled using webpack's babel loader. It handles JSX and ES6 syntax.

If any of the syntax looks weird to you, check out the new ES6 features here: https://github.com/lukehoban/es6features
*/

var React = require('react');

var Router = require('react-router');
var { Route, DefaultRoute, NotFoundRoute, RouteHandler, Link } = Router;

// Import Views
var HomeView = require('./homeView');
var MapView = require('./mapView');

// Import MUI components (material-ui)
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var AppBar = mui.AppBar,
    LeftNav = mui.LeftNav,
    List = mui.List,
    ListItem = mui.ListItem,
    FlatButton = mui.FlatButton,
    TextField = mui.TextField,
    RaisedButton = mui.RaisedButton,
    IconButton = mui.IconButton,
    IconMenu = mui.IconMenu;
    FontIcon = mui.FontIcon;

var Menu = require('material-ui/lib/menus/menu'),
    MenuItem = require('material-ui/lib/menus/menu-item');

// This component includes the navigation between pages and the routehandler
var App = React.createClass({
  render () {
    return (
      <div className="app">
        <div className="nav">
          <Link to="home">Choose Route</Link>
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
    <Route name="map" path="map/:origin/:destination" handler={MapView}/>
    <NotFoundRoute handler={HomeView}/>
  </Route>
)

Router.run(routes, function(Handler) {
  React.render(<Handler/>, document.getElementById('app'));
});
