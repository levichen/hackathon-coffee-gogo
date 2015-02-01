var fs = require('fs');

var mongodb = require('mongodb');
var url = require('./database');
var client = mongodb.MongoClient;

client.connect(url, function(err, db){
    collection = db.collection('restaurant_google');
    collection.find({}).toArray(function(err, docs){
        for(index in docs) {
            var doc = docs[index];

            var newObj = {};
            newObj.address = doc.formatted_address;
            newObj.tel =[ doc.formatted_phone_number ];
            newObj.loc = {
                "type": "Point",
                "coordinates": [
                    doc.geometry.location.lng,
                    doc.geometry.location.lat 
                ] 
            }
            newObj.title = doc.name;
            newObj.icon = doc.icon;
            newObj.weekday_text = {};
            newObj.google_rating = doc.rating;

            if(doc.hasOwnProperty('opening_hours')) {
                newObj.weekday_text = doc.opening_hours.weekday_text;
            }

            var comment = [];
            if(doc.hasOwnProperty('reviews')) {
                var commentTmp = {};
                for(index in doc.reviews) {
                    var review = doc.reviews[index];
                    commentTmp.text = review.text;
                    commentTmp.time = review.time;
                    commentTmp.rating = review.rating;
                }
                comment.push(commentTmp);
            }
            newObj.comment = comment;


            collection1 = db.collection('restaurant_merge');
            collection1.insert(newObj, function(err) {
                console.log(err);
            });


        }
    });
});

