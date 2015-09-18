/*
ListView: This view shows the details of the possible routes from origin to destination
*/

var React = require('react');
var VenueView = require('./venueView');

var Actions = require('../actions/Actions.js');
var ListUpdateStore = require('../stores/ListUpdateStore');
var CurrentVenueStore = require('../stores/CurrentVenueStore');
var MapMarkerStore  = require('../stores/MapMarkerStore');


var ListView = React.createClass({


  propTypes: {
    currentRoute: React.PropTypes.object
  },

  shouldComponentUpdate () {
    return false;
  },

  defaultOptions: {
    colors: {
      defaultColor: '#FFF',
      hoverColor: '#ddd'

    }
    
  },

  componentDidMount () {

    /*******  INIT LISTVIEW UX ********/
    var {hoverColor, defaultColor} = this.defaultOptions.colors;
    ListUpdateStore.addChangeListener(this.updateList);
    CurrentVenueStore.addChangeListener(this.scrollToVenue);

    $(document).on('mouseenter', '.card', function(e) {
      $(e.currentTarget).css({'background-color': hoverColor});

      //update map markers to show active venue
      var venue_id = $(e.currentTarget).attr('id');
      Actions.selectVenue(venue_id);
    });

    $(document).on('mouseleave', '.card', function(e) {
      $(e.currentTarget).css({'background-color': defaultColor})
    });

    // deactivate marker when mouse leave the list-container
    $(document).on('mouseleave', '.list-container', function(e) {
      Actions.selectVenue("");
    });

    // deactivate marker when mouse leave the list-container
    $(document).on('mouseleave', '.react-select-box-options', function(e) {
      // log('currentTarget = ', e.currentTarget)
      $(e.currentTarget).addClass("react-select-box-hidden");
    });

    $(document).on('mouseenter', '.react-select-box', function(e) {
      // log('currentTarget = ', e.currentTarget)
      $(".react-select-box-options").removeClass("react-select-box-hidden");
    });

  }, //componentDidMount()

  componentWillUnmount (){
    ListUpdateStore.removeChangeListener(this.updateList);

  },

  /* function: updateList
   * ---------------------
   * This function is invoked when the listUpdateStore emits a change. It 
   * forces the component to update to handle issues of constant rerendering 
   * that slowed down the program. 
  */
  updateList() {
    this.forceUpdate();
  },

  scrollToVenue () {
    var venues = this.props.currentRoute.filteredVenues;
    var activeVenueId = CurrentVenueStore.getActiveVenue();
    
    var venueId = "#" + activeVenueId.toString();
    var container = $('#list'),
        scrollTo = $(venueId);
      console.log(venueId)
    // container.scrollTop(
    //     scrollTo.offset().top - container.offset().top + container.scrollTop()
    // );
    container.animate({
      scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()-60
    });
   },
  render () {
    var component = this;

    if(this.props.currentRoute){
      var listDetails = this.props.currentRoute.filteredVenues.map(function(venue) {
        return (
          <VenueView  key={venue.id} venue={venue} origin={component.props.origin} id={venue.id.toString()}/>
        )
      });
      
    }else{
      var listDetails = null;
    }
    
    return (
      <div > {listDetails} </div>
    ); 

  } //render()
});

module.exports = ListView;