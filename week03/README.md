## Week 03 Assignment
Using the parsed data from last week, the goal of this assignment was to use the Texas A&M Geoservices Geocoding API to make a request for the geo-locations of all the meetings in the zone.


## Solution 

The first step was loading in the content from Week02 to use the object values for the constructed API request. Within the asyncEachSeries, I created three variables to make it faster to reference the values within the JSON.

```javascript
var content = fs.readFileSync('/home/ec2-user/environment/week02/data/m10.JSON');
content = JSON.parse(content);

async.eachSeries(content, function(value, callback) {

    var street = value['streetAddress']; 
    var city = value['city']; 
    var state = value['state']; 
```


After the URL has been constructed, I created variables to inside the else statement to hold the latitude and longitude information. I then created a variable called fullAddress to store the information for the street address, city, state, latitude and longitude. 
Using meetingsData.push(fullAddress), this information was pushed to the array. I then wrote a new JSON file with the updated parameters. 
```javascript
request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body);
            var lat = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Latitude']
            var long = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Longitude']

            var fullAddress = {
                ['street'] : street,
                ['city'] : city,
                ['state'] : state,
                ['lat'] : lat,
                ['long'] : long
            };
            meetingsData.push(fullAddress);
        }
    }); 
```


## Next Steps 
Moving forward the goal would be to strip out any inconsistencies within the street address and remove any duplicate locations within the JSON file. 
