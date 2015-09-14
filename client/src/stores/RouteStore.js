/* The only store we are going to use, contains information of all routes, attached waypoints, venues, filtered venues, etc... */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

/********* OUR STORE DATA ***********/

var routes = []; //Stores the last waypoint searched in for that route
var currentRoute = 0;
var _venueFilters = {
  ratingFilter: -1, 
  priceFilter: -1,  
  openNowFilter: false
};
//used for this.getFourSquare()
var _fourSquare = {
    fourSquare_url: "https://api.foursquare.com/v2/venues/explore?client_id=ELLZUH013LMEXWRWGBOSNBTXE3NV02IUUO3ZFPVFFSZYLA30&client_secret=U2EQ1N1J4EAG4XH4QO4HCZTGM3FCWDLXU2WJ0OPTD2Q3YUKF&v=20150902",
    foodCategory_url: "&categoryId=4d4b7105d754a06374d81259",
    limit_url: "&limit=10",
    photos_url: "&venuePhotos=1",
    category_url: "&section=food",
    distance_url: "&sortByDistance=0"  
}

/********* OUR ACTION RESPONSE ***********/

/*** PAYTON ***/
function initRoutes (newRoutes){
  // console.log("RouteStore inside initRoutes. routes = ", newRoutes)
  routes = newRoutes; 
  currentRoute = routes[0]; //set default currentRoute to first result
} //initRoutes


function addVenues(venue_wrappers, point){
    //NOTE: point is used for calulating total distance, which is equal to distance of point to origin, plus distance of point to venue
    console.log("RouteStore inside addVenues()");

    // count++;
    // var prevResults = newRoute.results || {}; //results is a hash for quick checking
    var newResults = {};
    var newResultsArr = [];
    var allVenues = currentRoute.allVenues;

    venue_wrappers.forEach(function(venue_wrapper, i){
      var venue = venue_wrapper.venue;
      venue.totalDistance = venue.location.distance + point.distance; // in meters
      
      //remove duplicate venues 
      if (!allVenues[venue.id]) { // if venue does NOT exist already 
          // newResults[venue.id] = venue; //save into newResults 
          allVenues[venue.id] = venue; //save to allVenues
      } else { // if venue is brand new, on
        // NOTE: only save if new result is closer to radii than the one from before; THEN: save the new result, get rid of previous; ELSE: don't save new venue
        if (allVenues[venue.id].location.distance > venue.location.distance) {
          allVenues[venue.id] = venue; //save to allVenues
        } //if
      } //if
    }); //forEach(venues)

    //NOTE: allVenues has completed update
    /***** updated filteredVenues *****/
    for (var venue_id in allVenues) { //convert newResults object into array
      newResultsArr.push(newResults[venue_id]); //push value into array
    } 

    currentRoute.filteredVenues = getFilteredArr(); //NOTE: get back a filtered and sorted array

  /**************/
  
  currentRoute.filteredVenues = getFilteredArr();
} //addVenues()


function setCurrentRoute (index) {
  //First save the old data
  //Then find current one and set data to that
  currentRoute = routes[index];

  if(Object.keys(currentRoute.allVenues).length===0){
    getFourSquare(currentRoute.wayPoints, function(data){
      var point = this; // waypoint used for query, bound to this for for callback
        
      var venue_wrappers = data.response.groups[0].items; //extract venues array from data
      
      addVenues(venue_wrappers, point);
      Store.emitChange();

    }); //getFourSquare
  } //if
}

function getFilteredArr () {    
  var filteredVenues = [];
  var allVenues = currentRoute.allVenues;
  // console.log("$$$$$$$$$$$$ getFilteredArr &&&&&& allvenues = ", allVenues)
  var {ratingFilter, priceFilter, openNowFilter} = _venueFilters;

  for(var id in allVenues){
    var venue = allVenues[id];
    var valid = true;

    //Ratings
    if(ratingFilter !==-1 ){
      if(!venue.rating){
        valid = false;
      } else if (venue.rating < ratingFilter){
        valid = false;
      }
    }

    //Price
    if(priceFilter !== -1){
      if(!venue.price) {
        valid = false;
      } else if (!(venue.price.tier)){
        valid = false;
      } else if (!(venue.price.tier === priceFilter) ){
        valid = false;
      }
    }

    //Open now filter
    if(openNowFilter){
      if(!venue.hours || !venue.hours.isOpen){
        valid = false;
      }
    }

    if(valid) {
        filteredVenues.push(venue);
    }
    
  } //for(allVenues)

  return filteredVenues;
} //getFilteredArr()


// SETUP PHASE (STEP 3): Obtain waypoints for each route
// NOTE: asyncronous function
//queries fourSquare api to get new results.
//save results to the current route and updates the parent (mapView)
//re-render results onto the page by updating state variable.
var getFourSquare = function(wayPoints, success) {

  console.log("$$$$$$$$$$ insdie getFourSquare()");
  // var index = currentRoute.queryIndex;
  // if(index<wayPoints.length){
    
  // }
  // var max = index+2; 
  // var results = {}; //test against duplicates
  // var component = this;
  // if(max>wayPoints.length){

  // }
  
  // for(var i=index; i<max; i++){
  for(var i=0; i<wayPoints.length; i++){
    var point = wayPoints[i]; 
    var ll = "&ll=" + point.G+"," + point.K;
    var radius_url = "&radius=" + currentRoute.searchRadius * 1000;

    //These two properties ensure that the data is only displayed once all of the requests have returned
    //It is important for the speed of the app and ensuring that everything works
    // var sortingPoint = wayPoints.length%20-1;
    // var count = 1;

    var {fourSquare_url, foodCategory_url, category_url, limit_url, photos_url, distance_url} = _fourSquare;

    $.ajax({
      url: fourSquare_url + ll + category_url + radius_url + limit_url + photos_url + distance_url,
      method: "GET",
      success: success.bind(point), //success()
      error: function(error){
        console.log("TEST -------> fourSquare error, error=", error);
      }
    }); //ajax()

  }; //for()
} // getFourSquare()


/*** LINUS ***/
// function setCurrentRoute (index) {
//   currentRoute = index;
// }

// function addWaypoints (waypoints) {
//   routeData.push({waypoints: waypoints, index: 1});
// }

/*****************
******************
*STORE CALLBACKS
******************
*****************/

var Store = assign({}, EventEmitter.prototype, {
  /* Payton */

  getRoutes: function() {
    return routes; 
  }, 

  getCurrentRoute: function() {
    return currentRoute; 
  }, 



  /* Linus */
  // getWaypoints: function(){
  //   var temp = routeData[currentRoute].waypoints.slice(routeData[currentRoute].index, 20);
  //   routeData[currentRoute].index+=20;
  //   console.log(temp, routeData[currentRoute].index);
  //   return temp;
  // },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  
  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case Constants.INIT_ROUTES: // initializes after a new trip is defined
      initRoutes(action.newRoutes);  
      Store.emitChange();
      break;

    case Constants.ADD_VENUES:
      addVenues(action.results, action.point);
      Store.emitChange();
      break;

    case Constants.SELECT_ROUTE:
      setCurrentRoute(action.index);
      Store.emitChange();
      break;

    case Constants.PRICE_FILTER: 
      _venueFilters.priceFilter = action.tier;
      currentRoute.filteredVenues = getFilteredArr();
      Store.emitChange();
      break;
    case Constants.RATING_FILTER: 
      _venueFilters.ratingFilter = action.minRating;
      currentRoute.filteredVenues = getFilteredArr();
      Store.emitChange();
      break;
    
    case Constants.OPEN_NOW_FILTER:
      _venueFilters.openNowFilter = !_venueFilters.openNowFilter; 
      currentRoute.filteredVenues = getFilteredArr();
      Store.emitChange();
      break;
    case Constants.CLEAR_FILTER:
      _venueFilters.openNowFilter = false; 
      _venueFilters.ratingFilter = -1; 
      _venueFilters.priceFilter = -1; 
      currentRoute.filteredVenues = getFilteredArr(); 
      Store.emitChange();
      break;


    // case Constants.CLEAR_DATA:
    //     routeData = [];
    //     currentRoute = 0;
    //     break;
    // case Constants.ADD_WAYPOINTS:
    //     addWaypoints(action.wayPoints);
    //     break;

    default:
      // no op
  }
});

module.exports = Store;
