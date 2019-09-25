const { Client } = require('pg');
const dotenv = require('dotenv');

// bring in dotenv to use credentials in .env file 
dotenv.config({path: '/home/ec2-user/environment/.env'});

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = process.env.AWSRDS_USER;
db_credentials.host = process.env.AWSRDS_HOST;
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

//Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to create a table: 
var thisQuery = "CREATE TABLE locationGeo (locationID int, address varchar(100), addressName varchar(100), lat double precision, long double precision);";
//var thisQuery = "CREATE TABLE schedule (locationID int, meetingID int, meetingDay varchar(100), meetingStartTime time, meetingEndTime time, meetingType varchar(100), meetingTypeDescription varchar(100));";
//var thisQuery = "CREATE TABLE meetings (meetingID int, meetingName varchar(100), meetingDetails varchar(100));";

// Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE locationGeo;"; 
// var thisQuery = "DROP TABLE schedule;"; 
// var thisQuery = "DROP TABLE meetings;"; 

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});