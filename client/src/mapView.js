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
      currentRoute: { wayPoints: [] },
      wayPoints: []
    }
  },

  // this is called after the first reder of the component
  componentDidMount () {
    var {origin, destination} = this.context.router.getCurrentParams();

    var start = this.getLatLong(origin);
    var end = this.getLatLong(destination);

    var map = this.initializeMap(start);
    this.setState({
      map
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

  // set the current selected route
  setCurrentRoute (index) {
    // clear previously active route
    if (this.state.currentRoute) {
      this.state.currentRoute.setOptions(this.defaultOptions.routes);
    }

    var wayPoints = this.updateWayPoints(this.state.routes[index]);
    console.log("TEST ---> wayPoints = ", wayPoints)
    this.setState({
      wayPoints,
      currentRoute: this.state.routes[index]
    });

    // update new wayPoints
    // this.createWayPoints();

  },
  //default options to be used for this view, inclusind route options and radius of search
  defaultOptions: {
    routes: { //route option for desplaying routes on map
      zIndex: 1,
      strokeOpacity: 0.4,
      strokeWeight: 4
    },
    radius: 10 // radius used to generate wayPoints, in km.
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
          polyLine.wayPoints = [];

          polyLine.setOptions(component.defaultOptions);
          // save polylines for later use
          routes.push(polyLine);

          // add event listener to update the route on click
          polyLine.addListener('click', component.setCurrentRoute.bind(component, i));

        } //for(each route)


        component.setState({
          currentRoute: routes[0], // on the initial load make the first suggestion active
          routes
        });

        /**** Routing Box ****/
        var wayPoints = component.updateWayPoints(routes[0]); //initialize with first route
        // component.setState({
        //   wayPoints
        // });

        component.state.currentRoute.wayPoints = wayPoints;
        // component.createWayPoints();
      } // if
    }); //directionsService.route callback
  }, //calcRoutes()

  // updates wayPoints if available, create wayPoints if not
  updateWayPoints (newRoute){

    //lazy-load currentRoute wayPoints, and save it to currentRoute object when complete
    var wayPoints =  newRoute.wayPoints.length>1 ? newRoute.wayPoints : this.createWayPoints(newRoute); //only create new wayPoints if hasn't been done before
    console.log("TEST inside updateWayPoints(). newRoute = ", newRoute)
    this.displayWayPoints(newRoute.wayPoints);

    return wayPoints;
  },
  // creates wayPoints for new route. Only executes once per route, and becomes saved.
  createWayPoints (newRoute) {
    // console.log("TEST inside createWayPoints()");

    var radius = this.defaultOptions.radius; //default radius
    var path = newRoute.path; // get path from target route
    var map = this.state.map; // note: map is a state of this view

    var wayPoints = [];
    var lastPoint;

    // calculates the distance in km between two points based on their Latitude and Longitude
    var getDistanceBetweenPoints = function(a, b) {
      // G represents the Latitude and K the Longitude of a point
      var d = Math.sqrt(Math.pow(a.G-b.G, 2) + Math.pow(a.K-b.K, 2));
      return d * 95;
    }

    // creates a point inbetween two specified points points
    var getMiddlePoint = function(a, b) {
      return new google.maps.LatLng((a.G+b.G)/2, (a.K+b.K)/2);
    }

    path.forEach(function(point) {
      // add first point
      if (!lastPoint) {
        wayPoints.push(point);
        lastPoint = point;
      }
      // add an inbetween point if the distance is too big
      if (getDistanceBetweenPoints(lastPoint, point) > 1.5 * radius) {
        wayPoints.push(getMiddlePoint(lastPoint, point));
      }
      // add new point if the distance is larger than the radius
      if (getDistanceBetweenPoints(lastPoint, point) > radius) {
        wayPoints.push(point);
        lastPoint = point;
      }
    });

    newRoute.wayPoints = wayPoints; //save to the currentRoute object

    return wayPoints;

  }, //createWayPoints()
  //display wayPoints on the map
  displayWayPoints(wayPoints){
    wayPoints.forEach(function(point) {
      new google.maps.Circle({
        center: point,
        map: this.state.map,
        radius: this.defaultOptions.radius*1000,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
      });
    }.bind(this));
  }, //displayWayPoints()

  updateResults (pureResults) {
    // take in purified results from ListView and do something
  }, //updateResults()

  render () {
    // update display of active route
    if (this.state.currentRoute.setOptions) {
      this.state.currentRoute.setOptions({
        zIndex: 2,
        strokeOpacity: 1,
      });
    };

    return (
      <div>
        Welcome to the MapView!
        <div id="map"></div>
        <RouteDetailView
          routes={this.state.routes}
          setCurrentRoute={this.setCurrentRoute} />
        <ListView currentRoute={this.state.currentRoute} updateResults={this.updateResults} />
      </div>
    )
  }
});

module.exports = MapView;
