var React = require('react');

var MapView = React.createClass({

  propTypes: {

  },

  defaultOptions: {

  },
  componentDidMount () {
    console.log("MapView ---> inside componentDidMount");
    // QueryStore.addChangeListener(this._onChange)
  },

  componentDidUpdate(prevProps, prevState) {
    console.log("MapView ---> inside componentDidUpdate");

  },

  //Gets the previous number of waypoints and the new number to be querried
  _onChange () {

  },

  render () {
    // var component = this;

    // var listDetails = VenueStore.getVenues().map(function(venue, index) {
    //   return (
    //     <VenueView venue={venue}/>
    //   )
    // });

    return (
      <div id = "map">  </div>
    );
  }
});

module.exports = MapView;