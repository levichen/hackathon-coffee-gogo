var key = require('./key');
var apiKey = key.key;

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(apiKey, 'json');

var res = { 
    geometry: { 
        location: { 
            lat: 25.035255, 
            lng: 121.56251 
        } 
    },
    id: '137348ad7b2fc06d1ed6425d4606ca215062ccbf',
    place_id: 'ChIJty1ap7erQjQRWmO-mTv1zkQ',
    reference: 'CoQBdAAAAF3GtAT0B1tkeLy7QVQKz2ZNerCdLz_iWTyyJibZEVoU17hYJlBxRmVgexhlYcXSr5OzbsBEjKuudvtfBMhlGD3eK0diPkHVrFYimvZ0oUFRGTTuPN-f_ycLK2byT50mCZGKOdsV_cgSeRl6xgUypG2WLbtA6GLJDme6lDu9n83DEhDF4NUw2reyThRpkgusDNEFGhSQghNE2PtYLo3y_vWXyQM829_i1w' 
}

var parameters = {
    reference : res.reference,
    language: 'zh_TW'
};

googlePlaces.placeDetailsRequest(parameters, function (error, response) {
    if (error) throw error;
    console.log(response.result);

});


