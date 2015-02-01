var app = angular.module('editor', []);

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



app.controller('index', function($scope, placeService) {
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

	$scope.getPlaces(0);

	function initialize() {	
		var mapOptions = {
		    zoom: 15,
		    center: new google.maps.LatLng(25.046974, 121.513091)
		  };
		map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	}
	initialize();
});