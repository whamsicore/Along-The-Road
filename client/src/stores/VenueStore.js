
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var allVenues = [];
var filteredVenues = [];
var ratingFilter = -1;
var priceFilter = -1;


function addVenues(results){
  allVenues = allVenues.concat(results);
  filteredVenues = allVenues;

}

function filter () {
  filteredVenues = [];
  for(var i = 0 ; i < allVenues.length ; i ++) {

    var valid = true;

    //Ratings
    if(ratingFilter !==-1 ){
      if(!allVenues[i].rating){
        valid = false;
      } else if (allVenues[i].rating < ratingFilter){
        valid = false;
      }
    }

    //Price
    if(priceFilter !== -1){
      if(!allVenues[i].price) {
        valid = false;
      } else if (!(allVenues[i].price.tier)){
        valid = false;
      } else if (!(allVenues[i].price.tier === priceFilter) ){
        valid = false;
      }
    }

    if(valid) {
        filteredVenues.push(allVenues[i]);
    }
  }
}


function sortVenues() {
  allVenues.sort(function(a, b) {
    return a.totalDistance - b.totalDistance
  });
}

var Store = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  getVenues: function() {
    filter()
    return filteredVenues;
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
    case Constants.ADD_VENUES:
        addVenues(action.results);
        break;
    case Constants.SORT_VENUES:
        sortVenues();
        Store.emitChange();
        break;
    case Constants.PRICE_FILTER:
        priceFilter = action.tier;
        filter()
        Store.emitChange();
        break;
    case Constants.RATING_FILTER:
        ratingFilter = action.minRating;
        filter();
        Store.emitChange();
        break;
    case Constants.CLEAR_DATA:
        console.log('got here');
        allVenues = [];
        filteredVenues = [];
        ratingFilter = -1;
        priceFilter = -1;
        Store.emitChange();

        break;


    default:
  }
});

module.exports = Store;
