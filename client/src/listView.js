/*
This view shows the details of the possible routes from origin to destination
*/

var React = require('react');

var ListView = React.createClass({
  propTypes: {
    routingBoxes: React.PropTypes.array.isRequired
  },
  
  render () {
    var listDetails = this.props.routingBoxes.map(function(box, index) {
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