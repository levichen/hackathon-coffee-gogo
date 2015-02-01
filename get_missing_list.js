var fs = require('fs');

var mongodb = require('mongodb');
var db;
client = mongodb.MongoClient;

client.connect(db, function(err, db){
    collection = db.collection('restaurant_geo');
    collection.find({}).toArray(function(err, docs){
        for(index in docs) {
            var doc = docs[index];
            if(doc.loc === undefined) {
                console.log(doc.address);
            }
        }
    });
});

