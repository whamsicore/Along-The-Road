/*
This component is the map view. It shows the user the possible routes he/she can take to arrive at the destination
*/

var React = require('react');

var Router = require('react-router');

var MapView = React.createClass({
  propTypes: {
    origin: React.PropTypes.string.isRequired,
    destination: React.PropTypes.string.isRequired,
    setPath: React.PropTypes.func.isRequired,
  },

  render () {
    return (
      <div>
        Welcome to the MapView: You requested to go from {this.props.origin} to {this.props.destination}!
      </div>
    )
  }
})

module.exports = MapView;