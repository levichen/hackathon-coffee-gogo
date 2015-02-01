
module.exports = function(app) {

	var db = app.get('db');

	app.get('/places', function(req, res) {
		var centerLat = req.query.centerLat;
		var centerLon = req.query.centerLon;
		var maxDistance = req.query.maxDistance;
		var collection = db.collection('restaurant_geo');

		if (!maxDistance || !centerLat || !centerLon) {
			res.status(400).json({'status': 'error', 'message': 'missing some variable'});
			res.end();
		}

		collection.find({
			loc: {
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [
							parseFloat(centerLon),
							parseFloat(centerLat)
						]
					},
					$maxDistance: parseInt(maxDistance)
				}
			}
		}).toArray(function(err, result) {
			if (err) {
				res.status(500).json({'status': 'error', 'message': 'db error'});
			}
			res.json(result);		
		});
	});

	app.get('/places_type', function(req, res) {
		var collection = db.collection('restaurant_type');
		
		collection.find({}).toArray(function(err, result) {
			if (err) {
				res.status(500).json({'status': 'error', 'message': 'db error'});
			}
			res.json(result);
		});
	});

}