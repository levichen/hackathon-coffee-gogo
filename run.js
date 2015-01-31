var key = require('./key');
var apiKey = key.key;

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(apiKey, 'json');
var parameters;

parameters = {};

googlePlaces.radarSearch(parameters, function (error, response) {
    if (error) throw error;
    console.log(response.results);
});

