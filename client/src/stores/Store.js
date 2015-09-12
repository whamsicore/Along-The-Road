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

var wayPoints = 1;

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


var Store = assign({}, EventEmitter.prototype, {

  /**
   * Tests whether all the remaining TODO items are marked as completed.
   * @return {boolean}
   */
  areAllComplete: function() {
    for (var id in _todos) {
      if (!_todos[id].complete) {
        return false;
      }
    }
    return true;
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    return _todos;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  printShit: function(){
    console.log("Fuck this shit")
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
    case Constants.TODO_CREATE:
      // text = action.text.trim();
      // if (text !== '') {
        // create(text);
        console.log('Hello');
        Store.emitChange();
      break;

    case Constants.QUERY_WAYPOINTS:
      Store.emitChange();
      break;
    // case TodoConstants.TODO_TOGGLE_COMPLETE_ALL:
    //   if (TodoStore.areAllComplete()) {
    //     updateAll({complete: false});
    //   } else {
    //     updateAll({complete: true});
    //   }
    //   TodoStore.emitChange();
    //   break;



    default:
      // no op
  }
});

module.exports = Store;
