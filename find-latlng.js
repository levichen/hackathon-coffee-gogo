var request = require('request');
var fs      = require('fs');

var data = fs.readFileSync('./missing_list.txt');

data.toString().split('\n').forEach(function (address) { 
    var url = 'http://maps.googleapis.com/maps/api/geocode/json?address='+address+'=false';

    request(url, function(err, response, body) {
        var body = JSON.parse(body);
        console.log(address + '=' + body.results[0].geometry.location.lat + "," + body.results[0].geometry.location.lng);
        sleep(500);
    });
});

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}
