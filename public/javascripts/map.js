(function() {
    navigator.geolocation && getLocation();
    function getLocation() {
			navigator.geolocation.getCurrentPosition(function(position) {
				var coords = position.coords;
					$.ajax({
							url : '/getContent',
							type : 'post',
							dataType : 'json',
							data: {
									latitude: coords.latitude,
									longitude: coords.longitude
							},
							success: function(res) {
									var latitude = res.geometry.location.lat;
									var longitude = res.geometry.location.lng;

									function initialize() {
											var mapOptions = {
													zoom: 14,
													center: new google.maps.LatLng(coords.latitude, coords.longitude)
											};

											var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

											var position = new google.maps.LatLng(latitude, longitude);
											var marker   = new google.maps.Marker({position: position, map: map, icon: "images/marker.png"});

											marker.setTitle("hello");
											attachSecretMessage(marker);
											var marker1 = new Marker({
												map: map,
												zIndex: 10,
												title: 'Map Icons',
												position:  new google.maps.LatLng(coords.latitude, coords.longitude),
												icon: {
													path: MAP_PIN,
													fillColor: '#0E77E9',
													fillOpacity: 1,
													strokeColor: '',
													strokeWeight: 0,
													scale: 1/4
												},
												label: '<i class="map-icon-walking"></i>'
											});
										};

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
    }
})();
