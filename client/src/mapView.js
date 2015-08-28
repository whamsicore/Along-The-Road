/*
This component is the map view. It shows the user the possible routes he/she can take to arrive at the destination
*/

var React = require('react');

var MapView = React.createClass({
  // adds access to the router context. the getCurrentParams method can then be used to get the properties from the route
  contextTypes: {
    router: React.PropTypes.func
  },

  // this is called after the first reder of the component
  componentDidMount () {
    var {origin, destination} = this.context.router.getCurrentParams();

    var start = this.getLatLong(origin);
    var end = this.getLatLong(destination);

    var map = this.initializeMap(start);
    this.calcRoute(start, end, map);
  },

  // turns a lat/long string into a google maps LatLong Object
  getLatLong (location) {
    return new google.maps.LatLng(location.split(',')[0], location.split(',')[1]);
  },

  // initializes a map and attaches it to the map div
  initializeMap (center) {
    var mapOptions = {
      zoom: 8,
      center,
    };
    return new google.maps.Map(document.getElementById('map'), mapOptions);
  },

  // this creates a directions route from the start point to the end point
  calcRoute (start, end, map) {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    var directionsService = new google.maps.DirectionsService();

    var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);
      }
    });
  },

  render () {
    return (
      <div>
        Welcome to the MapView!
        <div id="map"></div>
      </div>
    )
  }
})

module.exports = MapView;
