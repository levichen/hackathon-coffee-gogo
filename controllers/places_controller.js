
module.exports = function(app) {

	var db = app.get('db');

	app.get('/places', function(req, res) {
		var centerLat = req.query.centerLat;
		var centerLon = req.query.centerLon;
		var maxDistance = req.query.maxDistance;
		var collection = db.collection('restaurant_merge');

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
	
	app.get('/place_category', function(req, res){
        var collection = db.collection('restaurant_merge');
        var qCategory = req.query.category;
        
        if(qCategory){
            collection.find({category:qCategory}).toArray(function(err, result){
                if(err){
                    res.status(500).json({'status': 'error', 'message': 'db error'});
                }
                
                res.json(result);
            });
        }else{
            collection.find({}).toArray(function(err, result){
                if(err){
                    res.status(500).json({'status': 'error', 'message': 'db error'});
                }
                
                res.json(result);
            });
            
        }
        
	});
	
	app.get('/places_List', function(req, res){
        var collection = db.collection('restaurant_merge');
        
        //var qCategory = req.query.category;
        var qAddress = req.query.address;
        var qTitle = req.query.title;
        var qGoogleRate = req.query.google_rating;
        
        var query;
        if(qAddress && qTitle && qGoogleRate)
        {
            query = collection.find( {address:new RegExp(qAddress, 'i'), 
                                        title:new RegExp(qTitle,'i'),  
                                        google_rating:{ $gte: parseFloat(qGoogleRate) }});
        }else if(qAddress && qTitle){
            query = collection.find( {address:new RegExp(qAddress, 'i'), title:new RegExp(qTitle,'i')});
        }else if(qAddress && qGoogleRate){
            query = collection.find( {address:new RegExp(qAddress, 'i'), google_rating:{ $gte: parseFloat(qGoogleRate) }});
        }else if(qTitle && qGoogleRate){
            query = collection.find({title:new RegExp(qTitle,'i'), google_rating:{ $gte: parseFloat(qGoogleRate) }});
        }else if(qAddress){
            query = collection.find({address:new RegExp(qAddress, 'i')});
        }else if(qTitle){
            query = collection.find({title:new RegExp(qTitle,'i')});
        }else if(qGoogleRate){
            query = collection.find({google_rating:{ $gte: parseFloat(qGoogleRate) }});
        }else{
            query = collection.find({});
        }
        
        query.toArray(function(err, result){
            if(err){
                res.status(500).json({'status':'error', 'message':'db error'});
         }
         
         res.json(result);
        });
	});

}