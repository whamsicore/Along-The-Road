/*
This view shows the details of each venue
*/

var React = require('react');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var {Card, CardHeader, CardMedia, CardActions, CardText, Avatar, CardTitle} = mui;


var VenueView = React.createClass({
  propTypes: {
    venue: React.PropTypes.object.isRequired
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  
  render () {
    var {featuredPhotos, name, contact, hours, categories, location, menu, price, rating, ratingColor, stats, url} = this.props.venue;

    if (categories) {
      var categoryList = categories.map(function(category, index) {
        return category.shortName;
      });
    }

    if (featuredPhotos && featuredPhotos.items && featuredPhotos.items.length) {
      var photoUrl = featuredPhotos.items[0].prefix + "100x100" + featuredPhotos.items[0].suffix;
    }


    // <img src={photoUrl ? photoUrl : "https://foursquare.com/img/categories/food/default_64.png"}/>
    // {name}
    // {location.formattedAddress[0] ? location.formattedAddress[0] : null}
    // {Math.round(location.distance/1000*.621*10)/10} mi.
    // {rating ? rating : null}
    // {price && price.message ? price.message : null}
    // {categoryList ? categoryList : null}
    // {hours && hours.status ? hours.status : null}

    // <Card>
    //   <CardHeader
    //     title={name}
    //     subtitle={categoryList ? categoryList : null} />
    //   <CardMedia>
    //     <img src={photoUrl ? photoUrl : "https://foursquare.com/img/categories/food/default_64.png"}/>
    //   </CardMedia>
    //   <CardActions>
    //     <FlatButton label="Show Details" />
    //   </CardActions>
    //   <CardText>
    //     {location.formattedAddress[0] ? location.formattedAddress[0] : null}
    //     {Math.round(location.distance/1000*.621*10)/10} mi.
    //     {rating ? rating : null}
    //     {price && price.message ? price.message : null}
    //     {hours && hours.status ? hours.status : null}
    //   </CardText>
    // </Card>
    
    var avatar = (
      <Avatar 
        src={photoUrl ? photoUrl : "https://foursquare.com/img/categories/food/default_64.png"}
        size={70}>
      </Avatar>
    );

    var msgToDollarSigns = {
      Cheap: "$",
      Moderate: "$$",
      Expensive: "$$$"
    };


    var categoryText = categoryList ? categoryList.join("/") : "N/A";
    var priceText = price && price.message ? msgToDollarSigns[price.message] : "N/A";
    var ratingText = rating ? rating : "N/A";
    var distanceText = Math.round(location.distance/1000*.621*10)/10 + " mi.";

    var subtitleInfo = [categoryText, priceText, ratingText, distanceText];

    return (
      <Card>
        <div className="col-xs-1" >
          {avatar}
        </div>
        <div className="col-xs-11"> 
          <CardTitle
            title={name}
            subtitle={subtitleInfo.join(" ● ")} />
          <CardText>
            {location.formattedAddress[0] ? location.formattedAddress[0] : null}
            {hours && hours.status ? " ● " + hours.status : null}
          </CardText>
        </div>

      </Card>
    );
  }
});

module.exports = VenueView;