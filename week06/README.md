## Goal
The goal of this weeks assignment is to create queries from both the AA data in my PostgreSQL database and the Process Blog data in DynamoDB.

## Solution AA 
The goal of the query is to filter meetings based on parameters for the planned map. I queried the address, latitiude and longitude as this was the current information I have populated in the PostgreSQL database. 
I am currently working on parsing out more information from the HTML pages to be able to create further, more complex queries based on meeting times, day, etc. Below is the code and screenshot of the final outcome. 

```javascript
const { Client } = require('pg');
const cTable = require('console.table');
const dotenv = require('dotenv');
dotenv.config({path: '/home/ec2-user/environment/.env'});

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

// SQL statement to query address information
var thisQuery = "SELECT address, lat, long FROM locationGeo;"; 

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
        console.table(res.rows);
        client.end();
    }
});
```
![Image of SQL query](https://github.com/lulujordanna/data-structures/blob/master/week06/files/SQLQuery.png)

## Solution Process Blog
```javascript
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "processblog",
    KeyConditionExpression: "#tp = :categoryName and #dt between :minDate and :maxDate", // the query expression
    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        "#tp" : "category", 
        "#dt" : "date"
    },
    ExpressionAttributeValues: { // the query values
        ":categoryName": {S: "Process Blog"}, 
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
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});
```
![Image of NoSQL query](https://github.com/lulujordanna/data-structures/blob/master/week06/files/NoSQLQuery.png)



## Next Steps
