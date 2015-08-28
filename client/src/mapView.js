/*
This component is the map view. It shows the user the possible routes he/she can take to arrive at the destination
*/

var React = require('react');

var MapView = React.createClass({
  /*
   proptypes provide a way of checking the passed in properties.
   They throw a warning in the console if not provided correctly.
   It has no effect on the execution of the program
  */
  propTypes: {
    origin: React.PropTypes.object.isRequired,
    destination: React.PropTypes.object.isRequired,
    setOrigin: React.PropTypes.func.isRequired,
    setDestination: React.PropTypes.func.isRequired,
  },

  contextTypes: {
    router: React.PropTypes.func
  },

  render () {
    var {origin, destination} = this.context.router.getCurrentParams();

    return (
      <div>
        Welcome to the MapView: You requested to go from {origin} to {destination}!
      </div>
    )
  }
})

module.exports = MapView;