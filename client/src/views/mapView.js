/*** MapView ***/
//NOTE: Mapview only renders the DOM once. From then on, it only renders inside the google map via api controls
var React = require('react');
var MapHelper = require('../helpers/mapHelpers');
var MapMarkerStore = require('../stores/MapMarkerStore');
var MapView = React.createClass({

  propTypes: {
    currentRoute: React.PropTypes.object,
    origin: React.PropTypes.string
  },

  defaultOptions: {

  },

  getInitialState () {
    return {
      displayedMarkers: []
    }
  }, //getInitialState()
  componentDidMount () {
    MapMarkerStore.addChangeListener(this._onChange)
  
  },

  shouldComponentUpdate(prevProps, prevState) {

    //clear map markers only if the route is being changed

    var prevRoute = this.props.currentRoute;
    var newRoute = prevProps.currentRoute;
    if(prevRoute && newRoute){

      if(prevRoute.index !== newRoute.index){
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
    this.changePoppedMarker();
  },


  openFourSquare: function (venue) {
    var url = "https://foursquare.com/v/"+escape(venue.name)+"/"+venue.id;
    return url;
  },

  openDirections: function(venue) {
    var origin = this.props.origin;
    var url = "https://www.google.com/maps/dir/" + origin+ "/" + venue.location.lat +"," +venue.location.lng
    return url;
  },

  changePoppedMarker (){
    var map = window.map;

    var newMarker = this.state.displayedMarkers[MapMarkerStore.getActiveVenue()];
    var prevMarker = this.state.displayedMarkers[MapMarkerStore.getPrevVenue()];

    if(newMarker){
      // newMarker.setAnimation(google.maps.Animation.BOUNCE);
      newMarker.infowindow.open(map, newMarker);
    }

    if(prevMarker){ //if a previous marker has been set
      // prevMarker.setAnimation(null);
      prevMarker.infowindow.close();
    } //if
  }, //popMarker()

  // Print new markers ()
  updateMapMarkers: function(newVenuesArr){
    // we are going to check markers array has already been printed
    // var newVenuesArr = this.props.currentRoute.filteredVenues;
    var map = window.map;
    var displayedMarkers = this.state.displayedMarkers; //array of
    var component = this;
    /**** remove unnecessary displayedMarkers ****/
    var toKeep = {};
    var toAdd = [];
    for(var i = 0 ; i < newVenuesArr.length; i ++) {
      var id = newVenuesArr[i].id;
      if(displayedMarkers[id]){
        toKeep[id] = true;
      } else {
        toAdd.push(newVenuesArr[i]);
      }
    }

    for(var venue_id in displayedMarkers){

      if(!toKeep[venue_id]){
        var marker = displayedMarkers[venue_id];

        marker.setMap(null);
        delete displayedMarkers[venue_id]; //delete marker from displayed markers
      }
    };
    /**** print un ****/
    toAdd.forEach(function(venue, index){

      var {lng, lat} = venue.location;

      //create new marker only if marker has not been displayed
      if(!displayedMarkers[venue.id]){ //
        var image = '../../images/orange.png'
        if(venue.rating >= 7) image = '../../images/orange.png';
        if(venue.rating >= 8) image = '../../images/yellow.png';
        if(venue.rating >= 9) image = '../../images/green.png';


        var priceStr = "N/A";
        if(venue.price){
          if(venue.price.tier===1) priceStr ="$";
          if(venue.price.tier===2) priceStr ="$$";
          if(venue.price.tier===3) priceStr ="$$$";
          if(venue.price.tier===4) priceStr ="$$$$";
          
        }

        var position = new google.maps.LatLng(lat, lng);

        var marker = new google.maps.Marker({
          position: position,
          icon: image
        });
        if(venue.photos.groups[0]){
          var venueImage = venue.photos.groups[0].items[0].prefix+"110x110"+ venue.photos.groups[0].items[0].suffix;
        }
        // create custom infowindow
        // NOTE: we can also add rating color to decorate marker
        var infowindow = new google.maps.InfoWindow({
          content: '<img border="0" align="Left" src='+ venueImage+ '  style="width: 80px; height: 80px">' + "<strong>" + 
          venue.name + "</strong>"+ "<br/> Rating: "+venue.rating +  "<br/>" + "Price: "+ priceStr +  "<br/>" +
          "<a href="+ component.openDirections(venue) + " target='_blank'><div float='right'>Directions</div></a>" + "<br/>" +
          "<a href=" + component.openFourSquare(venue) + " target='_blank'><div float='right'>Details</div></a>"
        });

        marker.infowindow = infowindow;

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
          MapHelper.openFourSquare(venue); //load new page
          
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