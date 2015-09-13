/*
This view shows the details of the possible routes from origin to destination
*/

var React = require('react');
var VenueView = require('./venueView');

var Actions = require('../actions/Actions.js');
var QueryStore = require('../stores/QueryStore');
var VenueStore = require('../stores/VenueStore');


var ListView = React.createClass({

  propTypes: {
    currentRoute: React.PropTypes.object.isRequired,
    searchRadius: React.PropTypes.number.isRequired
  },

  defaultOptions: {

    fourSquare_url: "https://api.foursquare.com/v2/venues/explore?client_id=ELLZUH013LMEXWRWGBOSNBTXE3NV02IUUO3ZFPVFFSZYLA30&client_secret=U2EQ1N1J4EAG4XH4QO4HCZTGM3FCWDLXU2WJ0OPTD2Q3YUKF&v=20150902",

    foodCategory_url: "&categoryId=4d4b7105d754a06374d81259",
    limit_url: "&limit=10",
    photos_url: "&venuePhotos=1",
    category_url: "&section=food",
    distance_url: "&sortByDistance=0"
  },
  componentDidMount () {
    QueryStore.addChangeListener(this._onChange)
  },

  componentDidUpdate(prevProps, prevState) {
    // if (this.props.currentRoute.wayPoints.length && !this.props.currentRoute.results.length && QueryStore.prevWaypoints()==21) {
    //   this.queryFourSquare(1, 21);
    // }
  },

  //Gets the previous number of waypoints and the new number to be querried
  _onChange () {
    var waypoints = Store.getWaypoints();
    // if (this.props.currentRoute.wayPoints.length && !this.props.currentRoute.results.length) {
    this.queryFourSquare(waypoints);
    // }
  },

  //queries fourSquare api to get new results.
  //save results to the current route and updates the parent (mapView)
  //re-render results onto the page by updating state variable.
  queryFourSquare (wayPoints) {
    var results = {}; //test against duplicates
    var component = this;


    for(var i = 0; i < wayPoints.length ; i++) {
      var point = wayPoints[i];
      var ll = "&ll="+point.G+","+point.K;
      var radius_url = "&radius="+this.props.searchRadius*1000;

      //These two properties ensure that the data is only displayed once all of the requests have returned
      //It is important for the speed of the app and ensuring that everything works
      var sortingPoint = wayPoints.length%20-1;
      var count = 1;

      var {fourSquare_url, foodCategory_url, category_url, limit_url, photos_url, distance_url} = this.defaultOptions;
      $.ajax({
        url: fourSquare_url+ll+category_url+radius_url+limit_url+photos_url+distance_url,
        method: "GET",
        success: function(data){
          count++;
          var newResults = {};
          var newResultsArray = [];
          var venues = data.response.groups[0].items;

          var point = this;
          for (var i = 0; i < venues.length; i++) {
            var venue = venues[i].venue;
            venue.point = point;

            venue.totalDistance = venue.location.distance + venue.point.distance; // in meters
            if (!results[venue.id]) { // if
                newResults[venue.id] = venue;
            } else {
              if (results[venue.id].location.distance > venue.location.distance) {
                newResults[venue.id] = venue;
              }
            } //if
          } //for


          for (var id in newResults) {
            newResultsArray.push(newResults[id]);
          }

          Actions.addVenues(newResultsArray);

          if(count >= sortingPoint){
            Actions.sortVenues();
          }
        }.bind(point), //success()
        error: function(error){
          console.log("TEST -------> fourSquare error, error=", error);
        }
        // dataType: dataType
      }); //ajax()
    } //for

  }, // queryFourSquare()

  render () {
    var component = this;

    var listDetails = VenueStore.getVenues().map(function(venue, index) {
      return (
        <VenueView venue={venue}/>
      )
    });

    return (
      <div> {listDetails} </div>
    );
  }
});

module.exports = ListView;