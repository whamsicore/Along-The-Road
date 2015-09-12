var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var Actions = {


  query: function() {
    AppDispatcher.dispatch({
      actionType: Constants.QUERY_WAYPOINTS,
    });
  },

  addVenues: function(results){
    AppDispatcher.dispatch({
      actionType: Constants.ADD_VENUES,
      results: results
    });
  },

  sortVenues: function() {
    AppDispatcher.dispatch({
      actionType: Constants.SORT_VENUES
    });
  },

  priceFilter: function(tier){
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
  }

};

module.exports = Actions;