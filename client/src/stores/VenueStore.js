/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var allVenues = [];
var filteredVenues = [];
var ratingFilter = -1;
var priceFilter = -1;


/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */
function create(text) {
  // Hand waving here -- not showing how this interacts with XHR or persistent
  // server-side storage.
  // Using the current timestamp + random number in place of a real id.
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _todos[id] = {
    id: id,
    complete: false,
    text: text
  };
}



function addVenues(results){
  allVenues = allVenues.concat(results);
  filteredVenues = allVenues;
  // console.log(venues)

}

function filter () {
  filteredVenues = [];
  for(var i = 0 ; i < allVenues.length ; i ++) {

    var valid = true;

    if(ratingFilter !==-1 ){
      if(!allVenues[i].rating){
              console.log(allVenues[i].rating)

        valid = false;
      } else if (allVenues[i].rating < ratingFilter){
              console.log(allVenues[i].rating)

        valid = false;
      }
    }

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
    return filteredVenues;
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
    case Constants.ADD_VENUES:
        addVenues(action.results);
        // Store.emitChange();
        break;
    case Constants.SORT_VENUES:
        sortVenues();
        Store.emitChange();
        break;
    case Constants.PRICE_FILTER:
        priceFilter = action.tier;
        filter()
        Store.emitChange();
    case Constants.RATING_FILTER:
        ratingFilter = action.minRating;
        filter();
        Store.emitChange();



    default:
      // no op
  }
});

module.exports = Store;
