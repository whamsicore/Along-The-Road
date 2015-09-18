/*
This view returns the tool bar to be shown as part of the MapView
*/

var React = require('react');

/**** FLUX ****/
var Actions = require('../actions/Actions');
var RouteStore = require('../stores/RouteStore');

var SelectBox = require('./react-select-box/select-box.js');

/***************
****** MUI *****
****************/
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var {Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator, DropDownMenu, FontIcon, RaisedButton, DropDownIcon} = mui;


var ToolView = React.createClass({
  propTypes: {
    // venueFilters: React.PropTypes.object.isRequired
  },

  childContextTypes: { // MUI: init
    muiTheme: React.PropTypes.object //connect MUI
  },

  getChildContext () { // MUI: set theme
    return {
      muiTheme: ThemeManager.getCurrentTheme() //set MUI theme to default
    };
  },

  getInitialState (){
    return {
      colors: [],
      filters: []
    }
  },

  /* function: componentDidMount
   * ---------------------------
   * This function sets an event listener on the searchbar. It checks for if
   * the searchbar is empty and then clears the search filter or otherwise
   * waits for the enter key to be hit to apply it through the searchVenues
   * and updatList actions.
   */
  componentDidMount() {
    $("#searchBar").keyup(function(e){
      if(e.which == 13 || $("#searchBar").val().length === 0){
        Actions.searchVenues($("#searchBar").val())
        Actions.updateList();
      }
    });
  },

  /* function: updateFilters
   * --------------------------------
   * This function takes in the filters array and calls the actions
   * updateVenueFilters that applies them to the allVenuesArray in the store
   * and then displays it on the map and then updates the list with updateList
  */
  updateFilters: function (filters) {
    Actions.updateVenueFilters(filters);
    Actions.updateList();

    this.setState({ filters: filters });
  },

  render () {
    return (
      <div style={{"backgroundColor": '#555'}}>
        <SelectBox
            label = "Set Filters"
            className = ''
            onChange = {this.updateFilters}
            value = {this.state.filters}
            multiple = {true}
        >{/* SelectBox */}
          <option value='price1'> $ </option>
          <option value='price2'> $$ </option>
          <option value='price3'> $$$+ </option>
          <option value='rating8'> Ratings (8+) </option>
          <option value='rating9'> Ratings (9+) </option>
          <option value='openNowFilter'> Open Now </option>
        </SelectBox>

        <input id="searchBar" placeholder = "Keyword Search" className='filter-input form-control'/>
      </div>
    );
  } //render()
}); // toolView

module.exports = ToolView;