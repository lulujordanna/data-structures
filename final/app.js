//Dependenices 
const dotenv = require('dotenv');
dotenv.config({path: '/home/ec2-user/environment/.env'});
const { Pool } = require('pg');
var express = require('express'),
    app = express();
    app.use(express.static('public'));

//SQL dependencies
 var db_credentials = new Object();
     db_credentials.user = process.env.AWSRDS_USER;
     db_credentials.host = process.env.AWSRDS_HOST;
     db_credentials.database = process.env.AWSRDS_DBNAME;
     db_credentials.password = process.env.AWSRDS_PW;
     db_credentials.port = 5432;

//DyanmoDB dependencies
var AWS = require('aws-sdk');
    AWS.config = new AWS.Config();
    AWS.config.region = "us-east-1";

//Handlebar dependencies
const handlebars = require('handlebars'); 
const fs = require('fs'); 

const indexSource = fs.readFileSync("aa.html").toString();
var template = handlebars.compile(indexSource, { strict: true });

const indexSource2 = fs.readFileSync("process.html").toString();
var template2 = handlebars.compile(indexSource2, { strict: true });

const indexSource3 = fs.readFileSync("sensor.html").toString();
var template3 = handlebars.compile(indexSource3, { strict: true });


////////////////////////////////
app.get('/aa', function(req, res) {
    
    const client = new Pool(db_credentials);
                       client.connect();
//SQL Query for AA Meetings
    var firstQuery = `WITH locationWithZone AS (
                SELECT *, SPLIT_PART(l.locationid,'_',1) as zoneID
                FROM locationGeo l),

            allAAData AS (
                SELECT l.*, z.*, s.*
                 FROM locationWithZone l
                 INNER JOIN zoneNames z 
                    on l.zoneID  = z.zoneID
                 INNER JOIN schedule s 
                    on l.locationid  = s.locationid)

            SELECT lat, long, json_agg(json_build_object('Location', addressname, 'Address', address, 'Neighborhood', zonename, 'Start Time', meetingstarttime, 'End Time', meetingendtime, 'Day', meetingday, 'Types', meetingtype, 'Special Interest', meetingspecialinterest)) as meetings 
            FROM allAAData 
            GROUP BY lat, long;`;

client.query(firstQuery, (qerr, qres) => {
    if (qerr) {throw qerr}
    else {
        res.end(template({aaData: JSON.stringify(qres.rows)}));
        client.end();
    }
  });
});
//////////////////////////////////
app.get('/sensor', function(req, res) {

const client = new Pool(db_credentials);

//SQL Query for Sensor Data
var secondQuery = `WITH newSensorData as (SELECT sensorTime - INTERVAL '5 hours' as adjSensorTime, * FROM sensorData)
                  SELECT
                        EXTRACT (MONTH FROM adjSensorTime) as sensorMonth, 
                        EXTRACT (DAY FROM adjSensorTime) as sensorDay,
                        EXTRACT (HOUR FROM adjSensorTime) as sensorHour, 
                        AVG(sensorValue::int) as temp_value
                        FROM newSensorData
                        GROUP BY sensorMonth, sensorDay, sensorHour
                        ORDER BY sensorMonth, sensorDay, sensorHour;`;
   
    client.connect();
    client.query(secondQuery, (qerr, qres) => {
        if (qerr) {throw qerr}
        else {
            res.end(template3({sensorData: JSON.stringify(qres.rows)}));
            client.end();
        }
  });
});
//////////////////////////////////

app.get('/process', function(req, res) {
    var processOutput = [];
    var dynamodb = new AWS.DynamoDB();
    
    var params = {
        TableName : "processblog",
        KeyConditionExpression: "#tp = :categoryName and #dt between :minDate and :maxDate", // Query for Process Blog
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
            // console.log("Query succeeded.");
            data.Items.forEach(function(item) {
            processOutput.push(item)
            });
         res.send(processOutput);
        }
    });
});
//////////////////////////////////

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});