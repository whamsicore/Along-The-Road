/*
This component is the map view. It shows the user the possible routes he/she can take to arrive at the destination
*/

var React = require('react');

var MapView = React.createClass({
  // adds access to the router context. the getCurrentParams method can then be used to get the properties from the route
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState () {
    return {
      routes: []
    }
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
    var directionsService = new google.maps.DirectionsService();
    var component = this;

    var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    };
    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        console.log(response);
        var routes = [];
        var colors = ['blue', 'red', 'green'];

        for (var i = 0, len = response.routes.length; i < len; i++) {

          // apply special properties to first route
          var zIndex = i? 1 : 2;
          // var strokeWeight = i? 5 : 3;
          var strokeOpacity = i? 0.5 : 1;

          new google.maps.DirectionsRenderer({
              map: map,
              directions: response,
              routeIndex: i,
              polylineOptions: {
                strokeColor: colors[i],
                zIndex,
                // strokeWeight,
                strokeOpacity
              },
          });

          routes.push({
            index: i,
            distance: response.routes[i].legs[0].distance.text,
            duration: response.routes[i].legs[0].duration.text,
          });
        }

        component.setState({
          routes
        });
      }
    });
  },

  render () {
    var routeDetails = this.state.routes.map(function(route) {
      return (
        <div>
          {route.distance} -> {route.duration}
        </div>
      )
    });
    console.dir(routeDetails)

    return (
      <div>
        Welcome to the MapView!
        <div id="map"></div>
        {routeDetails}
      </div>
    )
  }
})

module.exports = MapView;
