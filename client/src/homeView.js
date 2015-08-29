/*
This component is the home view. It allows the user to input his/her travel route
*/

var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

// Import MUI components (material-ui)
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var {TextField, RaisedButton} = mui;


var HomeView = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object //connect MUI
  },
  getChildContext () {
    return {
      muiTheme: ThemeManager.getCurrentTheme() //set MUI theme to default
    };
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
    var component = this;

    var setOrigin = function() {
      var origin = this.getPlace().geometry.location.G + ',' + this.getPlace().geometry.location.K;;
      component.setState({
        origin
      });
    };

    var setDestination = function() {
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
        <div className = 'row'>
          <TextField id="origin" placeholder='' floatingLabelText="Starting Location" hintText="Enter starting address"/> {/* right now these MUI props do not go well with google. floatingLabelText="Starting Location" hintText="Enter starting address" */}
        </div>
        <div className = 'row'>
          <TextField id="destination" placeholder='' floatingLabelText="Destination" hintText="Enter destination address"/>
        </div>

        <div className = 'row'>
          <RaisedButton label="Submit" linkButton="true" params={{origin: this.state.origin, destination: this.state.destination }} containerElement={<Link to="map"/>}/>

        </div>
      </div>
    )
  }
})

module.exports = HomeView;
