(function() {
    getLocation();
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {

                $.ajax({
                    url : '/getContent',
                    type : 'post',
                    dataType : 'json',
                    data: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    success: function(res) {
                        var latitude = res.geometry.location.lat;
                        var longitude = res.geometry.location.lng;

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
                        initialize();

                        /*google.maps.event.addDomListener(window, 'load', initialize);*/
                        console.log('hello');
                    }
                });
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }
})();
