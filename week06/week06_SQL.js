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

SELECT lat, long, json_agg(json_build_object('Location', addressname, 'Address', address, 'Start Time', meetingstarttime, 'End Time', meetingendtime, 'Day', meetingday, 'Types', meetingtype, 'Special Interest', meetingspecialinterest)) as meetings 
FROM allAAData 
GROUP BY lat, long;`;


client.query(firstQuery, (err, res) => {
    if (err) {throw err}
    else {
        console.table(res.rows);
        client.end();
    }
});