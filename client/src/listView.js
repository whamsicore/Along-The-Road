/*
This view shows the details of the possible routes from origin to destination
*/

var React = require('react');

var ListView = React.createClass({
  propTypes: {
    wayPoints: React.PropTypes.array.isRequired
  },
  shouldComponentUpdate (nextProps, nextState){
    console.log("TEST inside shouldComponentUpdate() nextProps=", nextProps);
    console.log("TEST inside shouldComponentUpdate() nextState=", nextState);
    return true;
  }, 
  // componentWillUpdate (){
  //   console.log("TEST -----> componentWillUpdate");
  // }, 
  // componentDidMount (){
  //   console.log("TEST inside componentDidMount()");
    
  // },
  render () {
    var listDetails = this.props.wayPoints.map(function(box, index) {
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