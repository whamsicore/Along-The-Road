/*
This view shows the details of the possible routes from origin to destination
*/

var React = require('react');
var VenueView = require('./venueView')

var ListView = React.createClass({
  propTypes: {
    currentRoute: React.PropTypes.object.isRequired,
    updateResults: React.PropTypes.func.isRequired
  },
  defaultOptions: {
    fourSquare_url: "https://api.foursquare.com/v2/venues/explore?client_id=LFDSJGGT42FEYM4KFGYR2ETFQZDEMTAVN0KQ0NHBLUXJU4UB&client_secret=YVKQEEBYGFUAMSNFRFEB1MJAEYRXHVBWOL35KFA51ITJBWEE&radius=5000&v=20150902",
    // foodCategory_url: "&categoryId=4d4b7105d754a06374d81259",
    limit_url: "&limit=10",
    photos_url: "&venuePhotos=1",
    category_url: "&section=food",
    distance_url: "&sortByDistance=0"
  },
  // NOTE: nextProps should equal a currentRoute polyLine
  // We should only render when a route which has .results property has been passed in
  shouldComponentUpdate (nextProps, nextState){
    var currentRoute = nextProps.currentRoute;
    var wayPoints = currentRoute.wayPoints;
    if(wayPoints.length > 0){ // only continue if waypoints have been set
      if(currentRoute.results){ // render the results if they have been obtained
        return true;
      }else{ // query for new results only if currentRoute doesn't have them yet
        this.queryFourSquare(wayPoints);
        return false;
      } //if
    }else{  //don't render anything
      return false;
    } //if
  },
  //queries fourSquare api to get new results.
  //save results to the current route and updates the parent (mapView)
  //re-render results onto the page by updating state variable.
  queryFourSquare (wayPoints){
    var results = {}; //test against duplicates
    var component = this;

    for(var i=1; i<wayPoints.length; i++){
      var point = wayPoints[i];
      var ll = "&ll="+point.G+","+point.K;
      var radius_url = this.props.searchRadius*1000;

      var {fourSquare_url, category_url, limit_url, photos_url, distance_url} = this.defaultOptions;
      $.ajax({
        url: fourSquare_url+ll+category_url+radius_url+limit_url+photos_url+distance_url,
        method: "GET",
        success: function(data){
          var venues = data.response.groups[0].items;

          // loops through venues and adds them to results object and also removes duplicates by only saving the duplicate venue with the smallest distance property
          for (var i = 0; i < venues.length; i++) {
            var venue = venues[i].venue; 
            if (!results[venue.id]) { // if
                results[venue.id] = venue;
            } else {
              if (results[venue.id].distance > venue.distance) {
                results[venue.id] = venue;
              }
            } //if
          } //for

          var resultsArray = [];
          for (var id in results) {
            resultsArray.push(results[id]);
          }
          component.props.updateResults(resultsArray);

        }, //success()
        error: function(error){
          console.log("TEST -------> fourSquare error, error=", error);

        }
        // dataType: dataType
      }); //ajax()

    } //for

  }, // queryFourSquare()
  /************* Sample Venue **********/
  // {"id":"4cfae4ecdccef04d382cb89c",
  // "name":"New Ringgold Fire Co",
  // "contact":{},
  // "location":{"lat":40.68752093923294,"lng":-75.99987570958817,"distance":1389,"postalCode":"17960","cc":"US","city":"New Ringgold","state":"PA","country":"United States","formattedAddress":["New Ringgold, PA 17960","United States"]},
  // "categories":[{"id":"4bf58dd8d48988d116941735","name":"Bar","pluralName":"Bars","shortName":"Bar","icon":{"prefix":"https:\/\/ss3.4sqi.net\/img\/categories_v2\/nightlife\/pub_","suffix":".png"},"primary":true}],
  // "verified":false,
  // "stats":{"checkinsCount":101,"usersCount":55,"tipCount":0},
  // "allowMenuUrlEdit":true,"specials":{"count":0,"items":[]},"hereNow":{"count":0,"summary":"Nobody here","groups":[]},"referralId":"v-1441238271"}
  /************* Sample Venue **********/
  render () {
    var listDetails = this.props.currentRoute.results.map(function(venue, index) {
      return (
        <VenueView venue={venue} />
      )
    });

    return (
      <div> {listDetails} </div>
    );
  }
});

module.exports = ListView;