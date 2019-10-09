// npm install aws-sdk
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
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});