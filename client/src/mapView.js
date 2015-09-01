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
      routes: [],
      currentRoute: null
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
      zoom: 10,
      center,
    };
    return new google.maps.Map(document.getElementById('map'), mapOptions);
  },

  // this creates a directions route from the start point to the end point
  calcRoute (start, end, map) {
    var directionsService = new google.maps.DirectionsService();
    var component = this;

    // create markers
    new google.maps.Marker({
      position: start,
      map,
      label: 'A'
    });
    new google.maps.Marker({
      position: end,
      map,
      label: 'B'
    });

    var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    };

    // make a directios request to the maps API
    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        console.log(response);
        var routes = [];
        var colors = ['blue', 'red', 'green'];

        // default polyline options
        var defaultOptions = {
          zIndex: 1,
          strokeOpacity: 0.5,
          strokeWeight: 4
        }

        for (var i = 0, len = response.routes.length; i < len; i++) {
          // create a polyline for each suggested route
          var polyLine = new google.maps.Polyline({
            path: response.routes[i].overview_path,
            strokeColor: colors[i],
            map
          });

          polyLine.setOptions(defaultOptions);

          // on the initial load make the first suggestion active
          if (i === 0) {
            component.setState({
              currentRoute: polyLine
            });
          }

          polyLine.addListener('click', function() {
            // revert active route
            if (component.state.currentRoute) {
              component.state.currentRoute.setOptions(defaultOptions);
            }
            // update new route
            component.setState({ currentRoute: this })
          });

          // save the distance and duration of each route for display
          routes.push({
            index: i,
            color: colors[i],
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
    // update display of acitve route
    if (this.state.currentRoute) {
      this.state.currentRoute.setOptions({
        zIndex: 2,
        strokeOpacity: 1,
      });
    };

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
