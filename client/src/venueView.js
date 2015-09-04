/*
This view shows the details of each venue
*/

var React = require('react');

var VenueView = React.createClass({
  propTypes: {
    venue: React.PropTypes.object.isRequired
  },

  render () {
    var {featuredPhotos, name, contact, hours, categories, location, menu, price, rating, ratingColor, stats, url} = this.props.venue;

    if (categories) {
      var categoryList = categories.map(function(category, index) {
        return (
          <div class="category">
            {category.shortName}
          </div>
        )
      });
    }

    if (featuredPhotos && featuredPhotos.items && featuredPhotos.items.length) {
      var photoUrl = featuredPhotos.items[0].prefix + "100x100" + featuredPhotos.items[0].suffix;
    }


    return (
      <div class="venue">
        <img src={photoUrl ? photoUrl : "https://foursquare.com/img/categories/food/default_64.png"}/>
        {name}
        {location.formattedAddress[0] ? location.formattedAddress[0] : null}
        {Math.round(location.distance/1000*.621*10)/10} mi.
        {rating ? rating : null}
        {price && price.message ? price.message : null}
        {categoryList ? categoryList : null}
        {hours && hours.status ? hours.status : null}
      </div>
    );
  }
});

module.exports = VenueView;