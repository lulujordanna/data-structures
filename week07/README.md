## Goal 
The goal of this assignment was to finishing parsing the rest of the data from the assigned zone and update/replace your PostgreSQL table(s) with the new data. Once this is completed you must repeat the process for the remaining 9 zones. The completed data should include all the data needed for the map in Final Assignment 1. 

## Solution 

Location and Schedule. 

### Parse additional information for the address
Building upon the structure that we have worked with in the previous weeks, I wanted to add the address name to database. In order to do this I had to add an attional feild to parse the addressName key. Once that data was scrapped I created a JSON file ([locationGeo10.JSON](https://github.com/lulujordanna/data-structures/blob/master/week07/data/locationGeo10.JSON)). 

```javascript
var zone = '10'
var content = fs.readFileSync('/home/ec2-user/environment/week01/data/m'+zone+'.txt');
var $ = cheerio.load(content);

var meetingData = []; 

$('tr').each(function(l, trElem) {
    
    $(trElem).children().each(function(i,elem) {
    
    if ($(elem).attr("style")=="border-bottom:1px solid #e3e3e3; width:260px"){
        var meetingLocation = {}; 
        
        meetingLocation.streetAddress = $(elem).html().split('<br>')[2].trim().split(',')[0];
        meetingLocation.addressName = $(elem).html().split('<h4>')[0].trim().split('<br>')[0].replace(/.....$/, "").replace("<h4 style=\"margin:0;padding:0;\">", ""); 
        meetingLocation.city = 'New York'; 
        meetingLocation.state = 'NY'; 
        
        meetingData.push(meetingLocation); 
    }
  }); 
});

console.log(meetingData);
//fs.writeFileSync('/home/ec2-user/environment/week07/data/locationGeo'+zone+'.JSON', JSON.stringify(meetingData));
```

### Geo-Coding
Taking the code sample from week03, I created a new [JS file](https://github.com/lulujordanna/data-structures/blob/master/week07/zone10/locationGeoCoded.js) to tackle the Geo-coding with the JSON file that I parsed. Once the script was complete and the latitude and longitute were parsed from the TAMU API request, I saved this as a new JSON file to show my progression ([locationGeo10_Update.JSON](https://github.com/lulujordanna/data-structures/blob/master/week07/data/locationGeo10_Update.JSON)). 

### Removing duplicate locations and inputting the data into the database. 
Using the logic and data structure from week04, I began by removing duplicate locations. I then added an additional parameter by using a for() loop to assign a locationID to each address. This was a way to ensure that duplicate addresses were only inputting once in the database and ultimately to connect my locationGeo table to the Schedule table. I then queried the database to ensure that the addresses were correctly inserted. I repeated this process for all remaining zones to complete my locationGeo table. Below is a screenshot of the final query. 

```javascript
var content = fs.readFileSync('/home/ec2-user/environment/week07/data/locationGeo01_Update.JSON');
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

var zone = '1'; 
for (var i = 0; i < addressesForDb.length; i++){
  let id = zone+'_' + i;
  addressesForDb[i].id = id; 
}


//console.log(addressesForDb); 

async.eachSeries(addressesForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO locationGeo VALUES ('"+ value.id +"', E'"+ value.street +"', '"+ value.name +"', " + value.lat + ", " + value.long + ");";
    
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
});
```
