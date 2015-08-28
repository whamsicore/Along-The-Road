/*
This component is the home view. It allows the user to input his/her travel route
*/

var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

var HomeView = React.createClass({
  render () {
    return (
      <div>
        Welcome to the HomeView
        <Link to="map">Go to MapView</Link>
      </div>
    )
  }
})

module.exports = HomeView;