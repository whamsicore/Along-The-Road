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
var {RaisedButton} = mui;
// var {RaisedButton, Paper} = mui;

/***************
****** FLUX *****
****************/
var Actions = require('../actions/Actions.js');
var RouteStore = require('../stores/RouteStore');
var QueriesPerLoad = 15;

var overView = React.createClass({
  childContextTypes: { // MUI: init
    muiTheme: React.PropTypes.object //connect MUI
  },
  getChildContext () { // MUI: set theme
    return {
      muiTheme: ThemeManager.getCurrentTheme() //set MUI theme to default
    };
  },

  // adds access to the router context. the getCurrentParams method can then be used to get the properties from the route
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState () {
    return {
      routes: [],
      currentRoute: null, // current route in the form of a polyline object
      venueFilters: {} // current route in the form of a polyline object
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

    _fourSquare: {
      fourSquare_url: "https://api.foursquare.com/v2/venues/explore?client_id=ELLZUH013LMEXWRWGBOSNBTXE3NV02IUUO3ZFPVFFSZYLA30&client_secret=U2EQ1N1J4EAG4XH4QO4HCZTGM3FCWDLXU2WJ0OPTD2Q3YUKF&v=20150902",
      foodCategory_url: "&categoryId=4d4b7105d754a06374d81259",
      limit_url: "&limit=20", // how many venues to return per waypoint
      photos_url: "&venuePhotos=1",
      category_url: "&section=food",
      distance_url: "&sortByDistance=0"
    }
  },

  // this is called after the first render of the component
  componentDidMount () {
    // QueryStore.addChangeListener(this.updateResults)

    /****** INITIALIZE MAP ******/
    var {origin, destination} = this.context.router.getCurrentParams();
    this.state.origin = origin;
    var start = MapHelpers.getLatLong(origin);
    var end = MapHelpers.getLatLong(destination);
    var map = MapHelpers.initializeMap(start);
    window.map = map;

    /****** CREATE START/END MARKERS *******/
    MapHelpers.initializeMarkers(start, end, map);

    /****** ZOOM ******/
    MapHelpers.updateZoom([start, end], map);

    /****** FLUX:  ******/
    RouteStore.addChangeListener(this.onStoreChange); //update routes

    /****** BEGIN APP INITIALIZATION *****/
    this.getRoutes(start, end, map);

  }, //componentDidMount()

  componentWillUnmount (){
    //reset filters
    Actions.clearFilter();

    //remove store listeners
    RouteStore.removeChangeListener(this.onStoreChange);
  },

  onStoreChange (){

      // console.log("RouteStore addChangeListener() **********************");
      var routes = RouteStore.getRoutes();
      var currentRoute = RouteStore.getCurrentRoute();
      var filteredVenues = currentRoute.filteredVenues;

      //The only place we are going to set state
      this.setState({
        routes,
        currentRoute,
      });
  },


  /* function: getRoutes
   * --------------------------------
   * This function finds the three fastest routes back by querying the google maps api
   * It then creates an object with all the desired data from the query as well as
   * placeholders for data to later be added.
  */
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
        // log("$$$$$$$$$$$ Success routes:", response.routes);
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
          newRoute.allVenuesObj = {}; //all venues found
          newRoute.allVenuesArray = [];
          newRoute.filteredVenues = newRoute.allVenuesArray; //processed (filtered OR sorted) venues to be displayed
          newRoute.queryIndex = 1; //where we begin with queries, defaults to 0
          newRoute.queryComplete = false; //whether all waypoints have been queried. Defaults to false
          var radius = MapHelpers.getSearchRadius(newRoute);
          newRoute.searchRadius = radius;
          newRoute.wayPoints = MapHelpers.getWayPoints(newRoute, radius); //syncronously get waypoints for select googleRoute

          newRoute.addListener('click', function(){

            component.changeCurrentRoute(newRoute)
          });

          newRoutes.push(newRoute); // save routes in array



        }); //for(routes)

        Actions.initRoutes(newRoutes);

        component.changeCurrentRoute(RouteStore.getCurrentRoute()); //load the first route
      } // if(success)
    }); //directionsService.route callback

  }, //getRoutes()


  /**
   * This function loads the next 20 queries on the currently selected route
   *    It does this by invoking the getFourSquare function for the next 20 waypoints
   * @param  {[Route Object]}
   * @return {[nothing]}
   */
  loadMore (newRoute) {
    var loadSize = QueriesPerLoad;
    var queryIndex = newRoute.queryIndex;
    var queries = newRoute.wayPoints.slice(queryIndex, queryIndex+loadSize);
    this.getFourSquare(queries, queryIndex); //getFourSquare
    newRoute.queryIndex+=loadSize;

  },


  /* function: changeCurrentRoute
   * --------------------------------
   * This function takes in the new route and updates it on the map as well as
   * triggering the action to select the route in the routeStore. It then
   * checks if the venues have been queried for that route and adds more if yes.
  */
  changeCurrentRoute (newRoute) {
    /******** UPDATE POLYLINES *********/
    this.state.currentRoute.setOptions(this.defaultOptions.polyline); //hide old route
    newRoute.setOptions({zIndex: 2, strokeOpacity: 1}); //show currentRoute

    Actions.selectRoute(newRoute.index);
    Actions.sortVenues();
    Actions.updateList();

    /******** QUERY FOR VENUES *********/
    if(Object.keys(newRoute.allVenuesObj).length===0){
      this.loadMore(newRoute);
    } //if


  }, // changeCurrentRoute()



  /**
   * SETUP PHASE (STEP 3): Obtain waypoints for each route
   * NOTE: asyncronous function
   * queries fourSquare api to get new results.
   * save results to the current route and updates the parent (mapView)
   * re-render results onto the page by updating state variable.
   *
   * @param  {[type]}
   * @return {[type]}
   */
  getFourSquare (wayPoints, queryIndex) {

    var count = wayPoints.length;
    if(wayPoints.length === QueriesPerLoad) {
      $('#loadMore').show();
    }

    if(wayPoints.length !== QueriesPerLoad) {
      $('#loadMore').hide(200);
    }



    for(var i=0; i<wayPoints.length; i++){
      var point = wayPoints[i];
      var ll = "&ll=" + point.lat()+"," + point.lng();

      var radius_url = "&radius=" + this.state.currentRoute.searchRadius * 1000;

      //These two properties ensure that the data is only displayed once all of the requests have returned
      //It is important for the speed of the app and ensuring that everything works

      var {fourSquare_url, foodCategory_url, category_url, limit_url, photos_url, distance_url} = this.defaultOptions._fourSquare;

      $.ajax({
        url: fourSquare_url + ll + category_url + radius_url + limit_url + photos_url + distance_url,
        method: "GET",
        success: function(data){
          count--;
          var point = this; // waypoint used for query, bound to this for for callback
          var venue_wrappers = data.response.groups[0].items; //extract venues array from data
          Actions.addVenues(venue_wrappers, point);
          //This is just to show the user something is loading
          if(queryIndex === 1 && count ===  wayPoints.length-1) {
            Actions.sortVenues();
            Actions.updateList();
          }

          //This condition checks for if it is the last query
          if(count === 0 ){
            Actions.sortVenues();
            Actions.updateList();
          }
        }.bind(point),
        error: function(error){
          count--;
          if(count === 0 ){
            Actions.sortVenues();
            Actions.updateList();
          }
          console.log("FourSquare API: ", error);
        }
      }); //ajax()
    }; //for()
  }, // getFourSquare()


  render () {
    var that = this;
    return (
      <div className = 'container-fluid background-white' style = {{'height': '100%'}} >
        <div className = 'row' style={{'height': '100%', 'width': '100%'}}>
          <div className = 'col-sm-5 left-container'>

            <div className = 'tool-bar-container' style={{"backgroundColor": "#333"}} >
              <ToolView
              /> {/* ToolView */}
            </div>

            <div id ="list"
              className = 'list-container'
            > {/* div.list-container */}
                <ListView
                  // currentRoute={this.state.currentRoute}
                  currentRoute = {this.state.currentRoute}
                  origin = {this.state.origin}
                /> {/* ListView*/}

            </div> {/* list-container */}

          </div> {/* col-sm-4 */}

          <div id="right-container" className='col-sm-7 right-container'>
            <div className='row map-container'>
              <MapView
                currentRoute={this.state.currentRoute}
                origin = {this.state.origin}

              /> {/* MapView */}
            </div> {/* row */}

            <div className='row route-container'>
              <RouteDetailView
                routes={this.state.routes}
                changeCurrentRoute={this.changeCurrentRoute}
              /> {/* RouteDetailView */}
            </div> {/* row */}

            <div id="loadMore" className='row load-more-container'>
              <RaisedButton
                label="Load More"
                className="submit_button"
                secondary={true}
                onClick={function(){that.loadMore(that.state.currentRoute)}}
                style={{
                  'width':'140px',
                  'borderRadius': '5px'
                }}
              /> {/* RaisedButton */}
            </div> {/* row */}
          </div> {/* col-sm-8 */}

        </div> {/* row */}
      </div>
    )
  }
});

module.exports = overView;
