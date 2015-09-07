/*
This component is the home view. It allows the user to input his/her travel route
*/

var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

// Import MUI components (material-ui)
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var {RaisedButton, Paper} = mui;


var HomeView = React.createClass({
  childContextTypes: { // MUI: init
    muiTheme: React.PropTypes.object //connect MUI
  },
  getChildContext () { // MUI: set theme
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
    var slider_options = {
      dots: true,
      // infinite: true,
      speed: 500,
      // slidesToShow: 1,
      // slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      // autoplay: true,
      draggable: true,
    };

    return (
      <div className='container-fluid'>
        <br/><br/>
        <div className = 'row centered'>
          <div className = 'col-sm-12 centered'>
            {/*<TextField className= 'center-block' id="origin" placeholder='' floatingLabelText="Start Location" hintText="Enter a starting location"/>*/}
            <div className="input-group">
              <input className="form-control" id="origin" placeholder="Starting Location" />
            </div> {/*input-group*/}
          </div> {/* col */}
        </div>{/* row */}

        <div className = 'row centered'>
          <div className = 'col-sm-12'>
            {/*<TextField id="destination" placeholder='' floatingLabelText="End Location" hintText="Enter a destination"/>*/}
            <div className="input-group">
              <input className="form-control" id="destination" placeholder="Destination" />
            </div> {/*input-group*/}
          </div> {/* col */}
        </div>{/* row */}

        <div className = 'row centered'>
          <div className = 'col-sm-12'>
            <RaisedButton
              label="Submit"
              className="submit_button"
              secondary={true}
              linkButton="true"
              params={{
                origin: this.state.origin,
                destination: this.state.destination
              }}
              containerElement={<Link to="map"/>}
              style={{
                'width':'180px',
                'borderRadius': '5px'
              }}
            /> {/* RaisedButton */}
          </div> {/* col */}
        </div>{/* row */}

        <br/><br/>

        <Paper className="app-info" style={{'backgroundColor':"rgba(256, 256, 256, 0.7)", 'borderRadius':'10px'}}>
            <div className = 'row centered'>
              <div className = 'col-sm-12'>
                <h2> Get The App (coming soon...) </h2>
              </div> {/* col */}
            </div> {/* row */}

            <div className = 'row'>
              <div className = 'col-sm-12'>
                <h3>
                  {"Planning to go somewhere? Find out all the best places to \
                  stop at with Along the road. Simply enter a starting location \
                  and a destination, and we will help you DISCOVER all the \
                  best places to stop at along the road! Fanny pack cornhole bitters \
                  Thundercats sartorial lumbersexual brunch beard blog. Shoreditch \
                   hashtag cronut. Selvage plaid Williamsburg iPhone, umami hashtag blog stumptown fap. Cred Schlitz pork belly, kogi gastropub crucifix lomo McSweeney's actually disrupt aesthetic narwhal. Try-hard tote bag scenester butcher, keytar."}
                </h3>
              </div> {/* col */}
            </div> {/* row */}
        </Paper> {/* jumbotron */}

      </div>
    )
  }
})

module.exports = HomeView;
