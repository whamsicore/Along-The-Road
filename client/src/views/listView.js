/*
This view shows the details of the possible routes from origin to destination
*/

var React = require('react');
var VenueView = require('./venueView');

var Actions = require('../actions/Actions.js');
var QueryStore = require('../stores/QueryStore');
var VenueStore = require('../stores/VenueStore');


var ListView = React.createClass({

  propTypes: {

  },

  defaultOptions: {


  },
  componentDidMount () {
    console.log("listView -----> componentDidMount()");

    // QueryStore.addChangeListener(this._onChange)
  },

  componentDidUpdate(prevProps, prevState) {
    // if (this.props.currentRoute.wayPoints.length && !this.props.currentRoute.results.length && QueryStore.prevWaypoints()==21) {
    //   this.queryFourSquare(1, 21);
    // }
  },

  //Gets the previous number of waypoints and the new number to be querried
  // _onChange () {
  //   var waypoints = QueryStore.getWaypoints();
  //   // if (this.props.currentRoute.wayPoints.length && !this.props.currentRoute.results.length) {
  //   this.queryFourSquare(waypoints);
  //   // }
  // },

  render () {
    var component = this;

    var listDetails = VenueStore.getVenues().map(function(venue, index) {
      return (
        <VenueView venue={venue}/>
      )
    });

    return (
      <div> {listDetails} </div>
    );
  }
});

module.exports = ListView;