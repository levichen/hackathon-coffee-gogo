var fs = require('fs');

var mongodb = require('mongodb');
var db;
client = mongodb.MongoClient;


client.connect(db, function(err, db){
    var collection = db.collection('restaurant_geo');

    var data = fs.readFileSync('./t.txt');
    var counter = 0;

    data.toString().split('\n').forEach(function (line) { 
        if(line !== undefined) {
            var c = line.split("=");
            var addr = c[0];
            var latlng = c[1];
            if(latlng != undefined) {
                var k = latlng.split(',');
                collection.update({ "address" : addr }, 
                                 { $set: { "loc" : {type :"Point", coordinates : [parseFloat(k[1]), parseFloat(k[0])]} } }, 
                                 {multi: true},
                                 function(err, result) {
                    console.log(err);
                    console.log(addr);
                    console.log("Updated the document with the field a equal to 2");
                });  
            }
            else {
                /*db.close();*/
            }
        }

        /*collection.find({"address" : addr}).toArray(function(err, docs){
            console.log(docs);
        });*/

    });
    /*db.close();*/
});

