var express = require('express'), // npm install express
    app = express();

const dotenv = require('dotenv');
dotenv.config({path: '/home/ec2-user/environment/.env'});
const { Client } = require('pg');

var aaoutput = [];

//////////////////////////////////
app.get('/', function(req, res) {
    res.send(`<h1>Data Structures Apps</h1>
            <ul><li><a href="/aa.html">AA App.</a></li></ul>
            <ul><li><a href="/process.html">Process Blog App.</a></li></ul>
            <ul><li><a href="/sensor.html">Sensor App.</a></li></ul>`);
});

////////////////////////////////
app.get('/aa.html', function(req, res) {
    var db_credentials = new Object();
    db_credentials.user = process.env.AWSRDS_USER;
    db_credentials.host = process.env.AWSRDS_HOST;
    db_credentials.database = 'aa';
    db_credentials.password = process.env.AWSRDS_PW;
    db_credentials.port = 5432;

  const client = new Client(db_credentials);
  client.connect();

    var thisQuery = `WITH locationWithZone as (
                SELECT *, SPLIT_PART(l.locationid,'_',1) as zoneID
                FROM locationGeo l
                )

                 SELECT l.*, z.*
                 FROM locationWithZone l
                 INNER JOIN zoneNames z 
                    on l.zoneID  = z.zoneID
                 WHERE z.zoneName = 'Lower East Side/Soho';`;

    client.query(thisQuery, (err, response) => {
        var output = response.rows;
        aaoutput.push(output);
        console.log(err);
        var rawHtml = '';
        for (var i=0; i<aaoutput[0].length; i++){
            rawHtml += "<p>" + JSON.stringify(aaoutput[0][i]) + "</p>"
        }
        res.send(rawHtml);
        client.end();
    });
});

//////////////////////////////////

app.get('/process.html', function(req, res) {
    res.send('<h3>this is the page for my sensor data</h3>');
});

//////////////////////////////////

app.get('/sensor.html', function(req, res) {
    res.send('<h3>this is the page for my sensor data</h3>');
});

//////////////////////////////////

// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});