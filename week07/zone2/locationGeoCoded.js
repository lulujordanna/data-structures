// dependencies
var request = require('request'); 
var async = require('async'); 
var fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({path: '/home/ec2-user/environment/.env'});
const apiKey = process.env.TAMU_KEY;

//Load in LocationGeo JSON
var content = fs.readFileSync('/home/ec2-user/environment/week07/data/locationGeo02.JSON');
content = JSON.parse(content); 

// Create global arrays for geocode addresses
var meetingsData = [];

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(content, function(value, callback) {

    var street = value['streetAddress'];
    var name = value['addressName'];
    var city = value['city']; 
    var state = value['state']; 

    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    apiRequest += 'streetAddress=' + street.split(' ').join('%20');
    apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
    apiRequest += '&format=json&version=4.01';

    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body);
            var lat = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Latitude']; 
            var long = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Longitude']; 

            var fullAddress = {
                ['street'] : street,
                ['name']: name, 
                ['city'] : city,
                ['state'] : state,
                ['lat'] : lat,
                ['long'] : long
            };
            meetingsData.push(fullAddress);
        }
    });
  setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('/home/ec2-user/environment/week07/data/locationGeo02_Update.JSON', JSON.stringify(meetingsData));
    console.log('Number of meetings in this zone: ');
    console.log(meetingsData.length);
});