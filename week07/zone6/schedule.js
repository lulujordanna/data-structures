const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config({path: '/home/ec2-user/environment/.env'});

var fs = require('fs');
var cheerio = require('cheerio');

var zone = '06'; 
var content = fs.readFileSync('/home/ec2-user/environment/week01/data/m'+zone+'.txt');
var $ = cheerio.load(content);


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

// Sample SQL statement to query the entire contents of a table: 
var thisQuery = "SELECT * FROM locationGeo;";

client.query(thisQuery, (err, res) => {
    if (err) {
        console.log(err);
    } else {
        var meetingData = []; 
        let locationData = res.rows;
        client.end();
        
        $('tr').each(function(l, trElem) {
            
            var address;
            
            $(trElem).children().each(function(i,elem) {
                
                if ($(elem).attr("style")=="border-bottom:1px solid #e3e3e3; width:260px"){
                    var streetAddress = $(elem).html().split('<br>')[2].trim().split(',')[0];
                    address = streetAddress; 
                }
            
                if ($(elem).attr("style")=="border-bottom:1px solid #e3e3e3;width:350px;"){
                    //console.log(address);
                    var meetingDetails = $(elem).text().trim(); 
                    meetingDetails = meetingDetails.replace(/[ \t] + /g, " ").trim(); 
                    meetingDetails = meetingDetails.replace(/[ \r\n | \n]/g, " ").trim(); 
                    meetingDetails = meetingDetails.replace(/[ \t]/g, " ").trim();
                    meetingDetails = meetingDetails.split('                    '); 
                    //console.log(meetingDetails, address); 
                    
                    var thisMeeting = {}; 
                    for (var i = 0; i < locationData.length; i++){
                        if (locationData[i].address == address){
                           var idF = locationData[i].locationid;
                           thisMeeting.id = idF;
                        }
                    }
                    
                    var thisMeetingDetails = [];
                    for (var i=0;i<meetingDetails.length;i++) {
                        var thisMeetingDetailObj = {};
                        thisMeetingDetailObj.day = meetingDetails[i].trim().split(" ")[0];
                        thisMeetingDetailObj.startTime = meetingDetails[i].trim().split("From")[1].trim().split('to')[0]; 
                        thisMeetingDetailObj.endTime = meetingDetails[i].trim().split("to")[1].trim().split('Meeting')[0];
                        if (meetingDetails[i].trim().split("Type")[1]) {
                            thisMeetingDetailObj.meetingType = meetingDetails[i].trim().split("Type")[1].trim().split("Special")[0];
                        } else {
                            //console.log('no meeting type found : \n', meetingDetails);
                            thisMeetingDetailObj.meetingType = 'not available';
                        }
                        thisMeetingDetailObj.specialInterest = meetingDetails[i].trim().split("Interest")[1];
                        thisMeetingDetails.push(thisMeetingDetailObj);
                    }
                    thisMeeting.meetings = thisMeetingDetails;
                    //console.log(thisMeeting);
                    
                    meetingData.push(thisMeeting); 
                }
            }); 
        });
        //console.log(meetingData[0]);
        fs.writeFileSync('/home/ec2-user/environment/week07/data/schedule'+zone+'.JSON', JSON.stringify(meetingData));
    }
});
