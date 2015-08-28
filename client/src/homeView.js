/*
This component is the home view. It allows the user to input his/her travel route
*/

var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

var HomeView = React.createClass({
  propTypes: {
    origin: React.PropTypes.string.isRequired,
    destination: React.PropTypes.string.isRequired,
    setPath: React.PropTypes.func.isRequired,
  },

  render () {
    return (
      <div>
        Pick your Route
        <form>
          <input type="text" name="origin" placeholder="origin" />
          <input type="text" name="destination" placeholder="destination" />
          <button onClick={this.props.setPath.bind(null, 'SF', 'LA')}>
            <Link to="map" >Submit</Link>
          </button>
        </form>
      </div>
    )
  }
})

module.exports = HomeView;