/* Saves query information about each route: going to refactor back to overView state -> routes */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var routeData = []; //Stores the last waypoint searched in for that route
var currentRoute = 0;


function setCurrentRoute (index) {
  currentRoute = index;
}

function addWaypoints (waypoints) {
  routeData.push({waypoints: waypoints, index: 1});
}

var Store = assign({}, EventEmitter.prototype, {


  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },


  getWaypoints: function(){
    var temp = routeData[currentRoute].waypoints.slice(routeData[currentRoute].index, 20);
    routeData[currentRoute].index+=20;
    console.log(temp, routeData[currentRoute].index);
    return temp;
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
        routeData = [];
        currentRoute = 0;
        break;
    case Constants.SELECT_ROUTE:
        setCurrentRoute(action.index);
        break;
    case Constants.ADD_WAYPOINTS:
        addWaypoints(action.wayPoints);
        break;


    default:
      // no op
  }
});

module.exports = Store;
