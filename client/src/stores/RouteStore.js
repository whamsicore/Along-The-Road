var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';

/********* OUR STORE DATA ***********/

var routes = []; //Stores the last waypoint searched in for that route
var currentRoute = 0;
var searchValue = '';
var venueFilters = {
  ratingFilter: 7, //default to seven and above
  price1: false,
  price2: false,
  price3: false,
  price4: false,
  openNowFilter: false,
  categoryFilter: ''
};

var filterArr = [];

/* function: initRoutes
 * ---------------------
 * This function initiates the routes for the store. It defaults the currentRoute
 * to routes[0]
*/
function initRoutes (newRoutes){
  routes = newRoutes;
  currentRoute = routes[0]; //set default currentRoute to first result
} //initRoutes


/* function: sortVenues
 * -------------------------
 * This function sorts the allVenueArray so that the venues do not need to be
 * sorted more than once after being loaded.
*/
function sortVenues() {
  currentRoute.allVenuesArray.sort(function(a,b){
    return a.totalDistance - b.totalDistance;
  });
  currentRoute.filteredVenues = currentRoute.allVenues;
}

/* function: addVenues
 * -------------------------
 * This function takes in the venues object returned from the foursquare request.
 * It then filters out the desired venue data and adds it to the allVenuesObject
 * which is ultimately used to convert it to the allVenuesArray
*/
function addVenues(venue_wrappers, point){
    //NOTE: point is used for calulating total distance, which is equal to distance of point to origin, plus distance of point to venue

    var newResults = {};
    var newResultsArr = [];
    var allVenues = currentRoute.allVenuesObj;

    venue_wrappers.forEach(function(venue_wrapper, i){
      var venue = venue_wrapper.venue;

      /****** Add tip and reason to venue *******/
      if(venue_wrapper.tips){
        var tips = venue_wrapper.tips[0];
        var likes = tips.likes ? tips.likes.count : 0;
        venue.tip = {
          reviewerName:tips.user.firstName,
          reviewerMsg: tips.text,
          likes: likes,
        }
      }
      venue.totalDistance = venue.location.distance + point.distance; // in meters
      //remove duplicate venues
      if (!allVenues[venue.id]) { // if venue does NOT exist already
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
      newResultsArr.push(allVenues[venue_id]); //push value into array
    }
    currentRoute.allVenuesArray = newResultsArr;
    currentRoute.filteredVenues = getFilteredArr(); //NOTE: get back a filtered and sorted array
    currentRoute.marked = "true";
} //addVenues()

function setCurrentRoute (index) {
  //First save the old data
  //Then find current one and set data to that
  currentRoute = routes[index];
}

/* function: getFilteredArr
 * -------------------------
 * This function applies the filters to the allVenuesArray to create the filteredVenues
 * array that is used on the map. The filtered array is then stored on the route object and is
 * used by the map and list views.
*/
function getFilteredArr () {
  var filteredVenues = [];
  var allVenues = currentRoute.allVenuesArray;
  var categoryFilter = venueFilters.categoryFilter;
  var price1 = filterArr.indexOf('price1')!==-1 ? true : false;
  var price2 = filterArr.indexOf('price2')!==-1 ? true : false;
  var price3 = filterArr.indexOf('price3')!==-1 ? true : false;
  var price4 = filterArr.indexOf('price4')!==-1 ? true : false;
  var rating9 = filterArr.indexOf('rating9')!==-1 ? true : false;
  var rating8 = filterArr.indexOf('rating8')!==-1 ? true : false;
  var openNowFilter = filterArr.indexOf('openNowFilter')!==-1 ? true : false;

  for(var id = 0; id < allVenues.length; id ++) {
    var venue = allVenues[id];
    var valid = true;
    if(undefined ===venue.rating) valid = false;

    //Category Filter
    if(categoryFilter !== "") {
      if(venue.categories[0].shortName.slice(0,categoryFilter.length).toLowerCase() !== categoryFilter.toLowerCase()){

        valid = false;
      }
    }

    if(rating8){ //now only filtering high rating restaurants
      if (venue.rating < 8){
        if(!venue.rating) valid = false;
        valid = false;
      }
    } //if(rating)
    // Ratings Filter
    if(rating9){ //now only filtering high rating restaurants
      if (venue.rating < 9){
        valid = false;
      }
    } //if(rating)

    //Price Filter
    if(price1 || price2 || price3){
      if(!venue.price) { //if no price rating return false
        valid = false;
      } else if (!(venue.price.tier)){
        valid = false;
      } else{
        if(venue.price.tier === 1  && !price1){
          valid = false;
        }else if(venue.price.tier === 2  && !price2){
          valid = false;
        }else if((venue.price.tier === 3 || venue.price.tier === 4 ) && !price3){ //displays both $$$ and $$$$ if restaurant
          valid = false;
        }else if(venue.price.tier === 4  && !price4){
          valid = false;
        }//if
      }//if
    } //if

    //Open now filter
    if(openNowFilter){
      if(!venue.hours || !venue.hours.isOpen){
        valid = false;
      }
    }

    //Search Bar
    if(searchValue.length !== 0){
      var exp = new RegExp(searchValue, "i");

      if(venue.name.search(exp)=== -1 && venue.categories[0].name.search(exp) === -1) {
        valid = false;
      }
    }

    if(valid) {
        filteredVenues.push(venue);
    }

  } //for(allVenues)
  currentRoute.filteredVenues = filteredVenues;
} //getFilteredArr()

var updateFilters = function(newFilterArr){
  filterArr = newFilterArr;

} //updateFilters()

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

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

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
      getFilteredArr();
      Store.emitChange();
      break;
    case Constants.SELECT_ROUTE:
      setCurrentRoute(action.index);
      Store.emitChange();
      break;
    case Constants.UPDATE_VENUE_FILTERS:
      updateFilters(action.filterArr)
      getFilteredArr();
      Store.emitChange();
      break;
    case Constants.OPEN_NOW_FILTER:
      _venueFilters.openNowFilter = !_venueFilters.openNowFilter;
      getFilteredArr();
      Store.emitChange();
      break;
    case Constants.CLEAR_FILTER:
      filterArr = [];
      getFilteredArr();
      Store.emitChange();
      break;
    case Constants.SORT_VENUES:
      sortVenues();
      getFilteredArr();
      Store.emitChange();
      break;
    case Constants.CATEGORY_FILTER:
      _venueFilters.categoryFilter = action.categoryFilter;
      getFilteredArr();
      Store.emitChange();
      break;
    case Constants.SEARCH_VENUES:
      searchValue = action.searchValue;
      getFilteredArr();
      Store.emitChange();
      break;

    default:
  }
});

module.exports = Store;
