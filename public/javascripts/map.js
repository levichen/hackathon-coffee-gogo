var app = angular.module('gogo', []);

app.service('placeService', function($http, $q) {
	return {
		getPlaces: getPlaces,
		updatePlaceInfo: updatePlaceInfo
	};

	function getPlaces() {
		var promise = $http.get('/places', {
							params: {}
						}).success(function(response) {
							return response;
						});
		return promise;
	}

	function updatePlaceInfo(data) {
		var promise = $http.put('/places', { 
							data: data 
						}).success(function(response) {
							return response;
						});
		return promise;
	}
});

app.controller('index', function($scope, $http, $timeout) {
	var coords = {latitude: 25.046974, longitude: 121.513091};
	navigator.geolocation && getLocation();
	var promise;
    var wifi = false;
	var $slider = $('#distince').slider({
		formatter: function(value) {
			return '距離 ' + value;
		}
	}).on('slide', function() {
		var timer = null
		if(promise)
			$timeout.cancel(promise);
		promise =  $timeout(function() {
			$scope.distince = $slider.getValue();
			$scope.updateStore();
		}, 100);
	}).data('slider');
	$scope.distince = $slider.getValue();
	function initialize() {
		var mapOptions = {
			zoom: 18,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.LEFT_CENTER
			},
			center: new google.maps.LatLng(coords.latitude, coords.longitude)
		};
		window.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	};
	function attachSecretMessage(marker, row) {
			var infowindow = new google.maps.InfoWindow({
					content: row && row.title
			});
			marker.infowindow = infowindow;
			google.maps.event.addListener(marker, 'mouseover', function() {
					infowindow.open(marker.get('map'), marker);
			});
			google.maps.event.addListener(marker, 'mouseout', function() {
					infowindow.close();
			});
			//google.maps.event.addListener(marker, 'click', function() {
			//		infowindow.open(marker.get('map'), marker);
			//});
	}
	function getLocation() {
		initialize();
		navigator.geolocation.getCurrentPosition(function(position) {
			//var coords = position.coords;
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
								var position = new google.maps.LatLng(latitude, longitude);
								var marker   = new google.maps.Marker({position: position, map: map, icon: "images/marker.png"});

								marker.setTitle("Your position");
								attachSecretMessage(marker);
								var marker1 = new Marker({
									map: map,
									zIndex: 14,
									title: 'Your Position',
									position:  new google.maps.LatLng(coords.latitude, coords.longitude),
									icon: {
										path: MAP_PIN,
										fillColor: '#0E77E9',
										fillOpacity: 1,
										strokeColor: '',
										strokeWeight: 0,
										scale: .3
									},
									label: '<i class="map-icon-synagogue"></i>'
								});
								/*google.maps.event.addDomListener(window, 'load', initialize);*/
						}
				});
		});
	}
	var stores = $scope.stores = [];
	var markers = [];
	$scope.updateStore = function() {
		$http({
			url: '/places',
			method: 'GET',
			params: {
				maxDistance: $scope.distince,
				centerLat: coords.latitude,
				centerLon: coords.longitude
			}
		}).success(function(res) {
			var i = 0;
			for(i in markers) {
				markers[i].setMap(null);
			}
			markers = [];
			stores = $scope.stores = res;
			for(i in res) {
				var row = res[i];
				markers[i] = new Marker({
					map: map,
					zIndex: 18,
					title: row.title,
					position:  new google.maps.LatLng(row.loc.coordinates[1], row.loc.coordinates[0]),
					icon: {
						path: MAP_PIN,
						fillColor: '#EA6464',
						fillOpacity: 1,
						strokeColor: '',
						strokeWeight: 0,
						scale: .3
					},
					label: '<i class="map-icon-restaurant"></i>'
				});
				attachSecretMessage(markers[i], row);
			};
            $scope.filter();
		});
	};
	
	$http.get('/places_type').success(function(res) {
		$scope.types = res;
	});
	$scope.focus = function(store) {
		var i = stores.indexOf(store);
		var marker = markers[i];
		marker.infowindow.open(marker.get('map'), marker);
	};
	$scope.unfocus = function(store) {
		var i = stores.indexOf(store);
		var marker = markers[i];
		marker.infowindow.close();
	}
	$scope.updateStore();
	$scope.filter = function() {
		$scope.stores = [];
		for(var i in stores) {
            if($scope.wifi) {
                if(stores[i].wifi) {
                    $scope.stores.push(stores[i])
                    markers[i].setMap(map);
                }
                else {
                    markers[i].setMap(null);
                }
            }
            else {
                if(!$scope.type || $scope.type.chName == stores[i].category) {
                    $scope.stores.push(stores[i])
                    markers[i].setMap(map);
                }
                else {
                    markers[i].setMap(null);
                }
            }

		}
	}
});


app.controller('editor', function($scope, placeService) {
	$scope.dataHeader = ['Title', 'Address', 'Tel'];
	$scope.places = [];
	$scope.currentPage = 0;
	$scope.editData = {};
	var marker;
	var map;

	$scope.getPlaces = function(currentPage) {
		placeService.getPlaces().then(function(response) {
			for (var i = 0 ; i < response.data.length; i++) {
				if (typeof response.data[i].wifi == 'undefined') {
					response.data[i]['wifi'] = 0;
				}
			}
			$scope.places = response.data;
		});
	};

	$scope.updatePlaceInfo = function() {
		placeService.updatePlaceInfo($scope.editData).then(function(response) {
			$('#editor').modal('hide');
			alert('修改成功');
		});
	};

	$scope.addMarker = function(index) {
		if (marker != null) {
			marker.setMap(null);
			marker = null;
		}

		var myLatlng = new google.maps.LatLng($scope.places[index].loc.coordinates[1], $scope.places[index].loc.coordinates[0]);
		var mapOptions = {
			zoom: 4,
			center: myLatlng
		};

		$scope.editData = $scope.places[index];
		map.setCenter(myLatlng);
		marker = new google.maps.Marker({
		    position: myLatlng,
		    map: map,
		    draggable:true,
		    title:"Drag me!"
		});
		google.maps.event.addListener(marker, 'click', function() {
			$('#editor').modal();
		});
	};

	initialize();
	$scope.getPlaces(0);

	function initialize() {
		// var mapOptions = {
		// 	zoom: 18,
		// 	zoomControlOptions: {
		// 		style: google.maps.ZoomControlStyle.LARGE,
		// 		position: google.maps.ControlPosition.LEFT_CENTER
		// 	},
		// 	center: new google.maps.LatLng(25.046254, 121.517532)
		// };

		var mapOptions = {
			zoom: 17,
			center: new google.maps.LatLng({latitude: 25.046974, longitude: 121.513091}),
			style: google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.LEFT_CENTER
		};
		map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	}

});
