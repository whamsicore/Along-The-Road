/* Saves query information about each route: going to refactor back to overView state -> routes */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var routeData = []; //Stores the last waypoint searched in for that route
var currentRoute = 0;

var Store = assign({}, EventEmitter.prototype, {

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

    case Constants.UPDATE_LIST:
      Store.emitChange();
      break;



    default:
      // no op
  }
});

module.exports = Store;
