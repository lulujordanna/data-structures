## Goal 
The goal of this assignment was to finishing parsing the rest of the data from the assigned zone and update/replace your PostgreSQL table(s) with the new data. Once this is completed you must repeat the process for the remaining 9 zones. The completed data should include all the data needed for the map in Final Assignment 1. 

## Solution 
![New Data Structure](https://github.com/lulujordanna/data-structures/blob/master/week07/images/DS_AA.png)
Since, Week04 the data structure has changed. Based on the information I want and was able to parse, I am moving forwards with a two table SQL database. The first table, locationGeo is similar to the structure from before, with a slight changed to the datatype for locationID. While the second table, schedule has changed a lot based on the data parsed and what datatypes they were available. Below I will break down the steps to populating this new structure, however all files with the update structure can be found in my [week04 folder](https://github.com/lulujordanna/data-structures/tree/master/week04). 

### Parse additional information for the address
Building upon the structure that we have worked with in the previous weeks, I wanted to add the address name to database. In order to do this I had to add an additional field to parse the addressName key. Once that data was scrapped I created a JSON file ([locationGeo10.JSON](https://github.com/lulujordanna/data-structures/blob/master/week07/data/locationGeo10.JSON)). 

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
Taking the code sample from week03, I created a new [JS file](https://github.com/lulujordanna/data-structures/blob/master/week07/zone10/locationGeoCoded.js) to tackle the Geo-coding with the JSON file that I parsed. Once the script was complete and the latitude and longitude were parsed from the TAMU API request, I saved this as a new JSON file to show my progression ([locationGeo10_Update.JSON](https://github.com/lulujordanna/data-structures/blob/master/week07/data/locationGeo10_Update.JSON)). 

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
![LocationGeo Query](https://github.com/lulujordanna/data-structures/blob/master/week07/images/locationsQuery.png)

### Parse data for the schedule table
Once the locationGeo table was complete I began to parse my data for the schedule table. I needed to figure out a way to connect the unique location ID's with the individual rows of the html page.  By bringing in the AWS instance to the JS file, I was able to connect to my database. I then used a query to select all items in the locationGeo table. In an if/else statement I wrote if the query was successful, that is when the cheerio process would begin. I create an empty variable called address to hold the street address data. Using cheerio I parsed through the html to find the street address string and then moved onto the meeting details (day, time, meeting type). Var meetingDetails was a variable which I used to clean up the data inside this row. I then created an object This Meeting, to connect the address variable to the unique locationIDs in the database. I then made another object called thisMeetingDetails to clean up the data for the day, time, meeting type and special interest. Both objects were pushed into the meetingData array which was used my fs.writeFileSync command for the JSON file. The structure of this data created a nesting object within the [JSON file](https://github.com/lulujordanna/data-structures/blob/master/week07/data/schedule10.JSON). Below is all the code for the JS schedule files. 

```Javascript
const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config({path: '/home/ec2-user/environment/.env'});

var fs = require('fs');
var cheerio = require('cheerio');

var zone = '10'
var content = fs.readFileSync('/home/ec2-user/environment/week01/data/m'+zone+'.txt');
var $ = cheerio.load(content);


// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = process.env.AWSRDS_USER;
db_credentials.host = process.env.AWSRDS_HOST;
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to query the entire contents of a table: 
var thisQuery = "SELECT * FROM locationGeo;";

client.query(thisQuery, (err, res) => {
    if (err) {
        console.log(err);
    } else {
        var meetingData = []; 
        let locationData = res.rows;
        client.end();
        
        $('tr').each(function(l, trElem) {
            
            var address;
            
            $(trElem).children().each(function(i,elem) {
                
                if ($(elem).attr("style")=="border-bottom:1px solid #e3e3e3; width:260px"){
                    var streetAddress = $(elem).html().split('<br>')[2].trim().split(',')[0];
                    address = streetAddress; 
                }
            
                if ($(elem).attr("style")=="border-bottom:1px solid #e3e3e3;width:350px;"){
                    //console.log(address);
                    var meetingDetails = $(elem).text().trim(); 
                    meetingDetails = meetingDetails.replace(/[ \t] + /g, " ").trim(); 
                    meetingDetails = meetingDetails.replace(/[ \r\n | \n]/g, " ").trim(); 
                    meetingDetails = meetingDetails.replace(/[ \t]/g, " ").trim();
                    meetingDetails = meetingDetails.split('                    '); 
                    //console.log(meetingDetails, address); 
                    
                    var thisMeeting = {}; 
                    for (var i = 0; i < locationData.length; i++){
                        if (locationData[i].address == address){
                           var idF = locationData[i].locationid;
                           thisMeeting.id = idF;
                        }
                    }
                    
                    var thisMeetingDetails = [];
                    for (var i=0;i<meetingDetails.length;i++) {
                        var thisMeetingDetailObj = {};
                        thisMeetingDetailObj.day = meetingDetails[i].trim().split(" ")[0];
                        thisMeetingDetailObj.startTime = meetingDetails[i].trim().split("From")[1].trim().split('to')[0]; 
                        thisMeetingDetailObj.endTime = meetingDetails[i].trim().split("to")[1].trim().split('Meeting')[0];
                        if (meetingDetails[i].trim().split("Type")[1]) {
                            thisMeetingDetailObj.meetingType = meetingDetails[i].trim().split("Type")[1].trim().split("Special")[0];
                        } else {
                            //console.log('no meeting type found : \n', meetingDetails);
                            thisMeetingDetailObj.meetingType = 'not available';
                        }

                        
                        thisMeetingDetailObj.specialInterest = meetingDetails[i].trim().split("Interest")[1];
                        thisMeetingDetails.push(thisMeetingDetailObj);
                    }
                    thisMeeting.meetings = thisMeetingDetails;
                    console.log(thisMeeting);
                    
                    meetingData.push(thisMeeting); 
                }
            }); 
        });
        //console.log(meetingData[0]);
        fs.writeFileSync('/home/ec2-user/environment/week07/data/schedule'+zone+'.JSON', JSON.stringify(meetingData));
    }
});
```

### Inputting the data into the schedules SQL table
Building upon my data structure, I initially had issues inputting my data into the schedule table. Using a nested async function, I helped to ensure that the nesting JSON structure be able to be inserted into the database. I also added an if statement to account for the Special Interest value. As not all meetings has special interest, this accounts for it and inserts a NULL in the database if it was undefined. Below is my code and screenshot of the query.  

```Javascript
//Loading in the schedule JSON file
var content = fs.readFileSync('/home/ec2-user/environment/week07/data/schedule10.JSON');
var scheduleContent = JSON.parse(content);

async.eachSeries(scheduleContent, function(meeting, callback) {
    async.eachSeries(meeting.meetings, function(value, callback) {
        const client = new Client(db_credentials);
        client.connect();
        var thisQuery = "INSERT INTO schedule VALUES ('"+ meeting.id +"','"+ value.day +"','"+ value.startTime +"','" + value.endTime + "','" + value.meetingType;
        if (value.specialInterest){ thisQuery += "','" + value.specialInterest}
        thisQuery += "');";
        client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        });
        setTimeout(callback, 1000);
    });  
    setTimeout(callback, 1000);
});  
```
![Schedule Query](https://github.com/lulujordanna/data-structures/blob/master/week07/images/scheduleQuery.png)

## Reflection / Next Steps
While reflecting on this weekly assignment there has been great strides in my coding abilities but some fallbacks as well. This weeks assignment had challenged me in ways I didn't believe I could complete and I am proud of how my database is structured. That being said, I chose to only parse the information I felt necessary for my final assignment and omitted the elements that I struggled to parse (accessibility and meeting notes). Moving forward I would like to find a way to clean up any inconsistencies with the address names in the strings.
