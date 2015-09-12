

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var wayPoints = 1;

var Store = assign({}, EventEmitter.prototype, {


  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },


  getWaypoints: function(){
    wayPoints += 20;
    return wayPoints;
  },

  prevWaypoints: function(){
    return wayPoints;
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

    case Constants.QUERY_WAYPOINTS:
      Store.emitChange();
      break;
    case Constants.CLEAR_DATA:
        wayPoints = 1;
              // Store.emitChange();

        break;

    default:
      // no op
  }
});

module.exports = Store;
