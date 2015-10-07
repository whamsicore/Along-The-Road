/*
This component is the map view. It shows the user the possible routes he/she can take to arrive at the destination
*/

var React = require('react');
var RouteDetailView = require('./routeDetailView');
var ListView = require('./listView');
var MapHelpers = require('./mapHelpers');
var ToolView = require('./toolView');

/***************
****** MUI *****
****************/
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var {Card, CardHeader, CardMedia, CardActions, CardText, Avatar, CardTitle} = mui;


var MapView = React.createClass({
  // adds access to the router context. the getCurrentParams method can then be used to get the properties from the route
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState () {
    return {
      routes: [],
      markers: {},
      currentRoute: { wayPoints: [], results: [] }, //default values for currentRoute
      searchRadius: this.defaultOptions.radius
    }
  },
  //default options to be used for this view, inclusind route options and radius of search
  defaultOptions: {
    polyline: { //configuration for polylines (inactive ones)
      zIndex: 1,
      strokeOpacity: 0.4,
      strokeWeight: 6
    },
    radius: 5, // radius used to generate wayPoints, in km.
    routePalette: ['blue', 'black', 'green', 'pink']
  },
  // this is called after the first render of the component
  componentDidMount () {
    var {origin, destination} = this.context.router.getCurrentParams();

    var start = this.getLatLong(origin);
    var end = this.getLatLong(destination);

    var map = this.initializeMap(start);
    this.setState({
      map
    });

    this.calcRoute(start, end, map);

    var bounds = new google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);
    map.fitBounds(bounds);
  }, //componentDidMount()
  // Going to
  shouldComponentUpdate (nextProps, nextState) {
    var results = nextState.currentRoute.results;
    if(results){
      this.updateMapMarkers(results);
    } //if

    return true;
  }, //shouldComponentUpdate()
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
  // Print new markers
  updateMapMarkers(results){
    var map = this.state.map;
    var markers = this.state.markers; //array of
    var component = this;

    results.forEach(function(venue, index){
      var {lng, lat} = venue.location;

      //create new marker
      if(!markers[venue.id]){ //
        var position = new google.maps.LatLng(lat, lng);

        var marker = new google.maps.Marker({
          position: position,
        });

        // create custom infowindow
        // NOTE: we can also add rating color to decorate marker
        var infowindow = new google.maps.InfoWindow({
          content: venue.name + "<br> Rating: "+venue.rating
        });

        //create event listener to open info window
        google.maps.event.addListener(marker, 'mouseover', function() {
          infowindow.open(map, this);
        }); //mouseover

        // create event listener to close info window
        google.maps.event.addListener(marker, 'mouseout', function() {
          infowindow.close();
        }); //mouseout

        // create event listener to close info window
        google.maps.event.addListener(marker, 'click', function() {
          component.openFourSquare(venue);
        }); //mouseout

        //show map marker
        marker.setMap(map);
        // add current marker to state
        component.state.markers[venue.id] = marker;
        // component.state.markers.push(marker);
      } //if

      //display markers
    }); //forEach
  }, //updateMapMarkers()

  // clear map markers
  clearMapMarkers (markers){
    this.state.markers = {};

    for(var key in markers){
      var marker = markers[key];
      marker.setMap(null);
    } //for
  }, //clearMapMarkers

  // set the current selected route
  setCurrentRoute (index) {
    var newRoute = this.state.routes[index];
    // clear previously active route
    if (this.state.currentRoute) {
      this.state.currentRoute.setOptions(this.defaultOptions.polyline);
    } //if

    //clear previously displayed map markers
    this.clearMapMarkers(this.state.markers);

    var wayPoints = this.updateWayPoints(newRoute);
    console.log(' &&&&&&&&& before this.setState');
    this.setState({
      wayPoints,
      currentRoute: newRoute
    });
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
        var colors = component.defaultOptions.routePalette;

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
          polyLine.distanceMeters = response.routes[i].legs[0].distance.value;
          polyLine.duration = response.routes[i].legs[0].duration.text;
          polyLine.wayPoints = [];
          polyLine.results = [];

          polyLine.setOptions(component.defaultOptions.polyline);
          // save polylines for later use
          routes.push(polyLine);

          // add event listener to update the route on click
          polyLine.addListener('click', component.setCurrentRoute.bind(component, i));

        } //for(each route)

        var wayPoints = component.updateWayPoints(routes[0]); //initialize with first route
        routes[0].wayPoints = wayPoints;
        var searchRadius = component.state.searchRadius;
        component.setState({
          currentRoute: routes[0], // on the initial load make the first suggestion active
          routes
        });
      } // if
    }); //directionsService.route callback

  }, //calcRoutes()

  // updates wayPoints if available, create wayPoints if not
  updateWayPoints (newRoute){
    //lazy-load currentRoute wayPoints, and save it to currentRoute object when complete
    var wayPoints =  newRoute.wayPoints.length>1 ? newRoute.wayPoints : this.createWayPoints(newRoute); //only create new wayPoints if hasn't been done before
    this.displayWayPoints(newRoute.wayPoints);

    return wayPoints;
  }, // updateWayPoints()

  // creates wayPoints for new route. Only executes once per route, and becomes saved.
  createWayPoints (newRoute) {

    var radius = this.defaultOptions.radius; //default radius
    var minRadiusToDistanceFactor = 5;

    var distance = newRoute.distanceMeters/1000;
    if (distance < minRadiusToDistanceFactor*radius) {
      radius = distance/minRadiusToDistanceFactor;
      this.state.searchRadius = radius; // do not set off re-render here
    }

    var path = newRoute.path; // get path from target route
    var map = this.state.map; // note: map is a state of this view

    var wayPoints = [];
    var lastWayPoint;

    path.forEach(function(point, index) {
      // calculate cumulative distance from start, in meters
      if (index === 0) {
        point.distance = 0;
      } else {
        var prevPoint = path[index-1];
        point.distance = prevPoint.distance + MapHelpers.getDistanceBetweenPoints(prevPoint, point)*1000;
      }

      // add first point
      if (!lastWayPoint) {
        wayPoints.push(point);
        lastWayPoint = point;
      }
      // add an inbetween point if the distance is too big
      if (MapHelpers.getDistanceBetweenPoints(lastWayPoint, point) > 1.5 * radius) {
        var middlePoint = MapHelpers.getMiddlePoint(lastWayPoint, point);
        middlePoint.distance = prevPoint.distance + MapHelpers.getDistanceBetweenPoints(prevPoint, middlePoint)*1000;
        wayPoints.push(middlePoint);
      }

      // add new point if the distance is larger than the radius
      if (MapHelpers.getDistanceBetweenPoints(lastWayPoint, point) > radius) {
        wayPoints.push(point);
        lastWayPoint = point;
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
        radius: this.state.searchRadius * 1000,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
      });
    }.bind(this));
  }, //displayWayPoints()

  // prop for ListView. Allows it to add results to the currentRoute
  updateResults (results) {
    this.state.currentRoute.results = results;
    this.setState({}); //forces re-render (e.g. for the listView)
  }, //updateResults()

  openFourSquare (venue){
    var url = "https://foursquare.com/v/"+escape(venue.name)+"/"+venue.id;
    console.log("TEST inside openFourSquare. url="+url);
    window.open(url);
  },

  render () {
    // update display of active route
    if (this.state.currentRoute.setOptions) {
      this.state.currentRoute.setOptions({
        zIndex: 2,
        strokeOpacity: 1,
      });
    };

    return (
      <div className='container-fluid' style={{'height': '100%'}} >
        <div className='row' style={{'height': '100%', 'width': '100%'}}>
          <div className='col-sm-5 left-container'>

            <div className='tool-bar-container'>
              <ToolView/> {/* ToolView */}
            </div>

            <div className='list-container'>
                <ListView
                  searchRadius={this.state.searchRadius}
                  currentRoute={this.state.currentRoute}
                  updateResults={this.updateResults}
                  openFourSquare = {this.openFourSquare}
                /> {/* ListView*/}

            </div> {/* list-container */}

          </div> {/* col-sm-4 */}

          <div className='col-sm-7 right-container'>

            <div className='row map-container'>
              <div id="map"></div>
            </div> {/* row */}

            <div className='row route-container'>
              <RouteDetailView
                routes={this.state.routes}
                setCurrentRoute={this.setCurrentRoute}
              /> {/* RouteDetailView */}
            </div> {/* row */}

          </div> {/* col-sm-8 */}

        </div> {/* row */}
      </div>
    )
  }
});

module.exports = MapView;
