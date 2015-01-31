/*(function() {*/
    var latitude = 25.035255;
    var longitude = 121.56251;

    /*var map;
    [>initialize();<]
    function initialize() {
        var mapOptions = {
            zoom: 8,
            center: new google.maps.LatLng(latitude, longitude)
        };

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    }

    google.maps.event.addDomListener(window, 'load', initialize);*/
function initialize() {
    var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(latitude, longitude)
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var position = new google.maps.LatLng(latitude, longitude);
    var marker   = new google.maps.Marker({position: position, map: map});

    marker.setTitle("hello");
    attachSecretMessage(marker);
}

function attachSecretMessage(marker) {
    var infowindow = new google.maps.InfoWindow({
        content: 'hello world'
    });

    google.maps.event.addListener(marker, 'click', function() {
        
        infowindow.open(marker.get('map'), marker);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);

/*google.maps.event.addDomListener(window, 'load', initialize);*/
    /*getLocation();
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log(position.coords.latitude);
                console.log(position.coords.longitude);
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }*/
/*})();*/
