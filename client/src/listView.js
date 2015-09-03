/*
This view shows the details of the possible routes from origin to destination
*/

var React = require('react');

var ListView = React.createClass({
  propTypes: {
    currentRoute: React.PropTypes.object.isRequired
  },
  defaultOptions: {
    // fourSquare_url: "https://api.foursquare.com/v2/venues/search?client_id=LFDSJGGT42FEYM4KFGYR2ETFQZDEMTAVN0KQ0NHBLUXJU4UB&client_secret=YVKQEEBYGFUAMSNFRFEB1MJAEYRXHVBWOL35KFA51ITJBWEE&v=20150902"
  },
  //
  shouldComponentUpdate (nextProps, nextState){
    console.log("TEST ---> inside shouldComponentUpdate() nextProps = ", nextProps);

    // var component = this;
    var currentRoute = nextProps.currentRoute;
    var wayPoints = currentRoute.wayPoints;
    // var data;
    if(wayPoints.length > 0){
      if(currentRoute.results){
        return currentRoute.results;
      }else{
        this.queryFourSquare(wayPoints);
      } //if

     // console.log("wayPoints.length is positive");
     return true;
    }

    return false; //tells React to continue with render()
  },
  //queries fourSquare api to get new results.
  //save results to the current route and updates the parent (mapView)
  //re-render results onto the page by updating state variable.
  queryFourSquare (wayPoints){
    console.log('TEST---->this.getFourSquare() wayPoints = ', wayPoints);
    var results = [];


    // for(var i=0; i<wayPoints.length; i++){
    //   var point = wayPoints[i];
    //   var ll = "&ll="+point.+","+;
    //   $.ajax({
    //     url: this.defaultOptions.fourSquare_url+ll,
    //     method: "GET",
    //     success: function(data){
    //       console.log("TEST -------> fourSquare success, body=", data);

    //     },
    //     error: function(error){
    //       console.log("TEST -------> fourSquare error, error=", error);

    //     }
    //     // dataType: dataType
    //   }); //ajax()

    // } //for

  }, // queryFourSquare()
  // componentWillUpdate (){
  //   console.log("TEST -----> componentWillUpdate");
  // },
  // componentDidMount (){
  //   console.log("TEST inside componentDidMount()");

  // },
  render () {
    var listDetails = this.props.currentRoute.wayPoints.map(function(box, index) {
      return (
        <div key={index}>
          Restaurant {index}
        </div>
      )
    });

    return (
      <div> {listDetails} </div>
    );
  }
});

module.exports = ListView;