/*
This view shows the details of the possible routes from origin to destination
*/

var React = require('react');

var RouteDetailView = React.createClass({
  propTypes: {
    routes: React.PropTypes.array.isRequired,
    setCurrentRoute: React.PropTypes.func.isRequired
  },

  render () {
    var component = this;
    var routeDetails = this.props.routes.map(function(route, index) {
      return (
        <div onClick={function(){component.props.setCurrentRoute(index)}} key={index}>
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