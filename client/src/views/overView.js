/*
This component is the overView. It shows the user the possible routes he/she can take to arrive at the destination
*/

var React = require('react');
var MapView = require('./mapView');
var MapRoutingView = require('./mapRoutingView');
var ListView = require('./listView');
var ToolView = require('./toolView');

var MapHelpers = require('../helpers/mapHelpers');

/***************
****** MUI *****
****************/
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var {Card, CardHeader, CardMedia, CardActions, CardText, Avatar, CardTitle} = mui;

var QueryStore = require('../stores/QueryStore');
var Actions = require('../actions/Actions.js');
var VenueStore = require('../stores/VenueStore');


var overView = React.createClass({
  // adds access to the router context. the getCurrentParams method can then be used to get the properties from the route
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState () {
    return {
      routes: [],
      markers: {},
      currentRoute: null, //default values for currentRoute
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
    routePalette: ['blue', 'black', 'green', 'pink'],

    //used for this.getFourSquare()
    fourSquare_url: "https://api.foursquare.com/v2/venues/explore?client_id=ELLZUH013LMEXWRWGBOSNBTXE3NV02IUUO3ZFPVFFSZYLA30&client_secret=U2EQ1N1J4EAG4XH4QO4HCZTGM3FCWDLXU2WJ0OPTD2Q3YUKF&v=20150902",
    foodCategory_url: "&categoryId=4d4b7105d754a06374d81259",
    limit_url: "&limit=10",
    photos_url: "&venuePhotos=1",
    category_url: "&section=food",
    distance_url: "&sortByDistance=0"
  },

  // this is called after the first render of the component
  //
  componentDidMount () {
    console.log("Overview ----> inside componentDidMount()");
    // QueryStore.addChangeListener(this.updateResults)

    /****** INITIALIZE MAP ******/
    var {origin, destination} = this.context.router.getCurrentParams();
    var start = MapHelpers.getLatLong(origin);
    var end = MapHelpers.getLatLong(destination);
    var map = MapHelpers.initializeMap(start);
    /****** CREATE START/END MARKERS *******/
    MapHelpers.initializeMarkers(start, end, map);

    /****** ZOOM ******/
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);
    map.fitBounds(bounds);

    // this.state.routes = [];
    // // this.state.routes[0].wayPoints =
    // this.state.markers = {};
    // this.setState({
    //   map,
    //   routes: [], // keep?
    //   markers: {} // keep?
    // });

    this.getRoutes(start, end, map);

    /****** FLUX ******/
    // VenueStore.addChangeListener(this.updateResults)

  }, //componentDidMount()

  shouldComponentUpdate (nextProps, nextState) { //before the
    // console.log("overView ----> inside shouldComponentUpdate() nextState=", nextState);

    //update map if results change (asynchronously when results are coming in from FourSquare)
    var results = VenueStore.getVenues();
    // if(results){
    //   this.updateMapMarkers(results);
    // } //if

    return true;
  }, //shouldComponentUpdate()

  componentWillUnmount () {
    console.log("overView ----> inside componentWillUnmount()");
    this.state.routes = [];
    this.state.markers = {};
    this.state.currentRoute = { wayPoints: [], results: [] };
    Actions.clearData();
    console.log(this.state)
  }, //componentWillUnmount()

  // SETUP PHASE STEP 1: Obtain routes from Google Maps Api
  // NOTE: asyncronous function
  getRoutes (start, end, map) {
    var directionsService = new google.maps.DirectionsService();
    var component = this;

    /****** GET ROUTES *******/
    var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    }; //request

    // func: Asynchronously gets routes from google
    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) { //.OK indicates the response contains a valid DirectionsResult.
        var newRoutes = []; //empty array for storing route polylines
        var colors = component.defaultOptions.routePalette;

        response.routes.forEach(function(route, i){

          // create a polyline for each suggested route
          var polyLine = new google.maps.Polyline({
            path: route.overview_path,
            strokeColor: colors[i],
            map
          });

          // add properties to each polyline
          polyLine.path = route.overview_path; //saved for future use
          polyLine.color = colors[i];
          polyLine.distance = route.legs[0].distance.text;
          polyLine.distanceMeters = route.legs[0].distance.value;
          polyLine.duration = route.legs[0].duration.text;
          polyLine.wayPoints = component.getWayPoints(polyLine); //syncronously get waypoints for select route
          console.log("TEST POLYLINE ---------> waypoints = ", polyLine.wayPoints);
          polyLine.results = [];

          polyLine.setOptions(component.defaultOptions.polyline);
          // save polylines for later use
          newRoutes.push(polyLine);

          /******* ROUTE POLYLINE CLICK *******/
          // polyLine.addListener('click', component.changeCurrentRoute.bind(component, i));

          // Actions.addWaypoints(wayPoints);

        }); //for(routes)

        // console.log("TEST ----------------> update currentRoute");
        component.changeCurrentRoute(newRoutes[0]); //load the first route
        // component.setState({
        //   currentRoute: routes[0], // on the initial load make the first suggestion active
        //   routes
        // });

        Actions.selectRoute(0);
        Actions.query();
      } // if(success)
    }); //directionsService.route callback

  }, //getRoutes()


  // SETUP PHASE (STEP 2): Obtain waypoints for each route
  // NOTE: syncronous function
  getWayPoints (newRoute) {

    var radius = this.defaultOptions.radius; //default radius
    var minRadiusToDistanceFactor = 5;

    var distance = newRoute.distanceMeters/1000;
    if (distance < minRadiusToDistanceFactor*radius) {
      radius = distance/minRadiusToDistanceFactor;
      window.searchRadius = radius; // do not set off re-render here
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

    return wayPoints;

  }, //getWayPoints()

  // SETUP PHASE (STEP 3): Obtain waypoints for each route
  // NOTE: asyncronous function
  //queries fourSquare api to get new results.
  //save results to the current route and updates the parent (mapView)
  //re-render results onto the page by updating state variable.
  getFourSquare (wayPoints, callback) {

    var results = {}; //test against duplicates
    var component = this;

    wayPoints.forEach(function(point, i){
      var ll = "&ll="+point.G+","+point.K;
      var radius_url = "&radius="+window.searchRadius*1000;

      //These two properties ensure that the data is only displayed once all of the requests have returned
      //It is important for the speed of the app and ensuring that everything works
      // var sortingPoint = wayPoints.length%20-1;
      // var count = 1;

      var {fourSquare_url, foodCategory_url, category_url, limit_url, photos_url, distance_url} = component.defaultOptions;
      $.ajax({
        url: fourSquare_url+ll+category_url+radius_url+limit_url+photos_url+distance_url,
        method: "GET",
        success: callback.bind(point), //success()
        error: function(error){
          console.log("TEST -------> fourSquare error, error=", error);
        }
      }); //ajax()

    }); //forEach()
  }, // getFourSquare()

  // Event: switch the route and update the active venues
  changeCurrentRoute (newRoute) {
    // console.log("overView ------> changeCurrentRoute() newRoute=", newRoute);
    /******** UPDATE POLYLINES *********/
    if(this.state.currentRoute){ // there is previous active route
      this.state.currentRoute.setOptions(this.defaultOptions.polyline);
    } //if

    newRoute.results = newRoute.results || [];
    var component = this;

    if(newRoute.results.length>0){ //if results already exist
      console.log("NOOOOooOoOOOOOOOOOOO newRoute.results=", newRoute.results);
      this.setState({results:newRoute.results});
    }else{
      // debugger
      this.getFourSquare(newRoute.wayPoints, function(data){

        var point = this; // waypoint used for query, bound to this for for callback
        var venues = data.response.groups[0].items; //extract venues array from data
        console.log("overView ----> inside getFourSquare() Success venues = ", venues);

        // count++;
        var prevResults = newRoute.results || {}; //results is a hash for quick checking
        var newResults = {};
        var newResultsArr = [];

        venues.forEach(function(venue_container, i){
          var venue = venue_container.venue;
          venue.totalDistance = venue.location.distance + point.distance; // in meters

          //remove duplicate venues
          if (!prevResults[venue.id]) { // if venue does NOT exist already
              newResults[venue.id] = venue; //save into newResults
          } else { // if venue is brand new
            // if: new venue result is closer to radii than the one from prevResult
            // then: save the new result, get rid of previous
            // else: don't save new venue
            if (prevResults[venue.id].location.distance > venue.location.distance) {
              newResults[venue.id] = venue;
            } //if
          } //if

        }); //forEach(venues)

        for (var venue_id in newResults) { //convert newResults object into array
          newResultsArr.push(newResults[venue_id]); //push value into array
        }

        // update newRoute (in closure)
        newRoute.results.concat(newResultsArr);

        component.setState({results:newRoute.results}); // re-render

        // Actions.addVenues(newResultsArr);

        // if(count >= sortingPoint){
        //   Actions.sortVenues();
        // } //if

      }); // getFourSquare(callback)

    } //if

    // update display of active route
    newRoute.setOptions({
      zIndex: 2,
      strokeOpacity: 1
    });




    // var newRoute = this.state.routes[index];


    var venues  = VenueStore.getVenues();

    // Actions.selectRoute(index);

    // clear previously active route
    //temp comment
    // if (this.state.currentRoute) {
    // } //if

    // //clear previously displayed map markers
    // this.clearMapMarkers(this.state.markers);

    // this.setState({
    //   currentRoute: newRoute
    // });
    // this.updateResults();
    // Actions.query();
  },

  // prop for ListView. Allows it to add results to the currentRoute
  // updateResults () {
  //   console.log('updateResults')
  //   this.state.currentRoute.results = VenueStore.getVenues();
  //   this.clearMapMarkers(this.state.markers)
  //   this.updateMapMarkers(this.state.currentRoute.results)
  //   this.setState({}); //forces re-render (e.g. for the listView)
  // }, //updateResults()

  loadMore : function() {
    Actions.query(); //what does this do?
  },

  priceFilter: function(tier) {
    Actions.priceFilter(tier);
  },

  ratingFilter: function(minimunRating) {
    Actions.ratingFilter(minimunRating);
  },
  render () {
    var that = this;
    return (
      <div className='container-fluid' style={{'height': '100%'}} >
        <div className='row' style={{'height': '100%', 'width': '100%'}}>
          <div className='col-sm-5 left-container'>

            <div className='tool-bar-container'>
              <ToolView/> {/* ToolView */}
            </div>

            <div className='list-container'>
                <ListView
                  currentRoute={this.state.currentRoute}
                /> {/* ListView*/}

            </div> {/* list-container */}

          </div> {/* col-sm-4 */}

          <div className='col-sm-7 right-container'>
              <button onClick={this.loadMore}>Load More</button>
              <button onClick={function(){that.priceFilter(1)}}>$</button>
              <button onClick={function(){that.priceFilter(2)}}>$$</button>
              <button onClick={function(){that.priceFilter(3)}}>$$$</button>
              <button onClick={function(){that.ratingFilter(7)}}>7+</button>
              <button onClick={function(){that.ratingFilter(8)}}>8+</button>
              <button onClick={function(){that.ratingFilter(9)}}>9+</button>
              <button onClick={function(){Actions.clearFilter();}}>Clear Filters</button>
              <button onClick={function(){Actions.openNowFilter();}}>Open Now</button>
              <button onClick={function(){Actions.clearData();}}>Clear Data</button>

            <div className='row map-container'>
              <MapView results={this.state.results} id="map"/>
            </div> {/* row */}

            <div className='row route-container'>
              <MapRoutingView
                routes={this.state.routes}
                changeCurrentRoute={this.changeCurrentRoute}
              /> {/* MapRoutingView */}
            </div> {/* row */}

          </div> {/* col-sm-8 */}

        </div> {/* row */}
      </div>
    )
  }
});

module.exports = overView;
