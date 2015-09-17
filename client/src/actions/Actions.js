var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var Actions = {

  // What does this do?
  initRoutes: function(newRoutes) { //get all routes and save to RouteStore
    AppDispatcher.dispatch({
      actionType: Constants.INIT_ROUTES,
      newRoutes
    });    
  }, 

  /********* LEGACY ********/

  query: function() {
    AppDispatcher.dispatch({
      actionType: Constants.QUERY_WAYPOINTS,
    });
  },

  addVenues: function(results, point){
    // console.log("Actions ----> addVenues")
    AppDispatcher.dispatch({
      actionType: Constants.ADD_VENUES,
      results: results, 
      point: point
    });
  },

  sortVenues: function() {
    AppDispatcher.dispatch({
      actionType: Constants.SORT_VENUES
    });
  },

  updateVenueFilters: function(filterArr){
    console.log("Actions ----> updateVenueFilters")

    AppDispatcher.dispatch({
      actionType: Constants.UPDATE_VENUE_FILTERS,
      filterArr
    });
  },

  priceFilter: function(tier){
    console.log("Actions ----> priceFilter")
    AppDispatcher.dispatch({
      actionType: Constants.PRICE_FILTER,
      tier: tier
    });
  },
  ratingFilter: function(minRating) {
    AppDispatcher.dispatch({
      actionType: Constants.RATING_FILTER,
      minRating: minRating
    })
  },
  clearData: function() {
    AppDispatcher.dispatch({
      actionType: Constants.CLEAR_DATA
    });
  },
  openNowFilter: function() {
    AppDispatcher.dispatch({
      actionType: Constants.OPEN_NOW_FILTER,
    });
  },
  clearFilter: function() {
    AppDispatcher.dispatch({
      actionType: Constants.CLEAR_FILTER,
    });
  },
  selectRoute: function(index) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_ROUTE,
      index: index
    });
  },
  selectVenue: function(venue_id) {
    // console.log("Actions ----> selectVenue")
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_VENUE,
      venue_id: venue_id
    });
  },
  addWaypoints: function(wayPoints){
    AppDispatcher.dispatch({
      actionType: Constants.ADD_WAYPOINTS,
      wayPoints: wayPoints
    })
  },
  updateList: function() {
    AppDispatcher.dispatch({
      actionType: Constants.UPDATE_LIST,
    });
  },
  categoryFilter: function(categoryFilter){
    AppDispatcher.dispatch({
      actionType: Constants.CATEGORY_FILTER,
      categoryFilter: categoryFilter
    })
  },
  searchVenues: function(searchValue) {
    AppDispatcher.dispatch({
      actionType: Constants.SEARCH_VENUES,
      searchValue: searchValue
    })
  }

};

module.exports = Actions;