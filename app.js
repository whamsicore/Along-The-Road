/*
This file contains the server that will serve up the client code
*/
var express = require('express');

var port = process.env.PORT || 3000;

var app = express();

// serve up index.html entry point for client side code
app.use(express.static(__dirname + '/client/'));

app.listen(port);

console.log("Server is listening on port", port);
