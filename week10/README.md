## Goals 
The goal of this weekly assignment is to create a web server application in Node.js that will respond to various requests for JSON data for AA meetings, process blog entries, and sensor readings. 

## Solution  
Builidng off of previous weekly assignments, I created a web server application that uses Express to load in data from each of the three databases. The outcome does not include html elements or styling yet, it just a representation of the queries to the database. I first loaded in all my dependenices; making the database credentials global variables to account for scoping as my SQL database is used for both the AA data and Sensor data. Once all of the dependenices were loaded in, I created the first express function to build my landing page. 

```javascript
//Dependenices 
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
To query the database for the AA Meetings, I used a query that Ryan and I wrote which connects a Location ID to a zone ID. Joining these two tables together is cruical in the data mapping of my final project. Once the query is successful, the data is pushed to an array called aaOutput which is the data type sent to the webpage using the express app.get function. 

```javascript
var aaOutput = []

app.get('/aa.html', function(req, res) {
    res.send(aaOutput);
});

//Current SQL Query for AA meetings
    var firstQuery = `WITH locationWithZone as (
                SELECT *, SPLIT_PART(l.locationid,'_',1) as zoneID
                FROM locationGeo l
                )
                 SELECT l.*, z.*
                 FROM locationWithZone l
                 INNER JOIN zoneNames z 
                    on l.zoneID  = z.zoneID;`;

client.query(firstQuery, (err, res) => {
    if (err) {throw err}
    else {
        aaOutput.push(res.rows);
        // console.log(aaOutput);
        // client.end();
    }
});
```

### Sensor - SQL 
As the Sensor data also uses a SQL database the process and Javascript was similar to the AA Meetings. I currently have 

```javascript
var sensorOutput = [];

app.get('/sensor.html', function(req, res) {
    res.send(sensorOutput);
});

//SQL query for sensor data: 
var thirdQuery = "SELECT * FROM sensorData;"; // print the number of rows for each sensorValue
    
    client.query(thirdQuery, (err, res) => {
        if (err) {throw err}
        else {
            // console.table(res.rows);
            sensorOutput.push(res.rows);
        }
         client.end();
    });
```
