*This folder has been used for debugging new queries. The details below highlight my progress from Week 06, October 14, 2019*

## Goal
The goal of this weeks assignment is to create queries from both the AA data in my PostgreSQL database and the Process Blog data in DynamoDB.

## Solution AA 
The goal of the query is to filter meetings based on parameters for the planned map. I queried the address, latitude and longitude as this was the current information I have populated in the PostgreSQL database. 
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
By modifying the starter code I was able to create a successful query from my DynamoDB database. In order to ensure that both the partition key and sort key were expressed in the query, I made the ExpressionAttributeNames align with the two values; category and date. In the final query I requested the Process Blog data between August 30th and December 11th. While there is only one Process Blog entry to be returned (see screenshot), I did test this out with the AA Meetings entries and changed the date parameters to ensure that different queries were successful. 

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
While I mentioned this above, my main goal would be to focus on more complex queries for the SQL database. This has to do with having more data available, which I am currently working on implementing by re-parsing additional information from the HTML pages. My process and code is available in my [week07](https://github.com/lulujordanna/data-structures/tree/master/week07) folder. 
