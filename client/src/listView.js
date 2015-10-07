/*
This view shows the details of the possible routes from origin to destination
*/

var React = require('react');

var ListView = React.createClass({
  propTypes: {
    currentRoute: React.PropTypes.object.isRequired
  },
  defaultOptions: {
    fourSquare_url: "https://api.foursquare.com/v2/venues/search?client_id=LFDSJGGT42FEYM4KFGYR2ETFQZDEMTAVN0KQ0NHBLUXJU4UB&client_secret=YVKQEEBYGFUAMSNFRFEB1MJAEYRXHVBWOL35KFA51ITJBWEE&radius=5000&v=20150902",
    foodCategory_url: "&categoryId=4d4b7105d754a06374d81259",
    radius_url: "&radius=5000"
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
    console.log('TEST---->this.getFourSquare() wayPoints = ', wayPoints);
    var results = {}; //test against duplicates
    var component = this;

    for(var i=1; i<wayPoints.length; i++){
      var point = wayPoints[i];
      var ll = "&ll="+point.G+","+point.K;
      var {fourSquare_url, foodCategory_url, radius_url} = this.defaultOptions;
      $.ajax({
        url: fourSquare_url+ll+foodCategory_url+radius_url,
        method: "GET",
        success: function(data){
          console.log("TEST -------> fourSquare success, body=", data);
          var venues = data.response.venues;

          // loops through venues and adds them to results object and also removes duplicates by only saving the duplicate venue with the smallest distance property
          for (var i = 0; i < venues.length; i++) {
            if (!results[venues[i].id]) { // if
                results[venues[i].id] = venues[i];
            } else {
              if (results[venues[i].id].distance > venues[i].distance) {
                results[venues[i].id] = venues[i];
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
    console.log(this.props.currentRoute.results);
    var listDetails = this.props.currentRoute.results.map(function(venue, index) {
      return (
        <div key={index}>
          Restaurant {venue.name}
        </div>
      )
    });

    return (
      <div> {listDetails} </div>
    );
  }
});

module.exports = ListView;