//Dependencies 
const { Client } = require('pg');
var async = require('async');
const dotenv = require('dotenv');
dotenv.config({path: '/home/ec2-user/environment/.env'});
var fs = require('fs');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = process.env.AWSRDS_USER;
db_credentials.host = process.env.AWSRDS_HOST;
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

//Loading in the schedule JSON file
var content = fs.readFileSync('/home/ec2-user/environment/week07/data/schedule10.JSON');
content = JSON.parse(content);

async.eachSeries(content, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO schedule VALUES ('"+ value.id +"', '"+ value.day +"', '"+ value.startTime +"', " + value.endTime + ", " + value.meetingType + ", " + value.specialInterest + ");";
    
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
});  