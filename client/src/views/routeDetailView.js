/*
This view shows the details of the possible routes from origin to destination
*/

var React = require('react');

// Import MUI components (material-ui)
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var {Paper, Menu, MenuItem, List, ListItem} = mui;
var Actions = require('../actions/Actions')

var RouteDetailView = React.createClass({
  childContextTypes: { // MUI: init
    muiTheme: React.PropTypes.object //connect MUI
  },
  getChildContext () { // MUI: set theme
    return {
      muiTheme: ThemeManager.getCurrentTheme() //set MUI theme to default
    };
  },
  propTypes: {
    routes: React.PropTypes.array.isRequired,
    changeCurrentRoute: React.PropTypes.func.isRequired
  },

  render () {
    var component = this;
    var routes = this.props.routes;
    var routeDetails = routes.map(function(route, index) {
      var colorCodedRouteInfo = (<span><span className="glyphicon glyphicon-road" style={{color:route.color}}></span>{" "+route.distance+" → "+route.duration}</span>);
      return (
          <ListItem
            primaryText={colorCodedRouteInfo}
            onClick={function(){
              // console.log('here&&&&&&&&&&&&&&', routes[index]);
              Actions.selectRoute(index);
              component.props.changeCurrentRoute(routes[index])
            }}
            key={index}
            className='list-item'>
          </ListItem>
      )
    });

    return (
      <div>
        <Paper>
          <List subheader="Route Selector" className="route-list"> {routeDetails} </List>
        </Paper>
      </div>
    );
  }
});

module.exports = RouteDetailView;