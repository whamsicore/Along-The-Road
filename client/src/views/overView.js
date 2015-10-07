/*
This component is the overView. It shows the user the possible routes he/she can take to arrive at the destination
*/

var React = require('react');
var MapView = require('./mapView');
var RouteDetailView = require('./routeDetailView');
var ListView = require('./listView');
var ToolView = require('./toolView');

var MapHelpers = require('../helpers/mapHelpers');

/***************
****** MUI *****
****************/
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var {Card, CardHeader, CardMedia, CardActions, CardText, Avatar, CardTitle} = mui;

// var QueryStore = require('../stores/QueryStore');

var Actions = require('../actions/Actions.js');
var RouteStore = require('../stores/RouteStore');

var overView = React.createClass({
  // adds access to the router context. the getCurrentParams method can then be used to get the properties from the route
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState () {
    return {
      routes: [],
      currentRoute: null, // current route in the form of a polyline object
      // searchRadius: this.defaultOptions.radius
    }
  },

  //default options to be used for this view, inclusind route options and radius of search
  defaultOptions: {
    polyline: { //configuration for inactive polylines
      zIndex: 1,
      strokeOpacity: 0.4,
      strokeWeight: 6
    },
    radius: 5, // radius used to generate wayPoints, in km.
    routePalette: ['blue', 'black', 'green', 'pink'],
  },

  // this is called after the first render of the component
  componentDidMount () {
    console.log("Overview ----> inside componentDidMount()");
    // QueryStore.addChangeListener(this.updateResults)

    /****** INITIALIZE MAP ******/
    var {origin, destination} = this.context.router.getCurrentParams();
    var start = MapHelpers.getLatLong(origin);
    var end = MapHelpers.getLatLong(destination);
    var map = MapHelpers.initializeMap(start);
    window.map = map;
    /****** CREATE START/END MARKERS *******/
    MapHelpers.initializeMarkers(start, end, map);

    /****** ZOOM ******/
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);
    map.fitBounds(bounds);

    /****** FLUX:  ******/
    RouteStore.addChangeListener(function(){
      var routes = RouteStore.getRoutes();
      var currentRoute = RouteStore.getCurrentRoute();
      // console.log("$$$$$$$$$$$ RouteStore returned. currentRoute = ", currentRoute);

      //The only place we are going to set state
      this.setState({
        routes,
        currentRoute
      });

    }.bind(this)); //update routes

    /****** BEGIN APP INITIALIZATION *****/
    this.getRoutes(start, end, map);

    // VenueStore.addChangeListener(this.updateResults)

  }, //componentDidMount()

  shouldComponentUpdate (nextProps, nextState) { //before the
    // console.log("overView ----> inside shouldComponentUpdate() nextState=", nextState);

    //update map if results change (asynchronously when results are coming in from FourSquare)
    // var results = VenueStore.getVenues();
    // if(results){
    //   this.updateMapMarkers(results);
    // } //if

    return true;
  }, //shouldComponentUpdate()

  componentWillUnmount () {
    // console.log("overView ----> inside componentWillUnmount()");
    // this.state.routes = [];
    // this.state.markers = {};
    // this.state.currentRoute = { wayPoints: [], results: [] };
    // Actions.clearData();
    // console.log(this.state)
  }, //componentWillUnmount()

  // SETUP PHASE STEP 1: Obtain routes from Google Maps Api
  // NOTE: asyncronous function
  getRoutes (start, end, map) {
    var directionsService = new google.maps.DirectionsService();
    var component = this;

    /****** GET ROUTES *******/
    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    }; //request

    // func: Asynchronously gets routes from google
    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) { //.OK indicates the response contains a valid DirectionsResult.
        var newRoutes = []; //empty array for storing route polylines
        var colors = component.defaultOptions.routePalette;

        response.routes.forEach(function(googleRoute, i){

          // create a polyline for each suggested googleRoute
          var newRoute = new google.maps.Polyline({
            path: googleRoute.overview_path,
            strokeColor: colors[i],
            map
          });

          newRoute.setOptions(component.defaultOptions.polyline);

          newRoute.path = googleRoute.overview_path; //saved for future use
          newRoute.color = colors[i];
          newRoute.distance = googleRoute.legs[0].distance.text;
          newRoute.distanceMeters = googleRoute.legs[0].distance.value;
          newRoute.duration = googleRoute.legs[0].duration.text;

          // derived properties
          newRoute.index = i; //tracks position in routes array
          newRoute.allVenues = {}; //all venues found
          newRoute.filteredVenues = []; //processed (filtered OR sorted) venues to be displayed
          newRoute.queryIndex = 0; //where we begin with queries, defaults to 0
          newRoute.queryComplete = false; //whether all waypoints have been queried. Defaults to false
          var radius = MapHelpers.getSearchRadius(newRoute);
          newRoute.searchRadius = radius;
          newRoute.wayPoints = MapHelpers.getWayPoints(newRoute, radius); //syncronously get waypoints for select googleRoute

          /******* ROUTE newRoute CLICK *******/
          newRoute.addListener('click', component.changeCurrentRoute.bind(component, newRoute));

          // save routes in array
          newRoutes.push(newRoute);

          // Actions.addWaypoints(wayPoints);

        }); //for(routes)

        Actions.initRoutes(newRoutes);

        component.changeCurrentRoute(RouteStore.getCurrentRoute()); //load the first route
      } // if(success)
    }); //directionsService.route callback

  }, //getRoutes()


  // Event: switch the route and update the active venues
  changeCurrentRoute (newRoute) {
    // console.log("overView ------> changeCurrentRoute() newRoute=", newRoute);
    /******** UPDATE POLYLINES *********/
    if(this.state.currentRoute){ // there is previous active route
      this.state.currentRoute.setOptions(this.defaultOptions.polyline);
    } //if

    // update display of active route
    newRoute.setOptions({
      zIndex: 2,
      strokeOpacity: 1
    });

    //Change Current Route
    var component = this;

    Actions.selectRoute(newRoute.index);
  }, // changeCurrentRoute()

  loadMore () {
    this.getFourSquare(newRoute.wayPoints, function(data){
      var point = this; // waypoint used for query, bound to this for for callback

      var venue_wrappers = data.response.groups[0].items; //extract venues array from data
      Actions.addVenues(venue_wrappers, point);

      // if(count >= sortingPoint){
      //   Actions.sortVenues();
      // } //if

    }); // getFourSquare(callback)
  }, // loadMore()

  render () {
    var that = this;
    return (
      <div className = 'container-fluid' style = {{'height': '100%'}} >
        <div className = 'row' style={{'height': '100%', 'width': '100%'}}>
          <div className = 'col-sm-5 left-container'>

            <div className = 'tool-bar-container'>
              <ToolView/> {/* ToolView */}
            </div>

            <div className = 'list-container'>
                <ListView
                  // currentRoute={this.state.currentRoute}
                  currentRoute = {this.state.currentRoute}
                /> {/* ListView*/}

            </div> {/* list-container */}

          </div> {/* col-sm-4 */}

          <div className='col-sm-7 right-container'>
            <div className='row map-container'>
              <MapView
                currentRoute={this.state.currentRoute}
                id="map"
              /> {/* MapView */}
            </div> {/* row */}

            <div className='row route-container'>
              <RouteDetailView
                routes={this.state.routes}
                changeCurrentRoute={this.changeCurrentRoute}
              /> {/* RouteDetailView */}
            </div> {/* row */}

          </div> {/* col-sm-8 */}

        </div> {/* row */}
      </div>
    )
  }
});

module.exports = overView;
