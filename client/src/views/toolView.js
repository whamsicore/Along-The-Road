/*
This view returns the tool bar to be shown as part of the MapView
*/

var React = require('react');
var Actions = require('../actions/Actions')
/***************
****** MUI *****
****************/
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var {Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator, DropDownMenu, FontIcon, RaisedButton, DropDownIcon} = mui;


var ToolView = React.createClass({
  // propTypes: {

  // },
  childContextTypes: { // MUI: init
    muiTheme: React.PropTypes.object //connect MUI
  },
  getChildContext () { // MUI: set theme
    return {
      muiTheme: ThemeManager.getCurrentTheme() //set MUI theme to default
    };
  },

  render () {
    return (
      <div className = "container">
          {/*<button onClick={this.loadMore}>Load More</button>*/}
          <button onClick={this.props.loadMore}>Load More</button>
          <button onClick={function(){Actions.priceFilter(1)}}>$</button>
          <button onClick={function(){Actions.priceFilter(2)}}>$$</button>
          <button onClick={function(){Actions.priceFilter(3)}}>$$$</button>
          <button onClick={function(){Actions.ratingFilter(7)}}>7+</button>
          <button onClick={function(){Actions.ratingFilter(8)}}>8+</button>
          <button onClick={function(){Actions.ratingFilter(9)}}>9+</button>
          <button onClick={function(){Actions.clearFilter();}}>Clear Filters</button>
          <button onClick={function(){Actions.openNowFilter();}}>Open Now</button>
          {/*<button onClick={function(){Actions.clearData();}}>Clear Data</button>*/}


      </div>
    );
  } //render()
}); // toolView

module.exports = ToolView;