// helper function for getDistanceBetweenPoints
var deg2rad = function(deg) {
  return deg * (Math.PI/180)
};

// calculates the distance in km between two points based on their Latitude and Longitude
var getDistanceBetweenPoints = function(point1, point2) {
  // great-circle distance calculation; code from Stack Overflow

  var lat1 = point1.lat();
  var lon1 = point1.lng();
  var lat2 = point2.lat();
  var lon2 = point2.lng();

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
};

var getMiddlePoint = function(a, b) {
  return new google.maps.LatLng((a.lng()+b.lat())/2, (a.lng()+b.lat())/2);

};

// turns a lat/long string into a google maps LatLong Object
var getLatLong = function(location) {
  return new google.maps.LatLng(location.split(',')[0], location.split(',')[1]);
};



var mapStyles = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#6195a0"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#e6f3d6"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#f4d2c5"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#f4f4f4"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#787878"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#eaf6f8"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#eaf6f8"}]}];
// var mapStyles = [{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.text","stylers":[{"lightness":"-50"},{"visibility":"simplified"}]},{"featureType":"landscape","elementType":"all","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"saturation":"0"},{"hue":"#ff0000"}]},{"featureType":"landscape","elementType":"labels.icon","stylers":[{"visibility":"simplified"}]},{"featureType":"poi","elementType":"all","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"off"}]},{"featureType":"poi.government","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":"-100"},{"lightness":"0"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"lightness":"0"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"lightness":"50"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#95969a"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"lightness":"0"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"on"},{"lightness":"0"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"color":"#3c3c31"}]},{"featureType":"road.highway.controlled_access","elementType":"labels","stylers":[{"lightness":"0"}]},{"featureType":"road.highway.controlled_access","elementType":"labels.icon","stylers":[{"lightness":"-10"},{"saturation":"0"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"},{"lightness":"41"},{"saturation":"0"}]},{"featureType":"transit","elementType":"all","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"transit.line","elementType":"geometry.fill","stylers":[{"lightness":"0"}]},{"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#dce6e6"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"labels.text","stylers":[{"lightness":"50"}]}];
//var mapStyles = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#6195a0"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":"0"},{"saturation":"0"},{"color":"#f5f5f2"},{"gamma":"1"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"lightness":"-3"},{"gamma":"1.00"}]},{"featureType":"landscape.natural.terrain","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#bae5ce"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#fac9a9"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#787878"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"transit.station.airport","elementType":"labels.icon","stylers":[{"hue":"#0a00ff"},{"saturation":"-77"},{"gamma":"0.57"},{"lightness":"0"}]},{"featureType":"transit.station.rail","elementType":"labels.text.fill","stylers":[{"color":"#43321e"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"hue":"#ff6c00"},{"lightness":"4"},{"gamma":"0.75"},{"saturation":"-68"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#eaf6f8"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c7eced"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":"-49"},{"saturation":"-53"},{"gamma":"0.79"}]}];

// initializes a map and attaches it to the map div
var initializeMap = function(center) {
  var mapOptions = {
    zoom: 10,
    center,
    styles: mapStyles,
    mapTypeControl: false,
    // zoomControlOptions: {
    //     position: google.maps.ControlPosition.LEFT_BOTTOM
    // },
    streetViewControl: false
  };
  return new google.maps.Map(document.getElementById('map'), mapOptions);
} //initializeMap()

var initializeMarkers = function(start, end, map) {
  new google.maps.Marker({
    position: start,
    map,
    label: 'A'
  });

  new google.maps.Marker({
    position: end,
    map,
    label: 'B'
  });
} //initializeMarkers()

var minRadiusToDistanceFactor = 8;
var defaultSearchRadius = 5; // in km

// FUNC: scale search radius according to the route distance
var getSearchRadius = function(route){
  var distance = route.distanceMeters/1000;
  if (distance < minRadiusToDistanceFactor*defaultSearchRadius) {
    return distance/minRadiusToDistanceFactor;

  }else{
    return defaultSearchRadius;
  } //if

} //getSearchRadius

// SETUP PHASE (STEP 2): Obtain waypoints for each route
// NOTE: syncronous function
var getWayPoints = function(newRoute, radius) {
  var path = newRoute.path; // get path from target route
  // var map = this.state.map; // note: map is a state of this view

  var wayPoints = [];
  var lastWayPoint;

  path.forEach(function(point, index) {
    // calculate cumulative distance from start, in meters
    if (index === 0) {
      point.distance = 0;
    } else {
      var prevPoint = path[index-1];
      point.distance = prevPoint.distance + getDistanceBetweenPoints(prevPoint, point)*1000;
    }

    // add first point
    if (!lastWayPoint) {
      wayPoints.push(point);
      lastWayPoint = point;
    }
    // add an inbetween point if the distance is too big
    if (getDistanceBetweenPoints(lastWayPoint, point) > 1.5 * radius) {
      var middlePoint = getMiddlePoint(lastWayPoint, point);
      middlePoint.distance = prevPoint.distance + getDistanceBetweenPoints(prevPoint, middlePoint)*1000;
      wayPoints.push(middlePoint);
    }

    // add new point if the distance is larger than the radius
    if (getDistanceBetweenPoints(lastWayPoint, point) > radius) {
      wayPoints.push(point);
      lastWayPoint = point;
    }
  });
  return wayPoints;

} //getWayPoints()

var openFourSquare = function (venue) {
  var url = "https://foursquare.com/v/" + escape(venue.name) + "/" + venue.id;
  console.log("TEST inside openFourSquare. url=" + url);
  window.open(url);
};

var updateZoom = function(poiArr, map){
  var bounds = new google.maps.LatLngBounds();
  // google.maps.LatLng();
  poiArr.forEach(function(point){
    bounds.extend(point);
  });
  map.fitBounds(bounds);
}
module.exports = {
  getDistanceBetweenPoints,
  getMiddlePoint,
  getLatLong,
  initializeMap,
  initializeMarkers,
  getWayPoints,
  getSearchRadius,
  openFourSquare,
  updateZoom
};