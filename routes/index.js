var express = require('express');
var router = express.Router();

var key = require('../key');
var apiKey = key.key;

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(apiKey, 'json');

var latitude;
var longitude;
var parameters = {};


/* GET home page. */
router.get('/', function(req, res, next) {
    /*latitude = 25.0329636;
    longitude = 121.56542680000001;

    parameters = {
        location:[latitude, longitude],
        types: "restaurant"
    };

    googlePlaces.radarSearch(parameters, function (error, response) {
        if (error) throw error;
        results = response.results;
        console.log(results);

        console.log(results[0]);
    });*/

    res.render('index', { title: 'Express' });
});

router.post('/getContent', function(req, res){
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
        geometry: { 
            location: { 
                lat: 25.035255, 
                lng: 121.56251 
            } 
        },
        id: '137348ad7b2fc06d1ed6425d4606ca215062ccbf',
        place_id: 'ChIJty1ap7erQjQRWmO-mTv1zkQ',
        reference: 'CoQBdAAAAF3GtAT0B1tkeLy7QVQKz2ZNerCdLz_iWTyyJibZEVoU17hYJlBxRmVgexhlYcXSr5OzbsBEjKuudvtfBMhlGD3eK0diPkHVrFYimvZ0oUFRGTTuPN-f_ycLK2byT50mCZGKOdsV_cgSeRl6xgUypG2WLbtA6GLJDme6lDu9n83DEhDF4NUw2reyThRpkgusDNEFGhSQghNE2PtYLo3y_vWXyQM829_i1w' 
    }));
});

module.exports = router;
