/*
ListView: This view shows the details of the possible routes from origin to destination
*/

var React = require('react');
var VenueView = require('./venueView');

var Actions = require('../actions/Actions.js');
var ListUpdateStore = require('../stores/ListUpdateStore');


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

    // deactivate marker when mouse leave the list-container
    // $(document).on('click', '.react-select-box-options', function(e) {
    //   log('Fuck itii&&&&&&&&&&&&&&&&')
    //   $(e.currentTarget).toggleClass("react-select-box-hidden");
    // });

    $(document).on('mouseenter', '.react-select-box', function(e) {
      // log('currentTarget = ', e.currentTarget)
      $(".react-select-box-options").removeClass("react-select-box-hidden");
    });

  }, //componentDidMount()

  updateList() {
    this.forceUpdate();
  },
  render () {
    var component = this;
    
    if(this.props.currentRoute){
      if(this.props.currentRoute.filteredVenues.length>0){
        var listDetails = this.props.currentRoute.filteredVenues.map(function(venue) {
          return (
            <VenueView venue={venue} origin={component.props.origin}/>
          )
        });
        
        return (
          <div> {listDetails} </div>
        );

      } //if
    }else{
      return null;
    }

  } //render()
});

module.exports = ListView;