var React = require('react');

var MapView = React.createClass({

  propTypes: {

  },

  defaultOptions: {

  },
  componentDidMount () {
    console.log("MapView ---> inside componentDidMount");

    // QueryStore.addChangeListener(this._onChange)

  },

  componentDidUpdate(prevProps, prevState) {
    console.log("MapView ---> inside componentDidUpdate ");

  },

  //Gets the previous number of waypoints and the new number to be querried
  _onChange () {
    // this.clearMapMarkers();
    // this.updateMapMarkers(); //results
  },


  // Print new markers
  updateMapMarkers(results){
    // set to new prop
    results = this.props.results;

    var map = this.state.map;
    var markers = this.state.markers; //array of
    var component = this;

    results.forEach(function(venue, index){
      var {lng, lat} = venue.location;

      //create new marker
      if(!markers[venue.id]){ //
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
        component.state.markers[venue.id] = marker;
        // component.state.markers.push(marker);
      } //if

      //display markers
    }); //forEach
  }, //updateMapMarkers()

  // clear map markers
  clearMapMarkers (markers){
    this.state.markers = {};

    for(var key in markers){
      var marker = markers[key];
      marker.setMap(null);
    } //for
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