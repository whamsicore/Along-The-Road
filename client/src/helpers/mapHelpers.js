// helper function for getDistanceBetweenPoints
var deg2rad = function(deg) {
  return deg * (Math.PI/180)
};

// calculates the distance in km between two points based on their Latitude and Longitude
var getDistanceBetweenPoints = function(point1, point2) {
  // great-circle distance calculation; code from Stack Overflow
  var lat1 = point1.G;
  var lon1 = point1.K;
  var lat2 = point2.G;
  var lon2 = point2.K;
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
  return new google.maps.LatLng((a.G+b.G)/2, (a.K+b.K)/2);
};

// turns a lat/long string into a google maps LatLong Object
var getLatLong = function(location) {
  return new google.maps.LatLng(location.split(',')[0], location.split(',')[1]);
};

module.exports = {
  getDistanceBetweenPoints,
  getMiddlePoint,
  getLatLong
};