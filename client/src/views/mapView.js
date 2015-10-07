/*** MapView ***/
//NOTE: Mapview only renders the DOM once. From then on, it only renders inside the google map via api controls
var React = require('react');

var MapView = React.createClass({

  propTypes: {

  },

  defaultOptions: {

  },

  getInitialState () {
    return {
      displayedMarkers: []
    }
  }, //getInitialState()
  componentDidMount () {
    // console.log("MapView ---> inside componentDidMount");

    // QueryStore.addChangeListener(this._onChange)

  },

  componentDidUpdate(prevProps, prevState) {
    // console.log("MapView ---> inside componentDidUpdate ");
    // if(prevProps.currentRoute)
    // this.clearMapMarkers();
    // this.updateMapMarkers();
  },

  shouldComponentUpdate(prevProps, prevState) {
    var prevRoute = this.props.currentRoute;
    var newRoute = prevProps.currentRoute;
    if(prevRoute && newRoute){

      // console.log("************** prevProps = ", prevProps);
      // console.log("************** currentRoute = ", this.props.currentRoute);
      // if(prevProps.currentRoute.index !== this.props.currentRoute.index){
      // }
      if(prevRoute.index !== newRoute.index){
        console.log("************** New Route has been set");
        this.clearMapMarkers();
      }
    }else{ // currentRoute has changed
      this.clearMapMarkers();
    } //

    this.updateMapMarkers(newRoute.filteredVenues);

    return false;
  },

  //Gets the previous number of waypoints and the new number to be querried
  _onChange () {
    // this.clearMapMarkers();
    // this.updateMapMarkers(); //newVenuesArr
  },


  // Print new markers ()
  updateMapMarkers: function(newVenuesArr){
    // we are going to check markers array has already been printed
    // var newVenuesArr = this.props.currentRoute.filteredVenues;

    var map = window.map;
    var displayedMarkers = this.state.displayedMarkers; //array of
    var component = this;

    /**** remove unnecessary displayedMarkers ****/
    for(var venue_id in displayedMarkers){
      var marker = displayedMarkers[venue_id];

      var found = newVenuesArr.filter(function(venue){
        return venue_id === venue.id;
      });

      if(found.length===0){ //not found
        marker.setMap(null);
        delete displayedMarkers[venue_id]; //delete marker from displayed markers
      } //if

    };

    /**** print un ****/
    newVenuesArr.forEach(function(venue, index){

      var {lng, lat} = venue.location;

      //create new marker only if marker has not been displayed
      if(!displayedMarkers[venue.id]){ //
        var position = new google.maps.LatLng(lat, lng);

        var marker = new google.maps.Marker({
          position: position,
        });

        // create custom infowindow
        // NOTE: we can also add rating color to decorate marker
        var infowindow = new google.maps.InfoWindow({
          content: venue.name + "<br> Rating: "+venue.rating
        });

        var markerIsActive = false;

        //create event listener to open info window
        google.maps.event.addListener(marker, 'mouseover', function() {
          if(!markerIsActive){
            infowindow.open(map, this);
          }
        }); //mouseover

        // create event listener to close info window
        google.maps.event.addListener(marker, 'mouseout', function() {
          if(!markerIsActive){
            infowindow.close();
          }
        }); //mouseout

        // create event listener to close info window
        google.maps.event.addListener(marker, 'click', function() {
          if(markerIsActive){ // deactivate this marker
            markerIsActive = false;
            infowindow.close();


          }else if(!markerIsActive){ //activate this marker
            markerIsActive = true;
            if(window.activeInfoWindow){
              window.activeInfoWindow.close(); //close previous
            }
            window.activeInfoWindow = infowindow; //update current;
          } //if
        }); //mouseout

        google.maps.event.addListener(marker, 'dblclick', function() {
          component.openFourSquare(venue); //load new page

        });

        //show map marker
        marker.setMap(map);
        // add current marker to state
        component.state.displayedMarkers[venue.id] = marker;
        // component.state.displayedMarkers.push(marker);
      } //if(marker)

      //display markers
    }); //forEach
  }, //updateMapMarkers()

  // clear map markers
  clearMapMarkers (){
    var markers = this.state.markers;

    for(var key in markers){
      var marker = markers[key];
      marker.setMap(null);
    } //for

    this.state.markers = {};
  }, //clearMapMarkers

  render () {
    // var component = this;

    // var listDetails = VenueStore.getVenues().map(function(venue, index) {
    //   return (
    //     <VenueView venue={venue}/>
    //   )
    // });

    return (
      <div id = "map">  </div>
    );
  }
});

module.exports = MapView;