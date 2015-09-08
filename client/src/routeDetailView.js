/*
This view shows the details of the possible routes from origin to destination
*/

var React = require('react');

// Import MUI components (material-ui)
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var {Paper, Menu, MenuItem, List, ListItem} = mui;


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
    setCurrentRoute: React.PropTypes.func.isRequired
  },

  render () {
    var component = this;
    var routeDetails = this.props.routes.map(function(route, index) {
      return (
          <ListItem
            primaryText={route.distance+"->"+route.duration}
            onClick={function(){component.props.setCurrentRoute(index)}}
            key={index}
            className='list-item'
          />
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