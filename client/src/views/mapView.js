var React = require('react');

var MapView = React.createClass({

  propTypes: {

  },

  defaultOptions: {

  },

  getInitialState () {
    return {
      markers: []
    }
  }, //getInitialState()
  componentDidMount () {
    // console.log("MapView ---> inside componentDidMount");
    
    // QueryStore.addChangeListener(this._onChange)

  },

  componentDidUpdate(prevProps, prevState) {
    // console.log("MapView ---> inside componentDidUpdate ");
    
    this.clearMapMarkers();
    this.updateMapMarkers();
  },

  //Gets the previous number of waypoints and the new number to be querried
  _onChange () {
    // this.clearMapMarkers(); 
    // this.updateMapMarkers(); //results
  },


  // Print new markers
  updateMapMarkers: function(){
    // set to new prop
    var results = this.props.currentRoute.filteredVenues;

    var map = window.map;
    var markers = this.state.markers; //array of
    var component = this;
    results.forEach(function(venue, index){
      var {lng, lat} = venue.location;

      //create new marker only if marker has not been displayed
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
      } //if(marker)

      //display markers
    }); //forEach
  }, //updateMapMarkers()

  // clear map markers
  clearMapMarkers (){

    var markers = this.state.markers;
    var results = this.props.currentRoute.filteredVenues;
    var toKeep = {};  

    var size = 0; 
    for(var i in results) {
      var venueId = results[i].id
      if(markers[venueId]) {
        size++;
        toKeep[venueId] = true;
      }
    }

    for(var key in markers){
      if(!toKeep[key]){
        var marker = markers[key];
        marker.setMap(null);
        delete this.state.markers[key];
      }
    }
   
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