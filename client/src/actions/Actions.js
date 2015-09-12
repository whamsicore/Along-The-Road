
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var Actions = {

  /**
   * @param  {string} text
   */
  create: function(text) {
	console.log('got here')
    AppDispatcher.dispatch({
      actionType: Constants.TODO_CREATE,
      // text: text
    });
  },

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
  }

};

module.exports = Actions;