var fs = require('fs');

var mongodb = require('mongodb');
var url = require('./database');
var client = mongodb.MongoClient;

client.connect(url, function(err, db){
    collection = db.collection('fb');
    collection.find({}).toArray(function(err, docs){
        for(index in docs) {
            var doc = docs[index];

            var desc = '';
            if(doc.hasOwnProperty('full_desc')) {
                desc = doc.full_desc;
            }
            else if(doc.hasOwnProperty('short_desc')) {
                desc = doc.short_desc;
            }

        console.log(doc.name);
            /*collection1 = db.collection('restaurant_merge');
            collection1.update({'title' : doc.name},
                                { $set: {'fans_page' : doc.fans_page, "check": doc.check, "like":doc.like, "desc" : desc} },
                                { multi: true},
                                function(err, result) {
                                    console.log(err);
                                    console.log(doc.name);
                                });*/
        }
    });
});

