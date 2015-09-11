/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoActions
 */

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
  }

};

module.exports = Actions;