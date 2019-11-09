//Dependencies 
const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config({path:'/home/ec2-user/environment/.env'});


// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = process.env.AWSRDS_USER;
db_credentials.host = process.env.AWSRDS_HOST;
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;


const client = new Client(db_credentials);
client.connect();
var thisQuery = `INSERT INTO zoneNames
                 VALUES ('1', 'Financial District'), 
                 ('2', 'Lower East Side/Soho'), 
                 ('3', 'East Village/Chelsea'),
                 ('4', 'Midtown West'),
                 ('5', 'Midtown East'),
                 ('6', 'Upper West Side'),
                 ('7', 'Upper East Side'),
                 ('8', 'West Harlem'),
                 ('9', 'East Harlem'),
                 ('10', 'Washington Heights');`;

client.query(thisQuery, (err, res) => {
  console.log(err, res);
  client.end();
});
 