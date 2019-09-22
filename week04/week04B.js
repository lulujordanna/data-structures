//Dependencies 
const { Client } = require('pg');
var async = require('async');
const dotenv = require('dotenv');
dotenv.config({path: '/home/ec2-user/environment/.env'});
var fs = require('fs');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = process.env.AWSRDS_USER;
db_credentials.host = process.env.AWSRDS_HOST;
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

//Loading in the JSON file from last week to create a loop to remove duplicate locations 
var content = fs.readFileSync('/home/ec2-user/environment/week03/data/m10.JSON');
content = JSON.parse(content);
//console.log(content); 

//Creating two arrays: the first to add the address objects and the second is to double check for duplicate locations.
var addressesForDb = [];
var addressesCheck = [];

//Use the for loop to iterate through the content JSON file. 
for (var i = 0; i < content.length; i++) {
//variable combines the latitude and longitude 
  var latLonCombined = content[i]['lat'] + content[i]['long'];
//Uses the if statement to check boolean; add the single addresses to the addressesForDb array. 
  if (addressesCheck.includes(latLonCombined) == false) {
      addressesForDb.push(content[i]);
      addressesCheck.push(latLonCombined);
  }
}
//console.log(addressesForDb); 

async.eachSeries(addressesForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO locationGeo VALUES ('"+ 0 +"', E'"+ value.street +"', '"+ value.NULL +"', " + value.lat + ", " + value.long + ");";
    
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
});  