/*
This component is the home view. It allows the user to input his/her travel route
*/

var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

var HomeView = React.createClass({
  /*
   proptypes provide a way of checking the passed in properties.
   They throw a warning in the console if not provided correctly.
   It has no effect on the execution of the program
  */
  propTypes: {
    origin: React.PropTypes.object.isRequired,
    destination: React.PropTypes.object.isRequired,
    setOrigin: React.PropTypes.func.isRequired,
    setDestination: React.PropTypes.func.isRequired,
  },

  getInitialState () {
    return {
      origin: '',
      destination: ''
    }
  },

  // Componenet lifecycle method that get's called after the first render
  componentDidMount () {
    // allows access of the props inside setOrigin and setDestination
    var props = this.props;
    var component = this;

    var setOrigin = function() {
      props.setOrigin(this.getPlace());

      var origin = this.getPlace().geometry.location.G + ',' + this.getPlace().geometry.location.K;;

      component.setState({
        origin
      });
    };

    var setDestination = function() {
      props.setDestination(this.getPlace());

      var destination = this.getPlace().geometry.location.G + ',' + this.getPlace().geometry.location.K;

      component.setState({
        destination
      });
    };

    // creates google maps autocomplete field and attaches it to the input specified
    var originAutoComplete = new google.maps.places.Autocomplete(document.getElementById('origin'));
    originAutoComplete.addListener('place_changed', setOrigin);

    var destinationAutoComplete = new google.maps.places.Autocomplete(document.getElementById('destination'));
    destinationAutoComplete.addListener('place_changed', setDestination);
  },

  render () {
    return (
      <div>
        <p>Plan your Trip</p>
        <input id="origin" type="text" name="origin" placeholder="origin" />
        <input id="destination" type="text" name="destination" placeholder="destination" />
        <button>
          <Link to="map"  params={{origin: this.state.origin, destination: this.state.destination }} >Submit</Link>
        </button>
      </div>
    )
  }
})

module.exports = HomeView;
