/*
This component is the map view. It shows the user the possible routes he/she can take to arrive at the destination
*/

var React = require('react');
var RouteDetailView = require('./routeDetailView')
var ListView = require('./listView')

var MapView = React.createClass({
  // adds access to the router context. the getCurrentParams method can then be used to get the properties from the route
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState () {
    return {
      routes: [],
      currentRoute: null,
      routingBoxes: []
    }
  },

  // this is called after the first reder of the component
  componentDidMount () {
    var {origin, destination} = this.context.router.getCurrentParams();

    var start = this.getLatLong(origin);
    var end = this.getLatLong(destination);

    var map = this.initializeMap(start);
    this.setState({
      map: map
    });
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
    }; //request

    // make a directios request to the maps API
    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) { //.OK indicates the response contains a valid DirectionsResult.
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

          // add properties to each polyline
          polyLine.path = response.routes[i].overview_path;
          polyLine.color = colors[i];
          polyLine.distance = response.routes[i].legs[0].distance.text;
          polyLine.duration = response.routes[i].legs[0].duration.text;

          // save polylines for later use
          routes.push(polyLine);

          console.log(polyLine);

          polyLine.setOptions(defaultOptions);


          // on the initial load make the first suggestion active
          if (i === 0) {
            component.setState({
              currentRoute: polyLine,
              // currentPath: response.routes[i].overview_path //test
            });
          } //if

          polyLine.addListener('click', function() {
            // revert active route
            if (component.state.currentRoute) {
              component.state.currentRoute.setOptions(defaultOptions);
            }
            // update new route to be the clicked polyline
            component.setState({
              currentRoute: this
            });

            component.updateRoutingBoxes();
          });

        } //for(each route)

        component.setState({
          routes
        });

        /**** Routing Box ****/
        component.updateRoutingBoxes();
      } // if
    }); //directionsService.route callback
  }, //calcRoutes()
  updateRoutingBoxes () {
    // get routing box info from good api
    console.log("TEST inside updateRoutingBoxes() currentRoute = ", this.state.currentRoute.path);

    var routeBoxer = new RouteBoxer();
    var distance = 5; // km

    var routingBoxes = routeBoxer.box(this.state.currentRoute.path, distance);
    this.setState({
      routingBoxes
    });

    console.log("ROUTINGBOX", routingBoxes)
    // this.drawBoxes(boxes);

  },
  // // Draw the array of boxes as polylines on the map
  // drawBoxes (boxes) {
  //   var boxpolys = [];

  //   for (var i = 0; i < boxes.length; i++) {
  //     boxpolys.push(new google.maps.Rectangle({
  //       bounds: boxes[i],
  //       fillOpacity: 0,
  //       strokeOpacity: 1.0,
  //       strokeColor: '#000000',
  //       strokeWeight: 1,
  //       map: this.state.map
  //     }));
  //   } //for

  // }, // drawBoxes()

  // // Clear boxes currently on the map
  // clearBoxes () {
  //   if (boxpolys != null) {
  //     for (var i = 0; i < boxpolys.length; i++) {
  //       boxpolys[i].setMap(null);
  //     }
  //   }
  //   boxpolys = null;
  // }, // clearBoxes()

  render () {
    // update display of active route
    if (this.state.currentRoute) {
      this.state.currentRoute.setOptions({
        zIndex: 2,
        strokeOpacity: 1,
      });
    };

    return (
      <div>
        Welcome to the MapView!
        <div id="map"></div>
        <RouteDetailView routes={this.state.routes} />
        <ListView routingBoxes={this.state.routingBoxes} />
      </div>
    )
  }
});

module.exports = MapView;
