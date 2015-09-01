/*
This view shows the details of the possible routes from origin to destination
*/

var React = require('react');

var RouteDetailView = React.createClass({
  propTypes: {
    routes: React.PropTypes.array.isRequired
  },

  render () {
    var routeDetails = this.props.routes.map(function(route) {
      return (
        <div key={route.index}>
          {route.distance} -> {route.duration}
        </div>
      )
    });

    return (
      <div> {routeDetails} </div>
    );
  }
});

module.exports = RouteDetailView;