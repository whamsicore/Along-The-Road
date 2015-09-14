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
    console.log("Actions ----> Query")
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
    console.log("Actions ----> sortVenues")
    AppDispatcher.dispatch({
      actionType: Constants.SORT_VENUES
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
    console.log("Actions ----> ratingFilter")
    AppDispatcher.dispatch({
      actionType: Constants.RATING_FILTER,
      minRating: minRating
    })
  },
  clearData: function() {
    console.log("Actions ----> clearData")
    AppDispatcher.dispatch({
      actionType: Constants.CLEAR_DATA
    });
  },
  openNowFilter: function() {
    console.log("Actions ----> openNowFilter")
    AppDispatcher.dispatch({
      actionType: Constants.OPEN_NOW_FILTER,
    });
  },
  clearFilter: function() {
    console.log("Actions ----> clearFilter")
    AppDispatcher.dispatch({
      actionType: Constants.CLEAR_FILTER,
    });
  },
  selectRoute: function(index) {
    console.log("Actions ----> selectRoute")
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_ROUTE,
      index: index
    });
  },
  addWaypoints: function(wayPoints){
    console.log("Actions ----> addWaypoints")
    AppDispatcher.dispatch({
      actionType: Constants.ADD_WAYPOINTS,
      wayPoints: wayPoints
    })
  }

};

module.exports = Actions;