var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var Actions = {

  initRoutes: function(newRoutes) { //get all routes and save to RouteStore
    AppDispatcher.dispatch({
      actionType: Constants.INIT_ROUTES,
      newRoutes
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
    AppDispatcher.dispatch({
      actionType: Constants.UPDATE_VENUE_FILTERS,
      filterArr
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
    // console.log("Actions ----> selectRoute, index ="+index)
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_ROUTE,
      index: index
    });
  },
  selectVenue: function(venue_id) {
    console.log("Actions ----> selectVenue")
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

  searchVenues: function(searchValue) {
    AppDispatcher.dispatch({
      actionType: Constants.SEARCH_VENUES,
      searchValue: searchValue
    })
  },
  selectMapMarker: function(venue_id) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_MAPMARKER,
      venue_id: venue_id
    })
  }

};

module.exports = Actions;