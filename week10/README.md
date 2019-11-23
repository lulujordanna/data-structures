## Goals 
The goal of this weekly assignment is to create a web server application in Node.js that will respond to various requests for JSON data for AA meetings, process blog entries, and sensor readings. 

## Solution  
Building off of previous weekly assignments, I created a web server application that uses Express to load in data from each of the three databases. The outcome does not include html elements or styling yet, it just a representation of the queries to the database. I first loaded in all my dependencies; making the database credentials global variables to account for scoping as my SQL database is used for both the AA data and Sensor data. Once all of the dependencies were loaded in, I created the first express function to build my landing page. 

```javascript
//Dependencies 
const dotenv = require('dotenv');
dotenv.config({path: '/home/ec2-user/environment/.env'});
const { Client } = require('pg');
var async = require('async');
var express = require('express'),
    app = express();

//SQL dependencies
 var db_credentials = new Object();
    db_credentials.user = process.env.AWSRDS_USER;
    db_credentials.host = process.env.AWSRDS_HOST;
    db_credentials.database = 'aa';
    db_credentials.password = process.env.AWSRDS_PW;
    db_credentials.port = 5432;

    const client = new Client(db_credentials);
    client.connect();

//DyanmoDB dependencies
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

//////////////////////////////////
app.get('/', function(req, res) {
    res.send(`<h1>Data Structures Final Assignments</h1>
            <ul><li><a href="/aa.html">Alcoholics Anonymous: Meeting Finder</a></li></ul>
            <ul><li><a href="/process.html">Learning JS: A Process Blog</a></li></ul>
            <ul><li><a href="/sensor.html">Cool November: A Temperature Visualization</a></li></ul>`);
});
```

### AA Meetings - SQL 
To query the database for the AA Meetings, I currently have a query that Ryan and I wrote which connects a the zone, location and schedule tables. Joining these three tables together is crucial in the data mapping of my final project. Once the query is successful, the data is pushed to an array called aaOutput which is the data type sent to the webpage using the express app.get function. While this query outputs all the data I need for the final assignment, as the locationID is joining to the schedule table, there is repeat values for the geographic information. I need to learn how to best aggregate this data so mutliple markers do not appear. 

```javascript
var aaOutput = []

app.get('/aa.html', function(req, res) {
    res.send(aaOutput);
});

//SQL Query for AA Meetings
    var firstQuery = `WITH locationWithZone as (
                SELECT *, SPLIT_PART(l.locationid,'_',1) as zoneID
                FROM locationGeo l)
                
                SELECT l.*, z.*, s.*
                 FROM locationWithZone l
                 INNER JOIN zoneNames z 
                    on l.zoneID  = z.zoneID
                 INNER JOIN schedule s 
                    on l.locationid  = s.locationid;`;

client.query(firstQuery, (err, res) => {
    if (err) {throw err}
    else {
        aaOutput.push(res.rows);
        // console.log(aaOutput);
        // client.end();
    }
});
```
![Image of aa data](https://github.com/lulujordanna/data-structures/blob/master/week10/images/aa.png)

### Sensor - SQL 
As the Sensor data also uses a SQL database the process and Javascript was similar to the AA Meetings. I wrote a query which converts the time from GMT to EST, extracts the month, day and hour from the timestamp, averages the temperature sensor value and then groups the data by this new information. Thanks to Ryan, I was able to learn about sub-queries which is the core functinality to convert the time. Of all of my endpoints, I feel that this one is in the best shape moving forward. 

```javascript
var secondQuery = `WITH newSensorData as (SELECT sensorTime - INTERVAL '5 hours' as adjSensorTime, * FROM sensorData)
                   SELECT
                        EXTRACT (MONTH FROM adjSensorTime) as sensorMonth, 
                        EXTRACT (DAY FROM adjSensorTime) as sensorDay,
                        EXTRACT (HOUR FROM adjSensorTime) as sensorHour, 
                        AVG(sensorValue::int) as temp_value
                        FROM newSensorData
                        GROUP BY sensorMonth, sensorDay, sensorHour
                        ORDER BY sensorMonth, sensorDay, sensorHour;`;
   
    client.query(secondQuery, (err, res) => {
        if (err) {throw err}
        else {
            // console.table(res.rows);
            sensorOutput.push(res.rows);
        }
         client.end();
    });
```
![Image of sensor data](https://github.com/lulujordanna/data-structures/blob/master/week10/images/sensor.png)

### Process Blog - NoSQL 
As the NoSQL database is a different query structure, I currently used the query from [Week 06](https://github.com/lulujordanna/data-structures/tree/master/week06) to display the meetings with the AA Meetings Category. 

```javascript
app.get('/process.html', function(req, res) {
    var processOutput = [];
    var dynamodb = new AWS.DynamoDB();
    
    var params = {
        TableName : "processblog",
        KeyConditionExpression: "#tp = :categoryName and #dt between :minDate and :maxDate", // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#tp" : "category", 
            "#dt" : "date"
        },
        ExpressionAttributeValues: { // the query values
            ":categoryName": {S: "AA Meetings"}, 
            ":minDate": {S: new Date("August 30, 2019").toDateString()},
            ":maxDate": {S: new Date("December 11, 2019").toDateString()}
        }
    };
    
    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
            processOutput.push(item)
            });
         res.send(processOutput);
        }
    });
});
```
![Image of process blog data](https://github.com/lulujordanna/data-structures/blob/master/week10/images/process.png)

## Next Steps 
While I am proud of my progression with Javascript this week, each of the endpoints highlight that greater aggregation in my data is needed. For AA, I need to learn how to aggregate based on location so that multiple markers do not appear. For the Process blog, I need to learn how to display more than one category at a time. Each has a significant learning curve which I am concerned about in the limited time frame left in the course. 
