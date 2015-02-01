var NOW_LATITUDE = 25.0329636;
var NOW_LONGITUDE = 121.56542680000001;

var key = require('./key');
var apiKey = key.key;

var mongodb = require('mongodb');
var client = mongodb.MongoClient;
var url = require('./database');

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(apiKey, 'json');
var parameters = {};

parameters = {
    location:NOW_LATITUDE + ","  + NOW_LONGITUDE,
    types: "restaurant"
};

googlePlaces.radarSearch(parameters, function (error, response) {
    if (error) throw error;
    var results = response.results;

    for(index in results) {
        var result = results[index];

        var parameters = {
            reference : result.reference,
            language: 'zh_TW'
        };

        googlePlaces.placeDetailsRequest(parameters, function (error, response) {
            if (error) throw error;

            client.connect(url, function(err, db){
                collection = db.collection('restaurant_google');
                collection.insert(response.result, function(err) {
                    console.log(err);
                });
            });

        });
    }
});

